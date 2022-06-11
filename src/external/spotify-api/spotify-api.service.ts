import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
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
import { querystring } from '../../utils/querystring';
import { PlaybackStatus, SearchResults } from './spotify-interfaces';
import {
  RegisteredPlayer,
  Token,
  TokenPlayer,
  TokenWithCalculatedExpiration,
} from './token';

@Injectable()
export class SpotifyApiService implements OnModuleInit {
  constructor(private http: HttpService) {}
  private currentToken: TokenWithCalculatedExpiration;
  private currentRegisteredPlayer: RegisteredPlayer;

  onModuleInit() {
    this.loadToken().subscribe();
  }

  search(query: string): Promise<AxiosResponse<SearchResults>> {
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
          },
        },
      ),
    );

    this.currentRegisteredPlayer = {
      ...response.data,
      expires_at: Date.now() + response.data.expires_in - 10,
    };

    // TODO : prepare tasks for renewing token
  }

  async getPlaybackState(): Promise<AxiosResponse<PlaybackStatus>> {
    return firstValueFrom(
      this.http.get('https://api.spotify.com/v1/me/player', {
        headers: this.getAuthorizationHeaderForCurrentPlayer(),
      }),
    );
  }

  get redirectUrl() {
    if (!process.env.REDIRECT_HOST) {
      throw new ServiceUnavailableException('Redirect host not set on server');
    }
    return process.env.REDIRECT_HOST + '/admin/spotify-auth';
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
      Authorization: `${this.currentRegisteredPlayer.token_type} ${this.currentRegisteredPlayer.access_token}`,
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
