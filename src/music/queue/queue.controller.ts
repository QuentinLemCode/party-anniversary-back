import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { UserRole } from '../../users/user.entity';
import { Music } from '../music.entity';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(private readonly queue: QueueService) {}

  @Get()
  getQueue() {
    return this.queue.get();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  pushToQueue(@Body() music: Music, @Req() req: Request) {
    const user = req.user;
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return this.queue.push(music, user.userId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  deleteFromQueue(@Param('id') id: string) {
    return this.queue.delete(id);
  }
}
