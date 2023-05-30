import { Answer } from '../../answer';
import { PlaySession, UserPlaySession } from '../../playSession';

export type Result = {
    id: string;
    userId: string;
    answer: Answer;
    playSession: PlaySession;
    createdAt: string;
    updatedAt: string;
};

export type CreateResultDTO = {
    answerId: string;
    userId: string;
    playSessionId: string;
};

export type UserPlaySessionResult = UserPlaySession & {
    result: Pick<Result, 'id' | 'createdAt'>;
    answer: Pick<Answer, 'id' | 'isCorrect'>;
};
