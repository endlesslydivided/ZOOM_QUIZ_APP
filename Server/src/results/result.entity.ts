import { Answer } from 'src/answers/answer.entity';
import { PlaySession } from 'src/play-sessions/playSession.entity';
import { Quiz } from 'src/quizzes/quiz.entity';
import { Report } from 'src/reports/report.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, Relation, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({name:'result'})
export class Result {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => Answer,(answer) => answer.results, {nullable:true})
  @JoinColumn({name:'answerId',referencedColumnName:'id'}) 
  answer: Answer;

  @ManyToOne(() => PlaySession,(playSession) => playSession.results, {nullable:false})
  @JoinColumn({name:'playSessionId',referencedColumnName:'id'})
  playSession: PlaySession;

  @CreateDateColumn({name: 'createdAt'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updatedAt'})
  updatedAt: Date;
}