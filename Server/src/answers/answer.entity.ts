import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Quiz } from '../quizzes/quiz.entity';
import { Result } from '../results/result.entity';
import { BaseEntity } from '../share/entity/base.entity';

@Entity({ name: 'answer' })
export class Answer extends BaseEntity {
  @ApiProperty({ example: 'Sun', description: 'Quiz answer text' })
  @Column()
  text: string;

  @ApiProperty({ example: false, description: 'Is answer correct?' })
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
