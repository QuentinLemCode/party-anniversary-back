import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../auth/roles.decorator';
import { RolesGuard } from '../../auth/roles.guard';
import { UserRole } from '../../users/user.entity';
import { VoteSettingsService } from './vote-settings.service';

export interface VoteSettingsQuery {
  maxVotes: number;
}

@Controller('vote-settings')
export class VoteSettingsController {
  constructor(private readonly voteSettingsService: VoteSettingsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put()
  async setVoteSettings(
    @Body() voteSettings: VoteSettingsQuery,
  ): Promise<VoteSettingsQuery> {
    await this.voteSettingsService.setMaxVotes(voteSettings.maxVotes);
    return {
      maxVotes: this.voteSettingsService.maxVotes,
    };
  }

  @Get()
  getVoteSettings(): VoteSettingsQuery {
    return {
      maxVotes: this.voteSettingsService.maxVotes,
    };
  }
}
