import { Quiz } from 'src/quizzes/quiz.entity';
import { Result } from 'src/results/result.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'answer' })
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text: string;

  @Column({ default: false })
  isCorrect: boolean;

  @OneToMany(() => Result, (result) => result.answer, {
    nullable: true,
  })
  results: Result[];

  @ManyToOne(() => Quiz, (quiz) => quiz.answers)
  @JoinColumn({ name: 'quizId', referencedColumnName: 'id' })
  quiz: Quiz;
}
