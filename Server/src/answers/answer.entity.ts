import { Quiz } from 'src/quizzes/quiz.entity';
import { Report } from 'src/reports/report.entity';
import { Result } from 'src/results/result.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity({name:'answer'})
export class Answer {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column({ default: false })
  isCorrect: boolean;
  
  @OneToMany(() => Report,(report) => report.answer, {
    eager: true,
    nullable:true
    })
  @JoinColumn() 
  reports: Report[];

  @OneToMany(() => Result,(result) => result.answer, {
    nullable:true
    })
  @JoinColumn() 
  results: Result[];

  @OneToMany(() => Quiz,(quiz) => quiz.answers)
  @JoinColumn() 
  quiz: Quiz;

 


}