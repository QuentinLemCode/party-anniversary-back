import {
  BadRequestException,
  Controller,
  Get,
  Query,
  ServiceUnavailableException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { SpotifyApiService } from '../external/spotify-api/spotify-api.service';
import { SearchResults } from '../external/spotify-api/spotify-interfaces';
import { Music } from '../interfaces/music';
@Controller('music')
export class MusicController {
  constructor(private spotify: SpotifyApiService) {}

  @Get('search')
  async search(@Query('query') query: string): Promise<Music[]> {
    if (!query) throw new BadRequestException('no query');
    return new Promise((resolve) => {
      this.spotify.search(query).subscribe({
        next: (response) => {
          resolve(this.mapResults(response.data));
        },
      });
    });
  }

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
      redirect_uri: 'http://localhost:4200/admin/spotify_auth',
      state: state,
    };
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
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
