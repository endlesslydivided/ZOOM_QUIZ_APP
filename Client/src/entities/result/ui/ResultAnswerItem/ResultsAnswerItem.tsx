import { Card, Typography } from 'antd';
import { Answer } from 'entities/answer';
import { UserPlaySessionResult } from 'entities/result';

export const ResultsAnswerItem = ({
    answer,
    result,
}: {
    answer: Answer;
    result: UserPlaySessionResult;
}) => {
    const isResult = !!result.results && result.results?.length !== 0;

    const isUserAnswer =
        isResult && result.results?.[0].answer?.id === answer.id;

    const isCorrectAnswer =
        isResult &&
        result?.quiz?.answers?.find((a: Answer) => a.id === answer.id)
            ?.isCorrect;
    const resultClass = isCorrectAnswer ? 'correct-answer' : 'wrong-answer';

    const answerClasses = `answer-text ${isUserAnswer ? 'user-answer' : ''} ${
        isResult ? resultClass : ''
    }`;

    return (
        <Card className={answerClasses}>
            <Typography.Text>{answer.text}</Typography.Text>
            {isUserAnswer && (
                <Typography.Text type='secondary'>
                    {' '}
                    - Your answer
                </Typography.Text>
            )}
        </Card>
    );
};
