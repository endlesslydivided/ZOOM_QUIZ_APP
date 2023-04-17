import { Answer } from 'src/answers/answer.entity';
import { Quiz } from 'src/quizzes/quiz.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne, Relation, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({name:'report'})
export class Report {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => Answer,(answer) => answer.reports, {
    nullable:true
    })
  @JoinColumn({name:'answerId',referencedColumnName:'id'}) 
  answer: Answer;

  @ManyToOne(() => Quiz,(quiz) => quiz.reports, {
    nullable:true
    })
  @JoinColumn({name:'quizId',referencedColumnName:'id'}) 
  quiz: Quiz;

  @Column()
  text: string;

  
  @CreateDateColumn({name: 'createdAt'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updatedAt'})
  updatedAt: Date;

}