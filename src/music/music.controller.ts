import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { JwtGuard } from 'src/auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { SpotifyApiService } from '../external/spotify-api/spotify-api.service';
import { SearchResults } from '../external/spotify-api/spotify-interfaces';
import { Music } from '../interfaces/music';
import { UserRole } from '../users/user.entity';
import { SpotifyOAuthDTO } from './music.interface';
@Controller('music')
export class MusicController {
  constructor(private spotify: SpotifyApiService) {}

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

  @Get('current-play')
  async currentPlay() {
    return (await this.spotify.getPlaybackState()).data;
  }

  @Post('register-player')
  async spotifyAuthentication(@Body() spotifyOAuth: SpotifyOAuthDTO) {
    await this.spotify.registerPlayer(spotifyOAuth.code);
    return { authenticated: true };
  }

  private mapResults(results: SearchResults): Music[] {
    return results.tracks.items.map((track) => {
      return {
        album: track.album.name,
        artist: track.artists.map((artist) => artist.name).join(', '),
        cover: track.album.images[0].url,
        uri: track.uri,
        title: track.name,
      };
    });
  }
}
