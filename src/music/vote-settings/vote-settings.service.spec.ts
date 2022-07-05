import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VoteSettings } from './vote-settings.entity';
import { VoteSettingsService } from './vote-settings.service';

describe('VoteSettingsService', () => {
  let service: VoteSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VoteSettingsService,
        {
          provide: getRepositoryToken(VoteSettings),
          useValue: {
            findOneBy: () => Promise.resolve({ id: 1, maxVotes: 3 }),
          },
        },
      ],
    }).compile();

    service = module.get<VoteSettingsService>(VoteSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
