import { Button, Typography } from 'antd';
import { Answer } from 'entities/answer';
import { UserPlaySession } from 'entities/playSession';
import { useCallback, useContext } from 'react';
import { Socket } from 'socket.io-client';

import {
    QuizServerEvent,
    SocketContext,
} from '../../../../shared/ui/SocketProvider/SocketProvider';

export const PlaySessionAnswerItem = ({
    answer,
    playSession,
}: {
    answer: Answer;
    playSession: UserPlaySession;
}) => {
    const socket: Socket | null = useContext<Socket | null>(SocketContext);

    const isResult = !!playSession.results && playSession.results?.length !== 0;

    const isUserAnswer =
        isResult && playSession.results?.[0]?.answer?.id === answer.id;

    const isCorrectAnswer =
        isResult &&
        playSession?.quiz?.answers?.find((a: Answer) => a.id === answer.id)
            ?.isCorrect;
    const resultClass = isCorrectAnswer ? 'correct-answer' : 'wrong-answer';

    const answerClasses = `answer-text ${isUserAnswer ? 'user-answer' : ''} ${
        isResult ? resultClass : ''
    }`;

    const answerQuiz = useCallback(
        (playSessionId: string, answerId: string) => {
            socket?.emit(QuizServerEvent.CLIENT_SENDS_ANSWER, {
                result: { playSessionId, answerId },
            });
        },
        [answer.id, playSession.id]
    );

    return (
        <Button
            disabled={isResult}
            className={answerClasses}
            block
            onClick={() => answerQuiz(playSession.id, answer.id)}
        >
            <Typography.Text>{answer.text}</Typography.Text>
        </Button>
    );
};
