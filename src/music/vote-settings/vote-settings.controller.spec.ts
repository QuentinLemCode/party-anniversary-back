import { Test, TestingModule } from '@nestjs/testing';
import { VoteSettingsController } from './vote-settings.controller';
import { VoteSettingsService } from './vote-settings.service';

describe('VoteSettingsController', () => {
  let controller: VoteSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoteSettingsController],
      providers: [
        {
          provide: VoteSettingsService,
          useValue: {
            maxVotes: { id: 1, maxVotes: 3 },
            setMaxVotes: () => null,
          },
        },
      ],
    }).compile();

    controller = module.get<VoteSettingsController>(VoteSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
