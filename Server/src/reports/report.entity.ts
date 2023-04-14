import { Answer } from 'src/answers/answer.entity';
import { Quiz } from 'src/quizzes/quiz.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne } from 'typeorm';

@Entity({name:'report'})
export class Report {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @OneToMany(() => Answer,(answer) => answer.reports, {
    nullable:true
    })
  @JoinColumn() 
  answer: Answer;

  @OneToMany(() => Quiz,(quiz) => quiz.reports, {
    nullable:true
    })
  @JoinColumn() 
  quiz: Quiz;

  @Column()
  text: string;

}