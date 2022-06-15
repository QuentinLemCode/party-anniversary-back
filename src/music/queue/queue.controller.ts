import { Body, Controller, Get, Post } from '@nestjs/common';
import { Music } from '../music.entity';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queue: QueueService) {}

  @Get()
  getQueue() {
    return this.queue.get();
  }

  @Post()
  pushToQueue(@Body() music: Music) {
    return this.queue.push(music);
  }
}
