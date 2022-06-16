import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import {
  CurrentMusic,
  Music,
  QueueMusic,
  SpotifyOAuthDTO,
} from './music.interface';
import { QueueService } from './queue/queue.service';
import { SpotifyApiService } from './spotify/spotify-api.service';
import {
  SearchResponse,
  TrackObjectFull,
} from './spotify/types/spotify-interfaces';
import { AxiosError } from 'axios';
@Controller('music')
export class MusicController {
  constructor(
    private readonly spotify: SpotifyApiService,
    private readonly queue: QueueService,
  ) {}

  @UseGuards(JwtGuard)
  @Get('search')
  async search(@Query('query') query: string): Promise<Music[]> {
    if (!query) throw new BadRequestException('no query');
    const results = await this.spotify.search(query);
    return this.mapResults(results.data);
  }

  @UseGuards(JwtGuard)
  @Roles(UserRole.ADMIN)
  @Get('spotify-login')
  spotifyLogin() {
    const state = randomUUID();
    const scope =
      'user-modify-playback-state user-read-playback-state user-read-currently-playing user-read-recently-played user-read-playback-state';

    const url = new URL('https://accounts.spotify.com/authorize');
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    if (!client_id)
      throw new ServiceUnavailableException(
        'Spotify client ID not set on server',
      );

    const params = {
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: this.spotify.redirectUrl,
      state: state,
    };
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  }

  @Get()
  async currentState(): Promise<CurrentMusic> {
    const isSpotifyAccountRegistered = this.spotify.isAccountRegistered();
    if (!isSpotifyAccountRegistered) {
      return { isSpotifyAccountRegistered };
    }
    const queue = await this.queue.get();
    const currentPlay = (await this.currentPlay()) || null;
    return {
      isSpotifyAccountRegistered,
      queue,
      currentPlay,
    };
  }

  @Post('queue-music')
  @HttpCode(204)
  async queueMusic(@Body() queueMusic: QueueMusic) {
    await this.spotify.addToQueue(queueMusic.uri);
  }

  @Post('register-player')
  @UseGuards(JwtGuard)
  @Roles(UserRole.ADMIN)
  async spotifyAuthentication(@Body() spotifyOAuth: SpotifyOAuthDTO) {
    try {
      await this.spotify.registerPlayer(spotifyOAuth.code);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        throw new BadRequestException({
          spotifyMessage: error.response.data.error,
          isSpotifyAccountRegistered: this.spotify.isAccountRegistered(),
          message: 'Authentification Spotify invalide ou déjà utilisé',
        });
      }
    }
    return this.currentState();
  }

  private mapResults(results: SearchResponse): Music[] {
    return (
      results?.tracks?.items?.map((track) => this.mapTrackItemToMusic(track)) ||
      []
    );
  }

  private mapTrackItemToMusic(track: TrackObjectFull): Music {
    return {
      album: track.album.name,
      artist: track.artists.map((artist) => artist.name).join(', '),
      cover: track.album.images[0].url,
      uri: track.uri,
      title: track.name,
    };
  }

  private async currentPlay() {
    const response = await this.spotify.getPlaybackState();
    const playback = response.data;
    if (playback.item?.type !== 'track') return;
    return this.mapTrackItemToMusic(playback.item);
  }
}
