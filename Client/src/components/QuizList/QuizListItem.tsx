import './QuizList.scss';

import {
    CloseOutlined,
    InfoCircleOutlined,
    SendOutlined,
} from '@ant-design/icons';
import { Button, Card, Collapse, List, Tooltip, Typography } from 'antd';
import React, { useCallback, useContext, useState } from 'react';
import { Socket } from 'socket.io-client';

import { useAppSelector } from '../../hooks/redux';
import { useDeleteQuiz } from '../../hooks/useDeleteQuiz';
import { RootState } from '../../store/store';
import { Answer } from '../../types/entityTypes';
import { UserQuiz } from '../../types/storeSliceTypes';
import {
    QuizServerEvent,
    SocketContext,
} from '../SocketProvider/SocketProvider';
import QuizStatsModal from './QuizStatsModal';

interface QuizListItemProps {
    quiz: UserQuiz;
}

const QuizListItem: React.FC<QuizListItemProps> = ({ quiz }) => {
    const context = useAppSelector(
        (state: RootState) => state.zoomContext.decrypted
    );
    const { onDeleteClickHandler } = useDeleteQuiz({ entity: quiz });
    const socket: Socket | null = useContext(SocketContext);

    const [isModalOpened, setIsModalOpened] = useState(false);

    const provideQuiz = useCallback((quizId: string) => {
        socket?.emit(QuizServerEvent.CLIENT_PROVIDES_QUIZ, {
            playSession: { quizId },
        });
    },[quiz.id])

    return (
        <List.Item>
            <QuizStatsModal
                isModalOpened={isModalOpened}
                setIsModalOpened={setIsModalOpened}
                playSessions={quiz.playSessions}
            />
            <Card
                className='quiz-list-card'
                title={
                    <>
                        <Typography.Text>
                            Quiz question:{' '}
                            <Typography.Text type='secondary'>
                                {quiz.text}
                            </Typography.Text>
                        </Typography.Text>
                    </>
                }
                extra={
                    <>
                        <Tooltip
                            title={
                                context?.mid
                                    ? 'Send quiz'
                                    : 'Only active on meetings'
                            }
                        >
                            <Button
                                onClick={() => provideQuiz(quiz.id)}
                                disabled={!context?.mid}
                                icon={<SendOutlined />}
                                type='text'
                            >
                                Activate quiz
                            </Button>
                        </Tooltip>
                        <Button
                            shape='circle'
                            icon={<CloseOutlined />}
                            type='text'
                            onClick={() => onDeleteClickHandler()}
                        ></Button>
                        <Button
                            shape='circle'
                            icon={<InfoCircleOutlined />}
                            type='text'
                            onClick={() => setIsModalOpened(true)}
                        ></Button>
                    </>
                }
            >
                <Collapse className='answers-collapse'>
                    <Collapse.Panel header='Reveal answer' key='1'>
                        {quiz.answers.map((answer: Answer) => (
                            <Card
                                key={answer.id}
                                className={`answer-text ${
                                    answer.isCorrect
                                        ? 'correct-answer'
                                        : 'wrong-answer'
                                }`}
                            >
                                <Typography.Text>{answer.text}</Typography.Text>
                            </Card>
                        ))}
                    </Collapse.Panel>
                </Collapse>
            </Card>
        </List.Item>
    );
};

export default QuizListItem;
