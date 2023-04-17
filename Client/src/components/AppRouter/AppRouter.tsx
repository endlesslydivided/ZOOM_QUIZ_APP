import React, { createContext, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import UserSmMdLayout from '../../layouts/SmMdLayout/SmMdLayout';

import { ANSWER_ROUTE, QUIZZES_ROUTE, RESULTS_ROUTE } from '../../utils/consts';
import { SocketProvider } from '../SocketProvider/SocketProvider';
import QuizPage from '../../pages/QuizPage/QuizPage';
import ResultsPage from '../../pages/ResultsPage/ResultsPage';
import AnswerPage from '../../pages/AnswerPage';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setContext } from '../../store/slices/ZoomContextSlice';
import { Typography } from 'antd';


interface AppRouterProps {

}

export const PostListContext:any = createContext(null);

const AppRouter: React.FC<AppRouterProps>= () => {

    const dispatch = useAppDispatch();
    const zoomContext:any = useAppSelector((state:any) => state.zoomContext.context)

    useEffect(() =>
    {
        const zoomContext = new URLSearchParams(window.location.search).get("context");
        if(zoomContext)
        {
            dispatch(setContext(zoomContext));
        }
    },[])

    if(!zoomContext)
    {
        return <Typography.Title>Install app and open it from ZOOM!</Typography.Title>
    }
 
    return (
        <SocketProvider>
            <Routes>
                <Route path={"/"} element={<UserSmMdLayout/>}>

                    <Route index element={<QuizPage/>}/>

                    <Route path={`${ANSWER_ROUTE}`} element={<AnswerPage/>}/>

                    <Route path={`${RESULTS_ROUTE}`} element={<ResultsPage/>}/>
                  

                </Route>
                <Route path="*" element={<Navigate to={QUIZZES_ROUTE}  replace={true}/>}/>
            </Routes>
        </SocketProvider>
    )
};

export default AppRouter