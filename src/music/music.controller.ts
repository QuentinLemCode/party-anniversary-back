import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
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

  private mapResults(results: SearchResults): Music[] {
    return results.tracks.items.map((track) => {
      return {
        album: track.album.name,
        artist: track.artists.map((artist) => artist.name).join(', '),
        cover: track.album.images[0].url,
        id: track.id,
        title: track.name,
      };
    });
  }
}
