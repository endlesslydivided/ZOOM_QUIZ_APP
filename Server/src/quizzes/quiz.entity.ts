import { Answer } from 'src/answers/answer.entity';
import { PlaySession } from 'src/play-sessions/playSession.entity';
import { Report } from 'src/reports/report.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, Relation, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({name:'quiz'})
export class Quiz {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  text: string;

  @OneToMany(() => Report,(report) => report.quiz, {
    nullable:true,
    createForeignKeyConstraints: true
    })
  reports: Report[];

  @OneToMany(() => PlaySession,(session) => session.quiz, {
    nullable:false,
    createForeignKeyConstraints: true
    })
  playSession: PlaySession[];

  @OneToMany(() => Answer,(answer) => answer.quiz, {
    createForeignKeyConstraints: true
    })
  answers: Answer[];

  @CreateDateColumn({name: 'createdAt'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updatedAt'})
  updatedAt: Date;

}