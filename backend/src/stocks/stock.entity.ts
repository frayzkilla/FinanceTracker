import { Entity, Column, PrimaryGeneratedColumn, ManyToOne  } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  amount: number;

  @ManyToOne(() => User, (user) => user.stocks, { onDelete: 'CASCADE' })
  owner: User;
}