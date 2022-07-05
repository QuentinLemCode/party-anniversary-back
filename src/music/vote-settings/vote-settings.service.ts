import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoteSettings } from './vote-settings.entity';

@Injectable()
export class VoteSettingsService implements OnModuleInit {
  voteSetting: VoteSettings;
  constructor(
    @InjectRepository(VoteSettings)
    private readonly voteSettings: Repository<VoteSettings>,
  ) {}

  async onModuleInit() {
    let voteSetting = await this.voteSettings.findOneBy({ id: 1 });
    if (voteSetting === null) {
      voteSetting = this.voteSettings.create({ id: 1 });
      this.voteSettings.save(voteSetting);
    }
    this.voteSetting = voteSetting;
  }

  get maxVotes() {
    return this.voteSetting.maxVotes;
  }

  async setMaxVotes(value: number) {
    this.voteSetting.maxVotes = value;
    await this.voteSettings.save(this.voteSetting);
  }
}
