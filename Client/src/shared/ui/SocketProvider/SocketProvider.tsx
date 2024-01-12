import './SocketProvider.scss';

import { Col, notification, Row, Typography } from 'antd';
import { UserPlaySession } from 'entities/playSession';
import { Result } from 'entities/result';
import { AppRoutes } from 'pages';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { API_URL } from 'shared/config';
import { Socket } from 'socket.io-client';
import * as io from 'socket.io-client';

import {
    appendPlaySession,
    updateResultPlaySession,
} from '../../../entities/playSession/model/slice';
import { RootState } from '../../api/store';
import { useAppSelector } from '../../hooks/redux';

export enum QuizClientEvent {
    SERVER_SENDS_ANSWERS = 'SERVER_SENDS_ANSWER',
    SERVER_PROVIDES_QUIZ = 'SERVER_PROVIDES_QUIZ',
}

export enum QuizServerEvent {
    CLIENT_PROVIDES_QUIZ = 'CLIENT_PROVIDES_QUIZ',
    CLIENT_SENDS_ANSWER = 'CLIENT_SENDS_ANSWER',
}

interface SocketProviderProps {
    children: string | JSX.Element | JSX.Element[];
}

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const context = useAppSelector(
        (state: RootState) => state.zoomContext.context
    );

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [socket, setSocket] = useState<Socket | null>(null);
    const [api, contextHolder] = notification.useNotification();
    const openNotification = ({
        message,
        description,
        key,
    }: {
        message: ReactNode;
        description?: string;
        key: string;
    }) => {
        api.open({
            message,
            description,
            className: 'socket-notify',
            placement: 'bottomLeft',
            duration: 300,
            key,
        });
    };

    useEffect(() => {
        if (!socket) {
            setSocket(
                io.connect(API_URL as string, {
                    path: '/play-quiz',
                    withCredentials: true,
                    auth: { context },
                    extraHeaders: {
                        'x-zoom-app-context': context as string,
                    },
                })
            );
        } else {
            socket.on(
                QuizClientEvent.SERVER_PROVIDES_QUIZ,
                async (data: UserPlaySession) => {
                    dispatch(appendPlaySession(data));
                    if (
                        !window.location.pathname.match(AppRoutes.ANSWER_ROUTE)
                    ) {
                        api.destroy(data.id);
                        openNotification({
                            key: data.id,
                            message: (
                                <Row
                                    gutter={[10, 10]}
                                    style={{
                                        flexWrap: 'nowrap',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                        navigate(`${AppRoutes.ANSWER_ROUTE}`);
                                        api.destroy(data.id);
                                    }}
                                >
                                    <Col>
                                        <Typography.Title level={5}>
                                            New quiz!
                                        </Typography.Title>
                                        <Typography.Text>
                                            {data.quiz.text}
                                        </Typography.Text>
                                    </Col>
                                </Row>
                            ),
                        });
                    }
                }
            );

            socket.on(
                QuizClientEvent.SERVER_SENDS_ANSWERS,
                async (data: Result) => {
                    dispatch(updateResultPlaySession(data));
                }
            );
        }
    }, [socket]);

    return (
        <>
            {contextHolder}
            <SocketContext.Provider value={socket}>
                {children}
            </SocketContext.Provider>
        </>
    );
};
