import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { env } from 'process';
import { catchError, firstValueFrom, map, of, pipe, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { querystring } from '../../../utils/querystring';
import { SpotifyAccount } from '../spotify-account.entity';
import { TokenPlayer } from '../token';
import {
  CurrentPlaybackResponse,
  SpotifyTrackCategory,
  SpotifyURI,
} from '../types/spotify-interfaces';
import type { AxiosResponse } from 'axios';

export type PlaybackState =
  | {
      registered: true;
      currentPlayback: CurrentPlaybackResponse;
    }
  | {
      registered: false;
    };

export type APIErrorTypes =
  | 'invalid_token'
  | 'invalid_request'
  | 'invalid_scope'
  | 'no-device'
  | 'unregistered'
  | 'unknown';

export type APIResult<T = void> = {
  status: 'success' | 'error';
  cause?: APIErrorTypes;
  data?: T extends any ? T : never;
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

  async unregisterPlayer() {
    this.currentRegisteredAccount.access_token = '';
    this.currentRegisteredAccount.expires_at = new Date().getTime() - 1;
    this.currentRegisteredAccount.refresh_token = '';
    this.currentRegisteredAccount.token_type = '';
    this.currentRegisteredAccount.scope = '';
    this.spotifyAccount.save(this.currentRegisteredAccount);
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
          catchError((err) => {
            this.logError(err);
            return throwError(() => err);
          }),
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
      return this.error('unregistered');
    }
    return firstValueFrom(
      this.http
        .post(
          'https://api.spotify.com/v1/me/player/next',
          {},
          {
            headers: this.getAuthorizationHeaderForCurrentPlayer(),
          },
        )
        .pipe(this.pipeResponse()),
    );
  }

  async addToQueue(uri: SpotifyURI<SpotifyTrackCategory>): Promise<APIResult> {
    if (!this.isAccountRegistered) {
      return this.error('unregistered');
    }
    return firstValueFrom(
      this.http
        .post(
          'https://api.spotify.com/v1/me/player/queue',
          {},
          {
            headers: this.getAuthorizationHeaderForCurrentPlayer(),
            params: {
              uri,
            },
          },
        )
        .pipe(this.pipeResponse()),
    );
  }

  async play(uri: SpotifyURI<SpotifyTrackCategory>): Promise<APIResult> {
    if (!this.isAccountRegistered) {
      return this.error('unregistered');
    }
    return firstValueFrom(
      this.http
        .put(
          'https://api.spotify.com/v1/me/player/play',
          {
            uris: [uri],
          },
          {
            headers: this.getAuthorizationHeaderForCurrentPlayer(),
          },
        )
        .pipe(
          this.pipeResponse((status) => {
            if (status === 404) {
              return this.error('no-device');
            }
          }),
        ),
    );
  }

  get redirectUrl() {
    if (!process.env.REDIRECT_HOST) {
      throw new ServiceUnavailableException('Redirect host not set on server');
    }
    return process.env.REDIRECT_HOST + '/admin/spotify-device';
  }

  private pipeResponse(errorCase?: (status: number) => APIResult | void) {
    return pipe(
      map((response: AxiosResponse<any, any>) => {
        return this.success(response.data);
      }),
      catchError((err) => {
        this.logError(err);
        if (errorCase) {
          const error = errorCase(err.status);
          if (error) return of(error);
        }
        return of(this.error('unknown'));
      }),
    );
  }

  private success<T = void>(data?: T): APIResult<T> {
    if (!data) {
      return { status: 'success' };
    }
    return {
      status: 'success',
      data,
    };
  }

  private error(cause: APIErrorTypes): APIResult<void> {
    return {
      status: 'error',
      cause,
    };
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

  private logError(err: any) {
    const message = [err?.message, err?.response?.data?.error?.message]
      .filter((a) => !!a)
      .join(' - ');
    this.logger.error(message);
  }
}
