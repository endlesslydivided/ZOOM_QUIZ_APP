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

interface PlaySessionListProps
{

}



const PlaySessionList:React.FC<PlaySessionListProps> = () =>
{
    const playSessions:any = useAppSelector((state:any) => state.playSessions);


    const dispatch = useDispatch();

    const socket:any = useContext(SocketContext);

    const playSessionsResult = useGetPlaySessionsQuery({});

    useNotify(
        {
            result:playSessionsResult,
            successCB:() =>
            {
                const data = playSessionsResult.data;
            }
    }) 

    const answerQuiz = (answerId:string) =>
    {
    }
     

    return (
        <Space size={'middle'} direction="vertical">
    
        <Typography.Title level={4} type={"secondary"}>Answer quizzes:</Typography.Title>

        <List 
          itemLayout="horizontal" 
          className="quiz-list" 
          split={true} 
          size={"small"} 
          dataSource={playSessions}
          renderItem={(session:any) => 
            <List.Item>
                <Card   className="playsession-list-card" 
                        title={
                        <Typography.Text>
                            Quiz question: <Typography.Text type="secondary">{session.text}</Typography.Text>
                        </Typography.Text>}>
                        
                    
                    
                    <Collapse className="answers-collapse">
                        <Collapse.Panel header="Reveal answer" key="1">
                        {
                            session.answers.map((answer:any) =>
                            <Card className={`answer-text ${answer.isCorrect  ? 'correct-answer' : 'wrong-answer'}`}>
                                <Typography.Text>{answer.text}</Typography.Text>
                            </Card>
                                
                            )
                        }
                        </Collapse.Panel>
                       
                    </Collapse>
                    </Card>

            </List.Item>}/>
        </Space>
    )

}

export default PlaySessionList;


