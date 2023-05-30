import { Answer } from 'entities/answer';
import { Quiz } from 'entities/quiz';
import { Result } from 'entities/result';

export type PlaySession = {
    id: string;
    meetId: string;
    quiz: Quiz;
    results: Result[];
    createdAt: string;
    updatedAt: string;
};

export type CreatePlaySessionDTO = {
    quizId: string;
    meetId: string;
};

export type PlaySessionReport = {
    correctAnswersCount: number;
    incorrectAnswersCount: number;
    overallAnswersCount: number;
};

export type UserPlaySession = {
    id: string;
    meetId: string;
    createdAt: string;
    quiz: Pick<Quiz, 'id' | 'userId' | 'text' | 'createdAt'> & {
        answers?: Answer[];
    };
    answers: Omit<Answer, 'results' | 'quiz'>[];
    result: Pick<Result, 'id' | 'createdAt'> | null;
    answer: Pick<Answer, 'id' | 'isCorrect'> | null;
    results?: Result[] | null;
};
