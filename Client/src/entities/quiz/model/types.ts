import { Answer, CreateAnswerDTO } from 'entities/answer';
import { PlaySession } from 'entities/playSession';

export type Quiz = {
    id: string;
    userId: string;
    text: string;
    playSessions: PlaySession[];
    answers: Answer[];
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
};

export type CreateQuizDTO = {
    text: string;
    answers: CreateAnswerDTO[];
};

export type UserQuiz = Omit<Quiz, 'deletedAt'>;
