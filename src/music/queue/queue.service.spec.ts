import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Music } from '../music.entity';
import { SpotifyApiService } from '../spotify/spotify-api.service';
import {
  CurrentPlaybackResponse,
  TrackObjectFull,
} from '../spotify/types/spotify-interfaces';
import { Queue, Status } from './queue.entity';
import { QueueService } from './queue.service';

describe('QueueService', () => {
  let service: QueueService;
  const spySpotifyApiService = jest.createMockFromModule<SpotifyApiService>(
    '../spotify/spotify-api.service',
  );

  const mockMusic: Music = {
    artist: 'artist',
    title: 'title',
    album: 'album',
    uri: 'spotify:track:id',
    cover: 'url',
    duration: 1000,
    queue: [],
  };
  const mockQueue: Partial<Queue> = {
    id: 1,
    music: mockMusic,
    status: Status.PENDING,
  };
  const mockTrackItem: TrackObjectFull = {
    uri: 'spotify:track:id',
    duration_ms: 1000,
  } as unknown as TrackObjectFull;
  const mockPlaybackResponse: Partial<CurrentPlaybackResponse> = {
    progress_ms: 100,
    item: mockTrackItem,
  };

  beforeEach(async () => {
    spySpotifyApiService.isAccountRegistered = jest.fn(() => true);
    jest.useFakeTimers();

    const module: TestingModule = await Test.createTestingModule({
      imports: [ScheduleModule.forRoot()],
      providers: [
        QueueService,
        {
          provide: getRepositoryToken(Queue),
          useValue: {
            save: (obj: Queue) => obj,
            find: (conditions: any) => {
              if (conditions?.where?.status._value === "'1'") {
                return [];
              } else {
                return [mockQueue];
              }
            },
          },
        },
        {
          provide: SpotifyApiService,
          useValue: spySpotifyApiService,
        },
      ],
    }).compile();
    spySpotifyApiService.addToQueue = jest.fn(async () => {
      return;
    });
    spySpotifyApiService.getPlaybackState = jest.fn(() => {
      return Promise.resolve({
        registered: true,
        currentPlayback: mockPlaybackResponse as CurrentPlaybackResponse,
      });
    });
    service = module.get<QueueService>(QueueService);
    service.onModuleInit();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(spySpotifyApiService.isAccountRegistered).toHaveBeenCalled();
  });

  it('should reprogram timer if music is paused', async () => {
    expect(spySpotifyApiService.addToQueue).toHaveBeenCalledWith(mockMusic.uri);
    expect(jest.getTimerCount()).toBe(1);
    jest.runAllTimers();
    expect(spySpotifyApiService.getPlaybackState).toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  // the music has been paused
  // the music has been manually edited
  // we should put music in queue again
});
