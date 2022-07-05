import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../users/users.service';
import { QueueEngineService } from './queue-engine/queue-engine.service';
import { QueueController } from './queue.controller';
import { QueueService } from './queue.service';

describe('QueueController', () => {
  let controller: QueueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QueueController],
      providers: [
        {
          provide: QueueService,
          useValue: {
            getQueue: () => null,
            addToQueue: () => null,
          },
        },
        {
          provide: UsersService,
          useValue: {
            findById: () => null,
          },
        },
        {
          provide: QueueEngineService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<QueueController>(QueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
