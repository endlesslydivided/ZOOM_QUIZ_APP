import './index.scss';

import { UploadOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import React, { useEffect } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { API_URL } from 'shared/config';

import { useGetContextQuery } from '../entities/auth/api/slice';
import { setContext } from '../entities/zoomContext/api/slice';
import UserSmMdLayout from '../layouts/SmMdLayout/SmMdLayout';
import { RootState } from '../shared/api/store';
import { useAppDispatch, useAppSelector } from '../shared/hooks/redux';
import Loader from '../shared/ui/Loader';
import { SocketProvider } from '../shared/ui/SocketProvider/SocketProvider';
import AnswerPage from './AnswerPage';
import QuizPage from './QuizPage/QuizPage';
import ResultsPage from './ResultsPage/ResultsPage';

export enum AppRoutes {
    QUIZZES_ROUTE = '/',
    ANSWER_ROUTE = '/answer',
    RESULTS_ROUTE = '/results',
}

const AppRouter: React.FC = () => {
    const dispatch = useAppDispatch();
    const zoomContext = useAppSelector(
        (state: RootState) => state.zoomContext.context
    );
    const getContextResult = useGetContextQuery(null);

    useEffect(() => {
        const zoomContextParam = new URLSearchParams(
            window.location.search
        ).get('context');
        if (zoomContextParam) {
            dispatch(setContext(zoomContextParam));
        }
    }, []);

    if (getContextResult.isFetching || getContextResult.isLoading) {
        return <Loader />;
    }

    if (!zoomContext) {
        return (
            <div className='install-text-container'>
                <UploadOutlined />

                <Typography.Text type='secondary'>
                    <Link to={API_URL + '/install'}>Install</Link> app and open
                    it from ZOOM!
                </Typography.Text>
            </div>
        );
    }

    return (
        <SocketProvider>
            <Routes>
                <Route path={'/'} element={<UserSmMdLayout />}>
                    <Route index element={<QuizPage />} />

                    <Route
                        path={`${AppRoutes.ANSWER_ROUTE}`}
                        element={<AnswerPage />}
                    />

                    <Route
                        path={`${AppRoutes.RESULTS_ROUTE}`}
                        element={<ResultsPage />}
                    />
                </Route>
                <Route
                    path='*'
                    element={
                        <Navigate
                            to={`${AppRoutes.QUIZZES_ROUTE}`}
                            replace={true}
                        />
                    }
                />
            </Routes>
        </SocketProvider>
    );
};

export default AppRouter;
