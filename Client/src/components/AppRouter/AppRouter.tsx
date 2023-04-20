import React, { createContext, useEffect } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import UserSmMdLayout from '../../layouts/SmMdLayout/SmMdLayout';

import { ANSWER_ROUTE, QUIZZES_ROUTE, RESULTS_ROUTE } from '../../utils/consts';
import { SocketProvider } from '../SocketProvider/SocketProvider';
import QuizPage from '../../pages/QuizPage/QuizPage';
import ResultsPage from '../../pages/ResultsPage/ResultsPage';
import AnswerPage from '../../pages/AnswerPage';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setContext } from '../../store/slices/ZoomContextSlice';
import { Typography, notification } from 'antd';
import { getCookie } from '../../utils/cookie';
import { useGetContextQuery } from '../../services/AuthApiSlice';
import './AppRouter.scss'
import { UploadOutlined } from '@ant-design/icons';
import Loader from '../Loader';


interface AppRouterProps {

}

export const PostListContext:any = createContext(null);

const AppRouter: React.FC<AppRouterProps>= () => {

    const dispatch = useAppDispatch();
    const zoomContext:any = useAppSelector((state:any) => state.zoomContext.context);
    const getContextResult = useGetContextQuery({});

    useEffect(() =>
    {
        const zoomContextParam = new URLSearchParams(window.location.search).get("context");
        if(zoomContextParam)
        {
            dispatch(setContext(zoomContextParam));
        }
    },[])

    if(getContextResult.isFetching || getContextResult.isLoading)
    {
        return <Loader/>
    }

    if(!zoomContext)
    {
        return (
        <div className='install-text-container'>
            <UploadOutlined />

            <Typography.Text type='secondary'>
                <Link to={process.env.REACT_APP_BACK_URI + '/install'}>Install</Link> app and open it from ZOOM!
            </Typography.Text>
        </div>)
    }
 
    return (
        <SocketProvider>
            <Routes>
                <Route path={"/"} element={<UserSmMdLayout/>}>

                    <Route index element={<QuizPage/>}/>

                    <Route path={`${ANSWER_ROUTE}`} element={<AnswerPage/>}/>

                    <Route path={`${RESULTS_ROUTE}`} element={<ResultsPage/>}/>
                  

                </Route>
                <Route path="*" element={<Navigate to={`${QUIZZES_ROUTE}`}  replace={true}/>}/>
            </Routes>
        </SocketProvider>
    )
};

export default AppRouter