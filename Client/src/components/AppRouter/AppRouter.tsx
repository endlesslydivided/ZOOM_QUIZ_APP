import React, { createContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import UserSmMdLayout from '../../layouts/SmMdLayout/SmMdLayout';

import { ANSWER_ROUTE, QUIZZES_ROUTE, RESULTS_ROUTE } from '../../utils/consts';
import { SocketProvider } from '../SocketProvider/SocketProvider';


interface AppRouterProps {

}

export const PostListContext:any = createContext(null);

const AppRouter: React.FC<AppRouterProps>= () => {



 
    return (
        <SocketProvider>
            <Routes>
                <Route path={"/"} element={<UserSmMdLayout/>}>

                    <Route index element={<div>HELLO</div>}/>

                    <Route path={`${ANSWER_ROUTE}`} element={<div>HELLO</div>}/>

                    <Route path={`${RESULTS_ROUTE}`} element={<div>HELLO</div>}/>
                  

                </Route>
                <Route path="*" element={<Navigate to={QUIZZES_ROUTE}  replace={true}/>}/>
            </Routes>
        </SocketProvider>
    )
};

export default AppRouter