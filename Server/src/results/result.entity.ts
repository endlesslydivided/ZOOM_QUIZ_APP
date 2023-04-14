import { Answer } from 'src/answers/answer.entity';
import { Quiz } from 'src/quizzes/quiz.entity';
import { Report } from 'src/reports/report.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity({name:'result'})
export class Result {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToMany(() => Answer,(answer) => answer.results, {
    nullable:true
    })
  @JoinColumn() 
  answer: Answer;

}