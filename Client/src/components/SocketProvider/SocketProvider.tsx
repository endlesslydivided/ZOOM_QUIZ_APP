import { Col, notification, Row, Typography } from 'antd';
import React, { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import {  appendPlaySession, updateResultPlaySession } from '../../store/slices/PlaySessionsSlice';
import { ANSWER_ROUTE } from '../../utils/consts';
import './SocketProvider.scss';
import { RootState } from '../../store/store';

const io = require('socket.io-client');

export enum QuizClientEvent 
{
    SERVER_SENDS_ANSWERS = 'SERVER_SENDS_ANSWER',
    SERVER_PROVIDES_QUIZ = 'SERVER_PROVIDES_QUIZ'
}

export enum QuizServerEvent 
{
    CLIENT_PROVIDES_QUIZ = 'CLIENT_PROVIDES_QUIZ',
    CLIENT_SENDS_ANSWER = 'CLIENT_SENDS_ANSWER'
}

interface SocketProviderProps
{
    children: string | JSX.Element | JSX.Element[]
}

export const SocketContext:any = createContext(null);

export const SocketProvider:React.FC<SocketProviderProps> = ({children}) => {

    const context = useAppSelector((state:RootState) => state.zoomContext.context);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [socket,setSocket]:any = useState(null);
    const [api, contextHolder] = notification.useNotification();
    const openNotification = ({message,description,key}:any) => {
        api.open({
          message,
          description,
          className: 'socket-notify',
          placement:'bottomLeft',
          duration:300,
          key
        });
    };


    useEffect(() =>
    {
        if (!socket) 
        {
            setSocket(io.connect(process.env.REACT_APP_BACK_URI, 
                {
                    path: '/play-quiz',
                    withCredentials: true,
                    auth:{context},
                    extraHeaders:{
                        'x-zoom-app-context':context
                    }
                }));
        }
        else
        {
          socket.on(QuizClientEvent.SERVER_PROVIDES_QUIZ,async (data: any) => {
            dispatch(appendPlaySession(data));  
            if(!window.location.pathname.match(ANSWER_ROUTE))   
            {
                api.destroy(data.id);
                openNotification(
                {
                    key:data.id,
                    message:(
                        <Row gutter={[10,10]} style={{flexWrap:'nowrap',cursor:'pointer'}} onClick={() => {
                            navigate(`${ANSWER_ROUTE}`)
                            api.destroy(data.id);
                        }}>
                            <Col>
                                <Typography.Title level={5}>New quiz!</Typography.Title>
                                <Typography.Text>{data.quiz.text}</Typography.Text>
                            </Col>
                        </Row>
                    )
                })
            }
          });

          socket.on(QuizClientEvent.SERVER_SENDS_ANSWERS,async (data: any) => {
            dispatch(updateResultPlaySession(data));     
          });
        }       
    },[socket])

    

  return (
  <>
    {contextHolder}
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
  </>
  )     
}




 
  
  