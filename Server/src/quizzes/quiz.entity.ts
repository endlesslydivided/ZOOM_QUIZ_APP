import { Answer } from '../answers/answer.entity';
import { PlaySession } from '../play-sessions/playSession.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'quiz' })
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  text: string;

  @OneToMany(() => PlaySession, (session) => session.quiz, {
    nullable: false,
    createForeignKeyConstraints: true,
  })
  playSessions: PlaySession[];

  @OneToMany(() => Answer, (answer) => answer.quiz, {
    createForeignKeyConstraints: true,
  })
  answers: Answer[];

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt?: Date;
}
