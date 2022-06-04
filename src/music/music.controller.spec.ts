import { Test, TestingModule } from '@nestjs/testing';
import { EMPTY } from 'rxjs';
import { SpotifyApiService } from '../external/spotify-api/spotify-api.service';
import { MusicController } from './music.controller';

describe('MusicController', () => {
  let controller: MusicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MusicController],
      providers: [
        {
          provide: SpotifyApiService,
          useValue: {
            search: () => EMPTY,
          },
        },
      ],
    }).compile();

    controller = module.get<MusicController>(MusicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
