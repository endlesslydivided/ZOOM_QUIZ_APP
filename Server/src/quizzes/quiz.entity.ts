import { Answer } from 'src/answers/answer.entity';
import { Report } from 'src/reports/report.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';

@Entity({name:'quiz'})
export class Quiz {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  text: string;

  @OneToMany(() => Report,(report) => report.quiz, {
    eager: true,
    nullable:true
    })
  @JoinColumn() 
  reports: Report[];

  @OneToMany(() => Answer,(answer) => answer.quiz, {
    eager: true,
    })
  @JoinColumn() 
  answers: Answer[];



}