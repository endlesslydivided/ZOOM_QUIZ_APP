import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { Quiz } from '../quizzes/quiz.entity';
import { Result } from '../results/result.entity';
import { BaseModelEntity } from '../share/entity/baseModel.entity';

@Entity({ name: 'playSession' })
export class PlaySession extends BaseModelEntity {
  @ApiProperty({
    example: '792b9eec-1450-437d-9e9d-f220bf335336',
    description: 'Meet unique id',
  })
  @Column()
  meetId: string;

  @ManyToOne(() => Quiz, {
    eager: true,
    nullable: false,
    createForeignKeyConstraints: true,
  })
  @JoinColumn({ name: 'quizId', referencedColumnName: 'id' })
  quiz: Quiz;

  @OneToMany(() => Result, (result) => result.playSession, {
    createForeignKeyConstraints: true,
  })
  results: Result[];
}
