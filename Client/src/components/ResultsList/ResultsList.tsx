import './ResultsList.scss';

import { List, Pagination, PaginationProps, Space, Typography } from 'antd';
import React from 'react';

import { useAppSelector } from '../../hooks/redux';
import { usePagination } from '../../hooks/usePagination';
import { useGetPlaySessionsResultsQuery } from '../../services/PlaySessionsApiSlice';
import { setResults } from '../../store/slices/ResultsSlice';
import { RootState } from '../../store/store';
import { UserPlaySessionResult } from '../../types/storeSliceTypes';
import ResultsListItem from './ResultsListItem';


const ResultsList: React.FC = () => {
    const results: UserPlaySessionResult[] = useAppSelector(
        (state: RootState) => state.results
    );

    const { setFilters, filters, pagesCount, getContentResult } = usePagination(
        {
            setContent: setResults,
            getContentCB: useGetPlaySessionsResultsQuery,
            filtersParams: { limit: 10 },
        }
    );

    const onChangePage: PaginationProps['onChange'] = (page) =>
        setFilters((p) => {
            return { ...p, page };
        });

    return (
        <Space size={'middle'} direction='vertical'>
            <Typography.Title level={4} type={'secondary'}>
                Your quizzes results:
            </Typography.Title>
            <Pagination
                current={filters.page}
                defaultPageSize={filters.limit}
                total={pagesCount}
                onChange={onChangePage}
            />

            <List
                itemLayout='vertical'
                className='results-list'
                split={true}
                loading={getContentResult.isFetching}
                grid={{ gutter: 10, column: 2 }}
                dataSource={results}
                renderItem={(result: UserPlaySessionResult) => (
                    <ResultsListItem result={result} />
                )}
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

export default ResultsList;
