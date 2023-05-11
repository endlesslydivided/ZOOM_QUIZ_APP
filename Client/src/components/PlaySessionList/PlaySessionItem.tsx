import './PlaySessionList.scss';

import { Card, Collapse, List, Typography } from 'antd';
import React from 'react';

import { Answer } from '../../types/entityTypes';
import { UserPlaySession } from '../../types/storeSliceTypes';
import PlaySessionAnswerItem from './PlaySessionAnswerItem';

interface PlaySessionItemProps {
    playSession: UserPlaySession;
}

const PlaySessionItem: React.FC<PlaySessionItemProps> = ({ playSession }) => {
    const isResult = !!playSession.results && playSession.results?.length !== 0;

    const userAnswerId = isResult && playSession.results?.[0]?.answer?.id;

    const isCorrect =
        isResult &&
        playSession?.quiz?.answers?.find((a: Answer) => a.id === userAnswerId)
            ?.isCorrect;

    const yourAnswerText = isResult
        ? isCorrect
            ? ' Correct!'
            : ' Incorrect('
        : ' No answer';
    const yourAnswerStyle = isResult
        ? {
              color: isCorrect
                  ? 'rgba(9, 208, 59, 0.771)'
                  : 'rgba(214, 80, 80, 0.633)',
          }
        : {};

    return (
        <List.Item>
            <Card
                className='playsession-list-card'
                title={
                    <Typography.Text>
                        Quiz question:{' '}
                        <Typography.Text type='secondary'>
                            {playSession.quiz.text}
                        </Typography.Text>
                    </Typography.Text>
                }
                extra={
                    <Typography.Text>
                        Your answer:
                        {isResult ? (
                            <Typography.Text
                                style={yourAnswerStyle}
                                type='secondary'
                            >
                                {yourAnswerText}
                            </Typography.Text>
                        ) : (
                            <Typography.Text type='secondary'>
                                {' '}
                                No answer
                            </Typography.Text>
                        )}
                    </Typography.Text>
                }
            >
                <Collapse className='answers-collapse'>
                    <Collapse.Panel header='Reveal answers' key='1'>
                        {playSession.quiz.answers?.map((answer: Answer) => (
                            <PlaySessionAnswerItem
                                key={answer.id}
                                answer={answer}
                                playSession={playSession}
                            />
                        ))}
                    </Collapse.Panel>
                </Collapse>
            </Card>
        </List.Item>
    );
};

export default PlaySessionItem;
