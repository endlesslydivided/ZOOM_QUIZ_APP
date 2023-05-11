export type CreatePlaySessionDTO = {
    quizId: string;
    meetId: string;
};

export type CreateAnswerDTO = {
    text: string;
    isCorrect: boolean;
};

export type CreateQuizDTO = {
    text: string;
    answers: CreateAnswerDTO[];
};

export type CreateResultDTO = {
    answerId: string;
    userId: string;
    playSessionId: string;
};

export type Report = {
    correctAnswersCount: number;
    incorrectAnswersCount: number;
    overallAnswersCount: number;
};

export type Filters = {
    page?: number;
    limit?: number;
};
