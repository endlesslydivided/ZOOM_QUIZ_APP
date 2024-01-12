import { Quiz } from '../../quiz/model/types';
import { Result } from '../../result/model/types';

export type Answer = {
    id: string;
    text: string;
    isCorrect: boolean;
    results: Result[];
    quiz: Quiz;
};

export type CreateAnswerDTO = {
    text: string;
    isCorrect: boolean;
};
