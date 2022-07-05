import { SchedulerRegistry } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyApiService } from '../../spotify/spotify-api/spotify-api.service';
import { VoteSettingsService } from '../../vote-settings/vote-settings.service';
import { QueueService } from '../queue.service';
import { QueueEngineService } from './queue-engine.service';

describe('QueueEngineService', () => {
  let service: QueueEngineService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueEngineService,
        { provide: SpotifyApiService, useValue: {} },
        { provide: QueueService, useValue: {} },
        { provide: SchedulerRegistry, useValue: {} },
        { provide: VoteSettingsService, useValue: {} },
      ],
    }).compile();

    service = module.get<QueueEngineService>(QueueEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
