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
import { UsersService } from '../../users/users.service';
import { Music } from '../music.entity';
import { QueueEngineService } from './queue-engine/queue-engine.service';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
  constructor(
    private readonly queue: QueueService,
    private readonly users: UsersService,
    private readonly queueEngine: QueueEngineService,
  ) {}

  @Get()
  getQueue() {
    return this.queue.get();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  pushToQueue(@Body() music: Music, @Req() req: Request) {
    return this.queue.push(music, this.getUser(req).userId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  deleteFromQueue(@Param('id') id: string) {
    return this.queue.delete(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('backlog')
  pushToBacklog(@Body() music: Music, @Req() req: Request) {
    return this.queue.pushBacklog(music, this.getUser(req).userId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('backlog')
  getBackLog() {
    return this.queue.getBacklog();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/:id/forward')
  async forwardQueue(@Param('id') id: string, @Req() req: Request) {
    const user = await this.users.findById(this.getUser(req).userId);
    if (user === null) {
      throw new BadRequestException('User not found in database');
    }
    return this.queueEngine.forward(id, user);
  }

  private getUser(req: Request) {
    const user = req.user;
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }
}
