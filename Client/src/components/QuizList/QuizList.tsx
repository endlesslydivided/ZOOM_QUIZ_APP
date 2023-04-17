import { Button, Card, Collapse, List, Modal, Space, Typography, notification } from "antd";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/redux";
import { useNotify } from "../../hooks/useNotify";
import { useGetUserQuizzesQuery } from "../../services/QuizzesApiSlice";
import { setQuizzes } from "../../store/slices/QuizzesSlice";
import { PlusOutlined, SendOutlined } from "@ant-design/icons";
import QuizForm from "../QuizForm/QuizForm";
import { useContext, useEffect, useState } from "react";
import './QuizList.scss'
import { QuizServerEvent, SocketContext } from "../SocketProvider/SocketProvider";
import { RootState } from "../../store/store";

interface QuizListProps
{

}



const QuizList:React.FC<QuizListProps> = () =>
{
    const quizzes:any = useAppSelector((state:any) => state.quizzes);


    const dispatch = useDispatch();
    const [isFormOpened, setIsFormOpened] = useState(false);

    const socket:any = useContext(SocketContext);

    const quizzesResult = useGetUserQuizzesQuery({});

    useNotify(
        {
            result:quizzesResult,
            successCB:() =>
            {
                const data = quizzesResult.data;
                dispatch(setQuizzes(data));
            }
    }) 

    const provideQuiz = (quizId:string) =>
    {
        socket.emit(QuizServerEvent.CLIENT_PROVIDES_QUIZ,{playSession:{quizId}});
    }
     

    return (
        <Space size={'middle'} direction="vertical">
        <QuizForm isFormOpened={isFormOpened} setIsFormOpened={setIsFormOpened}/>
        
        <Button onClick={() => setIsFormOpened(true)} block icon={<PlusOutlined/>}></Button>

        <Typography.Title level={4} type={"secondary"}>Your quizzes:</Typography.Title>

        <List 
          itemLayout="horizontal" 
          loading={quizzesResult.isFetching} 
          className="quiz-list" 
          split={true} 
          size={"small"} 
          dataSource={quizzes}
          renderItem={(quiz:any) => 
            <List.Item>
                <Card   className="quiz-list-card" 
                        title={
                        <Typography.Text>
                            Quiz question: <Typography.Text type="secondary">{quiz.text}</Typography.Text>
                        </Typography.Text>}
                        extra={<Button onClick={() =>provideQuiz(quiz.id)}  
                        icon={<SendOutlined/>} 
                        type="text">Activate quiz</Button>}>
                    
                    
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

            </List.Item>}/>
        </Space>
    )

}

export default QuizList;


