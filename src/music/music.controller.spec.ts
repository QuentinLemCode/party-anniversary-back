import { Test, TestingModule } from '@nestjs/testing';
import { EMPTY } from 'rxjs';
import { JwtGuard } from 'src/auth/jwt.guard';
import { MusicController } from './music.controller';
import { QueueService } from './queue/queue.service';
import { SpotifyApiService } from './spotify/spotify-api.service';

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
        {
          provide: JwtGuard,
          useValue: {},
        },
        {
          provide: QueueService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<MusicController>(MusicController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
