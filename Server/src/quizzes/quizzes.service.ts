import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Answer } from 'src/answers/answer.entity';
import { ZoomContext } from 'src/auth/decorators/zoomContext.decorator';
import DBQueryParameters from 'src/requestFeatures/dbquery.params';
import {
  DataSource,
  QueryRunner,
  Repository,
  TypeORMError,
  UpdateResult,
} from 'typeorm';
import { CreateQuizDTO } from './dto/createQuiz.dto';
import { Quiz } from './quiz.entity';

@Injectable()
export class QuizzesService {
  constructor(private dataSource: DataSource) {}

  async createQuiz(
    quizDto: CreateQuizDTO,
    context: ZoomContext,
  ): Promise<Quiz> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const answers: Answer[] = await Promise.all(
      quizDto.answers.map(async (a) => {
        const answer: Answer = new Answer();
        answer.isCorrect = a.isCorrect;
        answer.text = a.text;

        const answerResult: Answer = await queryRunner.manager
          .save(answer)
          .catch(async (error: TypeORMError) => {
            await queryRunner.rollbackTransaction();
            await queryRunner.release();
            throw new InternalServerErrorException(
              'Quiz is not created. Internal server error occured.',
            );
          });
        return answerResult;
      }),
    );

    const quiz: Quiz = new Quiz();

    quiz.text = quizDto.text;
    quiz.answers = answers;
    quiz.userId = context.uid;

    const quizResult: Quiz = await queryRunner.manager
      .save(quiz)
      .catch(async (error: TypeORMError) => {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        throw new InternalServerErrorException(
          'Quiz is not created. Internal server error occured.',
        );
      });

    await queryRunner.commitTransaction();
    await queryRunner.release();
    return quizResult;
  }

  async getUserQuizzes(
    filters: DBQueryParameters,
    context: ZoomContext,
  ): Promise<[Quiz[], number]> {
    const quizRepository: Repository<Quiz> =
      this.dataSource.getRepository(Quiz);
    const quizzes: [Quiz[], number] = await quizRepository
      .findAndCount({
        take: filters.limit,
        skip: filters.offset,
        where: { userId: context.uid },
        relations: { answers: true, playSessions: true },
      })
      .catch((error: TypeORMError) => {
        console.log(error);
        throw new InternalServerErrorException(
          'User quizzes aren`t found. Internal server error occure',
        );
      });
    return quizzes;
  }

  async getOneQuiz(quizId: string): Promise<Quiz> {
    const quizRepository = this.dataSource.getRepository(Quiz);
    const quizz = await quizRepository
      .findOneBy({ id: quizId })
      .catch((error: TypeORMError) => {
        console.log(error);
        throw new InternalServerErrorException(
          'Quiz isn`t found. Internal server error occure',
        );
      });
    return quizz;
  }

  async getQuizAnswers(quizId: string): Promise<Answer[]> {
    const answerRepository: Repository<Answer> =
      this.dataSource.getRepository(Answer);
    const answers: Answer[] = await answerRepository
      .findBy({ quiz: { id: quizId } })
      .catch((error: TypeORMError) => {
        console.log(error);
        throw new InternalServerErrorException(
          'Answers aren`t found. Internal server error occure',
        );
      });
    return answers;
  }

  async deleteQuiz(quizId: string): Promise<UpdateResult> {
    const quizRepository: Repository<Quiz> =
      this.dataSource.getRepository(Quiz);
    const result: UpdateResult = await quizRepository
      .softDelete(quizId)
      .catch((error: TypeORMError) => {
        console.log(error);
        throw new InternalServerErrorException(
          'Quiz isn`t deleted. Internal server error occure',
        );
      });
    return result;
  }
}
