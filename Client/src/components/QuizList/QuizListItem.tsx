import { CloseOutlined, InfoCircleOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Card, Collapse, List, Space, Tooltip, Typography, notification } from "antd";
import React, { useContext, useEffect, useState } from 'react';
import { useAppSelector } from "../../hooks/redux";
import { QuizServerEvent, SocketContext } from "../SocketProvider/SocketProvider";
import './QuizList.scss';
import { useDeleteQuiz } from "../../hooks/useDeleteQuiz";
import QuizStatsModal from "./QuizStatsModal";

interface QuizListItemProps
{
    quiz:any;
}

const QuizListItem:React.FC<QuizListItemProps> = ({quiz}) =>
{

    const context:any = useAppSelector((state:any) => state.zoomContext.decrypted);
    const {onDeleteClickHandler} = useDeleteQuiz({entity:quiz})
    const socket:any = useContext(SocketContext);

    const [isModalOpened,setIsModalOpened] = useState(false);

    const provideQuiz = (quizId:string) =>
    {
        socket.emit(QuizServerEvent.CLIENT_PROVIDES_QUIZ,{playSession:{quizId}});
    }


  return (
    <List.Item>
        <QuizStatsModal isModalOpened={isModalOpened} setIsModalOpened={setIsModalOpened} playSessions={quiz.playSessions}/>
        <Card   
            className="quiz-list-card" 
            title=
            {
                <>
                    <Typography.Text>
                        Quiz question: <Typography.Text type="secondary">{quiz.text}</Typography.Text>
                    </Typography.Text>
                </>
            }
            extra=
            {
                <>
                <Tooltip title={!!context?.mid ? 'Send quiz' : 'Only active on meetings'}> 
                    <Button onClick={() =>provideQuiz(quiz.id)} disabled={!!!context?.mid} icon={<SendOutlined/>} type="text">
                        Activate quiz
                    </Button>
                </Tooltip> 
                <Button shape="circle"  icon={<CloseOutlined/>} type="text" onClick={() => onDeleteClickHandler()}></Button>
                <Button shape="circle"  icon={<InfoCircleOutlined/>} type="text" onClick={() => setIsModalOpened(true)}></Button>

                </>
            }>
            
            
            <Collapse className="answers-collapse">
                <Collapse.Panel header="Reveal answer" key="1">
                {
                    quiz.answers.map((answer:any) =>
                    <Card className={`answer-text ${answer.isCorrect  ? 'correct-answer' : 'wrong-answer'}`}>
                        <Typography.Text>{answer.text}</Typography.Text>
                    </Card>
                        
                    )
                }
                </Collapse.Panel>
                
            </Collapse>
            </Card>
    </List.Item>
  )
}

export default QuizListItem