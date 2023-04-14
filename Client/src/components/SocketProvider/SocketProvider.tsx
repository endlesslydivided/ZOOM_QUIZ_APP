import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, notification, Row, Typography } from 'antd';
import React, { createContext, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';

import './SocketProvider.scss'

const io:any = require('socket.io-client');

export enum ChatClientEvent 
{

}

export enum ChatServerEvent 
{

}
interface SocketProviderProps
{
    children: string | JSX.Element | JSX.Element[]
}

export const SocketContext:any = createContext(null);

export const SocketProvider:React.FC<SocketProviderProps> = ({children}) => {

    const [socket,setSocket]:any = useState(null);
    const dispatch = useDispatch();
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
            setSocket(io.connect(process.env.REACT_APP_BACK_SERVER_API_WS, 
                {
                    path: '/chat',
                    withCredentials: true,
                }));
        }
        else
        {
           
        }       
    },[socket])

  return (<>
    {contextHolder}
    <SocketContext.Provider value={socket}>
        {children}
    </SocketContext.Provider>
    </>
  )
}




 
  
  