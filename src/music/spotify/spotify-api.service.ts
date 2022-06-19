import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosResponse } from 'axios';
import { env } from 'process';
import {
  catchError,
  EMPTY,
  first,
  firstValueFrom,
  map,
  mergeMap,
  Observable,
  of,
  tap,
} from 'rxjs';
import { Repository } from 'typeorm';
import { querystring } from '../../utils/querystring';
import { SpotifyAccount } from './spotify-account.entity';
import { Token, TokenPlayer, TokenWithCalculatedExpiration } from './token';
import {
  CurrentPlaybackResponse,
  SearchResponse,
  SpotifyTrackCategory,
  SpotifyURI,
} from './types/spotify-interfaces';

@Injectable()
export class SpotifyApiService implements OnModuleInit {
  constructor(
    private http: HttpService,
    @InjectRepository(SpotifyAccount)
    private spotifyAccount: Repository<SpotifyAccount>,
  ) {}
  private currentToken: TokenWithCalculatedExpiration;
  private currentRegisteredAccount: SpotifyAccount;

  // TODO error check on each request

  private readonly formUrlContentTypeHeader = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  async onModuleInit() {
    this.loadToken().subscribe();
    this.currentRegisteredAccount = await this.getAccount();
  }

  search(query: string): Promise<AxiosResponse<SearchResponse>> {
    return firstValueFrom(
      this.key.pipe(
        first(),
        mergeMap((key) => {
          return this.http.get('https://api.spotify.com/v1/search', {
            params: {
              q: query,
              type: 'track,artist',
              limit: 20,
              market: 'FR',
            },
            headers: {
              Authorization: 'Bearer ' + key,
            },
          });
        }),
      ),
    );
  }

  getToken(): Observable<AxiosResponse<Token>> {
    return this.http.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              env.SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_KEY,
            ).toString('base64'),
        },
      },
    );
  }

  isAccountRegistered(): boolean {
    return (
      this.currentRegisteredAccount.expires_at !== null &&
      this.currentRegisteredAccount.expires_at >= Date.now()
    );
  }

  async registerPlayer(code: string) {
    const form = {
      code: code,
      redirect_uri: this.redirectUrl,
      grant_type: 'authorization_code',
    };

    const response = await firstValueFrom(
      this.http.post<TokenPlayer>(
        'https://accounts.spotify.com/api/token',
        querystring(form),
        {
          headers: {
            Authorization:
              'Basic ' +
              Buffer.from(
                env.SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_KEY,
              ).toString('base64'),
            ...this.formUrlContentTypeHeader,
          },
        },
      ),
    );

    const account = {
      ...(await this.getAccount()),
      ...response.data,
      expires_at: Date.now() + (response.data.expires_in - 10) * 1000,
    };
    await this.spotifyAccount.save(account);
    this.currentRegisteredAccount = account;

    // TODO : prepare tasks for renewing token
  }

  async getPlaybackState(): Promise<CurrentPlaybackResponse> {
    return firstValueFrom(
      this.http.get('https://api.spotify.com/v1/me/player', {
        headers: {
          ...this.getAuthorizationHeaderForCurrentPlayer(),
        },
      }),
    ).then((response) => response.data);
  }

  async skipToNext() {
    return firstValueFrom(
      this.http.post(
        'https://api.spotify.com/v1/me/player/next',
        {},
        {
          headers: this.getAuthorizationHeaderForCurrentPlayer(),
        },
      ),
    );
  }

  async addToQueue(uri: SpotifyURI<SpotifyTrackCategory>): Promise<void> {
    return firstValueFrom(
      this.http.post(
        'https://api.spotify.com/v1/me/player/queue',
        {},
        {
          headers: this.getAuthorizationHeaderForCurrentPlayer(),
          params: {
            uri,
          },
        },
      ),
    ).then(() => {
      return;
    });
  }

  get redirectUrl() {
    if (!process.env.REDIRECT_HOST) {
      throw new ServiceUnavailableException('Redirect host not set on server');
    }
    return process.env.REDIRECT_HOST + '/admin/spotify-device';
  }

  private async getAccount(): Promise<SpotifyAccount> {
    let account = await this.spotifyAccount.findOneBy({ id: 1 });
    if (!account) {
      account = this.spotifyAccount.create({ id: 1 });
      this.spotifyAccount.save(account);
    }
    return account;
  }

  private loadToken(): Observable<Token> {
    return this.getToken().pipe(
      map((response) => response.data),
      tap((token) => this.saveToken(token)),
      catchError((error) => {
        console.error(error);
        return EMPTY;
      }),
    );
  }

  private getAuthorizationHeaderForCurrentPlayer() {
    return {
      Authorization: `${this.currentRegisteredAccount.token_type} ${this.currentRegisteredAccount.access_token}`,
    };
  }

  private saveToken(token: Token) {
    this.currentToken = {
      ...token,
      expiryDate: new Date(new Date().getTime() + token.expires_in * 1000),
    };
  }

  private get key(): Observable<string> {
    if (this.currentToken?.expiryDate <= new Date()) {
      return of(this.currentToken.access_token);
    }
    return this.loadToken().pipe(map((token) => token.access_token));
  }
}
