import './QuizList.scss';

import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    List,
    Pagination,
    PaginationProps,
    Space,
    Typography,
} from 'antd';
import { setQuizzes, useGetUserQuizzesQuery, UserQuiz } from 'entities/quiz';
import QuizListItem from 'entities/quiz/ui/QuizListItem/QuizListItem';
import { useState } from 'react';
import React from 'react';
import { RootState } from 'shared/api/store';
import { useAppSelector } from 'shared/hooks/redux';
import { usePagination } from 'shared/hooks/usePagination';
import QuizForm from 'widgets/Forms/QuizForm';

export const QuizList: React.FC = () => {
    const quizzes: UserQuiz[] = useAppSelector(
        (state: RootState) => state.quizzes
    );

    const [isFormOpened, setIsFormOpened] = useState(false);
    const { setFilters, filters, pagesCount, getContentResult } = usePagination(
        {
            setContent: setQuizzes,
            getContentCB: useGetUserQuizzesQuery,
        }
    );

    const onChangePage: PaginationProps['onChange'] = (page) =>
        setFilters((p) => {
            return { ...p, page };
        });

    return (
        <Space size={'middle'} direction='vertical'>
            <QuizForm
                isFormOpened={isFormOpened}
                setIsFormOpened={setIsFormOpened}
            />

            <Button
                onClick={() => setIsFormOpened(true)}
                block
                icon={<PlusOutlined />}
            >
                {' '}
                Add new quiz
            </Button>

            <Typography.Title level={4} type={'secondary'}>
                Your quizzes:
            </Typography.Title>

            <Pagination
                current={filters.page}
                defaultPageSize={filters.limit}
                total={pagesCount}
                onChange={onChangePage}
            />

            <List
                itemLayout='horizontal'
                loading={getContentResult.isFetching}
                className='quiz-list'
                split={true}
                grid={{ gutter: 10, column: 1 }}
                size={'small'}
                dataSource={quizzes}
                renderItem={(quiz: UserQuiz) => <QuizListItem quiz={quiz} />}
            />
            <Pagination
                current={filters.page}
                defaultPageSize={filters.limit}
                total={pagesCount}
                onChange={onChangePage}
            />
        </Space>
    );
};
