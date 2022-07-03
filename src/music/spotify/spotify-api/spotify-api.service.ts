import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { env } from 'process';
import { firstValueFrom, map } from 'rxjs';
import { Repository } from 'typeorm';
import { querystring } from '../../../utils/querystring';
import { SpotifyAccount } from '../spotify-account.entity';
import { TokenPlayer } from '../token';
import {
  CurrentPlaybackResponse,
  SpotifyTrackCategory,
  SpotifyURI,
} from '../types/spotify-interfaces';

export type PlaybackState =
  | {
      registered: true;
      currentPlayback: CurrentPlaybackResponse;
    }
  | {
      registered: false;
    };

@Injectable()
export class SpotifyApiService implements OnModuleInit {
  constructor(
    private http: HttpService,
    @InjectRepository(SpotifyAccount)
    private spotifyAccount: Repository<SpotifyAccount>,
  ) {}

  private currentRegisteredAccount: SpotifyAccount;
  private readonly logger = new Logger('SpotifyAPI');

  // TODO error check on each request

  private readonly formUrlContentTypeHeader = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  async onModuleInit() {
    this.currentRegisteredAccount = await this.getAccount();
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

  async getPlaybackState(): Promise<PlaybackState> {
    if (!this.isAccountRegistered) {
      return {
        registered: false,
      };
    }
    return firstValueFrom(
      this.http
        .get<CurrentPlaybackResponse>('https://api.spotify.com/v1/me/player', {
          headers: {
            ...this.getAuthorizationHeaderForCurrentPlayer(),
          },
        })
        .pipe(
          map((response) => {
            return {
              registered: true,
              currentPlayback: response.data,
            };
          }),
        ),
    );
  }

  async skipToNext() {
    if (!this.isAccountRegistered) {
      return;
    }
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
    if (!this.isAccountRegistered) {
      return;
    }
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

  private getAuthorizationHeaderForCurrentPlayer() {
    return {
      Authorization: `${this.currentRegisteredAccount.token_type} ${this.currentRegisteredAccount.access_token}`,
    };
  }
}
