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
import { useState } from 'react';
import React from 'react';

import { useAppSelector } from '../../hooks/redux';
import { usePagination } from '../../hooks/usePagination';
import { useGetUserQuizzesQuery } from '../../services/QuizzesApiSlice';
import { setQuizzes } from '../../store/slices/QuizzesSlice';
import { RootState } from '../../store/store';
import { UserQuiz } from '../../types/storeSliceTypes';
import QuizForm from '../QuizForm/QuizForm';
import QuizListItem from './QuizListItem';


const QuizList: React.FC = () => {
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

export default QuizList;
