import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Quiz } from '../quizzes/quiz.entity';
import { Result } from 'src/results/result.entity';

@Entity({name:'playSession'})
export class PlaySession {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  meetId: string;


  @ManyToOne(() => Quiz, {
    eager:true,
    nullable:false,
    createForeignKeyConstraints: true,
    })
  @JoinColumn({name:'quizId',referencedColumnName:'id'})
  quiz: Quiz;

  @OneToMany(() => Result,(result) => result.playSession, {
    createForeignKeyConstraints: true
  })
  results: Result[];


  @CreateDateColumn({name: 'createdAt'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updatedAt'})
  updatedAt: Date;

}