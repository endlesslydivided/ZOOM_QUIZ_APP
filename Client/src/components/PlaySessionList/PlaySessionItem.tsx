import { Button, Card, Collapse, List, Typography } from "antd";
import { useContext } from "react";
import { QuizServerEvent, SocketContext } from "../SocketProvider/SocketProvider";
import './PlaySessionList.scss';

interface PlaySessionItemProps
{
    playSession:any;
}

const PlaySessionItem:React.FC<PlaySessionItemProps>= ({playSession}) =>
{

    const isResult = !!playSession.results && playSession.results?.length !== 0;

    const userAnswerId = isResult && playSession.results[0].answer?.id;

    const isCorrect = isResult && playSession?.quiz?.answers?.find((a:any) => a.id === userAnswerId).isCorrect;
    
    const yourAnswerText = isResult ? isCorrect ? " Correct!" : " Incorrect(" : " No answer";
    const yourAnswerStyle = isResult ? {color:isCorrect?'rgba(9, 208, 59, 0.771)' : 'rgba(214, 80, 80, 0.633)'} : {};
    
    return (
        <List.Item>
            <Card   
                className="playsession-list-card" 
                title={
                <Typography.Text>
                    Quiz question: <Typography.Text type="secondary">{playSession.quiz.text}</Typography.Text>
                </Typography.Text>}
                    
                extra=
                {
                    <Typography.Text>
                        Your answer: 
                        {
                            isResult ? 
                                <Typography.Text style={yourAnswerStyle} type="secondary">
                                    {yourAnswerText}
                                </Typography.Text>
                            :
                                <Typography.Text type="secondary"> No answer</Typography.Text>
                        }
                    </Typography.Text>
                }>


                <Collapse className="answers-collapse">
                    <Collapse.Panel header="Reveal answers" key="1">
                    {
                        playSession.quiz.answers.map((answer:any) =><PlaySessionAnswerItem answer={answer} playSession={playSession}/>)
                    }
                    </Collapse.Panel>
                    
                </Collapse>
            </Card>

        </List.Item>
    )
}


const PlaySessionAnswerItem = ({answer,playSession}:any) =>
{
    const socket:any = useContext(SocketContext);

    const isResult = !!playSession.results && playSession.results?.length !== 0;

    const isUserAnswer =isResult && playSession.results[0]?.answer?.id === answer.id;

    const isCorrectAnswer = isResult && playSession?.quiz?.answers?.find((a:any) => a.id === answer.id).isCorrect;
    const resultClass =   isCorrectAnswer ?"correct-answer" : "wrong-answer";

    const answerClasses = `answer-text ${isUserAnswer ? "user-answer" : ""} ${isResult ? resultClass : ""}`;

    const answerQuiz = (playSessionId:string,answerId:string) =>
    {
        socket.emit(QuizServerEvent.CLIENT_SENDS_ANSWER,{result:{playSessionId,answerId}});
    }

    return (
        <Button disabled={isResult} className={answerClasses} block  onClick={() => answerQuiz(playSession.id,answer.id)}>
            <Typography.Text>{answer.text}</Typography.Text>
        </Button>
    )
}

export default PlaySessionItem;