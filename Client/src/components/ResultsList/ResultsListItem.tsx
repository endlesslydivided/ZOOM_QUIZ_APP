import { Button, Card, Collapse, List, Typography } from "antd";
import './ResultsList.scss';
import { useState } from "react";
import QuizStatsModal from "../QuizList/QuizStatsModal";
import { InfoCircleOutlined } from "@ant-design/icons";

interface ResultsItemProps
{
    result:any;
}

const ResultsItem:React.FC<ResultsItemProps>= ({result}) =>
{

    const isResult = !!result.results && result.results?.length !== 0;

    const userAnswerId = isResult && result.results[0].answer?.id;

    const isCorrect = isResult && result?.quiz?.answers?.find((a:any) => a.id === userAnswerId).isCorrect;
    
    const yourAnswerText = isResult ? isCorrect ? " Correct!" : " Incorrect(" : " No answer";
    const yourAnswerStyle = isResult ? {color:isCorrect?'rgba(9, 208, 59, 0.771)' : 'rgba(214, 80, 80, 0.633)'} : {};
    
    const [isModalOpened,setIsModalOpened] = useState(false);


    return (
        <List.Item>
            <QuizStatsModal isModalOpened={isModalOpened} setIsModalOpened={setIsModalOpened} playSessions={[result]}/>
            <Card   
                className="results-list-card" 
                title={
                <Typography.Text>
                    Quiz question: <Typography.Text type="secondary">{result.quiz.text}</Typography.Text>
                </Typography.Text>}
                    
                extra=
                {
                    <>
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
                    <Button shape="circle"  icon={<InfoCircleOutlined/>} type="text" onClick={() => setIsModalOpened(true)}></Button>
                    </>
                }>
                 

                    {
                        result.quiz.answers?.map((answer:any) =><ResultsAnswerItem answer={answer} result={result}/>)
                    }
            </Card>

        </List.Item>
    )
}


const ResultsAnswerItem = ({answer,result}:any) =>
{

    const isResult = !!result.results && result.results?.length !== 0;

    const isUserAnswer =isResult && result.results[0]?.answer?.id === answer.id;

    const isCorrectAnswer = isResult && result?.quiz?.answers?.find((a:any) => a.id === answer.id).isCorrect;
    const resultClass =   isCorrectAnswer ?"correct-answer" : "wrong-answer";

    const answerClasses = `answer-text ${isUserAnswer ? "user-answer" : ""} ${isResult ? resultClass : ""}`;


    return (
        <Card className={answerClasses}>
            <Typography.Text>{answer.text}</Typography.Text>
            {isUserAnswer && <Typography.Text type="secondary"> - Your answer</Typography.Text>}
        </Card>
   
    )
}

export default ResultsItem;