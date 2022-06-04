import { Controller, Post } from '@nestjs/common';
import { Music } from '../interfaces/music';

@Controller('music')
export class MusicController {
  @Post('search')
  search(query: string): Music[] {
    return [
      {
        album: 'test',
        title: 'test',
        artist: 'test',
        cover: 'https://fakeimg.pl/300/',
        id: 1,
      },
    ];
  }
}
