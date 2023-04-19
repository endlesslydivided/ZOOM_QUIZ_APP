import { Button, Card, Collapse, List, Modal, Space, Typography, notification } from "antd";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/redux";
import { useNotify } from "../../hooks/useNotify";
import { useGetUserQuizzesQuery } from "../../services/QuizzesApiSlice";
import { setQuizzes } from "../../store/slices/QuizzesSlice";
import { PlusOutlined, SendOutlined } from "@ant-design/icons";
import QuizForm from "../QuizForm/QuizForm";
import { useContext, useEffect, useState } from "react";
import './PlaySessionList.scss'
import { QuizServerEvent, SocketContext } from "../SocketProvider/SocketProvider";
import { RootState } from "../../store/store";
import { useGetPlaySessionsQuery } from "../../services/PlaySessionsApiSlice";
import { setPlaySessions } from "../../store/slices/PlaySessionsSlice";
import PlaySessionItem from "./PlaySessionItem";

interface PlaySessionListProps
{

}



const PlaySessionList:React.FC<PlaySessionListProps> = () =>
{
    const playSessionsState:any = useAppSelector((state:any) => state.playSessions);

    const dispatch = useDispatch();

    const playSessions = useGetPlaySessionsQuery({});

    useNotify(
        {
            result:playSessions,
            successCB:() =>
            {
                const data = playSessions.data;
                dispatch(setPlaySessions(data));
            }
    }) 

 

    return (
        <Space size={'middle'} direction="vertical">
    
        <Typography.Title level={4} type={"secondary"}>Answer quizzes:</Typography.Title>

        <List 
          itemLayout="horizontal" 
          className="playsession-list" 
          split={true} 
          size={"small"} 
          loading={playSessions.isFetching} 

          grid={{gutter:10,column:1}}
          dataSource={playSessionsState}
          renderItem={(playSession:any) => <PlaySessionItem playSession={playSession}/>}/>
        </Space>
    )

}

export default PlaySessionList;

