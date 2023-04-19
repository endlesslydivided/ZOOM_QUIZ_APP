import { Button, Card, Collapse, List, Typography } from "antd";
import './ResultsList.scss';

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
    
    return (
        <List.Item>
            <Card   
                className="results-list-card" 
                title={
                <Typography.Text>
                    Quiz question: <Typography.Text type="secondary">{result.quiz.text}</Typography.Text>
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
                        result.quiz.answers?.map((answer:any) =><ResultsAnswerItem answer={answer} result={result}/>)
                    }
                    </Collapse.Panel>
                    
                </Collapse>
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
        <Button disabled={isResult} className={answerClasses} block >
            <Typography.Text>{answer.text}</Typography.Text>
        </Button>
    )
}

export default ResultsItem;