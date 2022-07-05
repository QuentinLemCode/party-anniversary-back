import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class VoteSettings {
  @PrimaryColumn()
  id: number;

  @Column({ default: 3 })
  maxVotes: number;
}
