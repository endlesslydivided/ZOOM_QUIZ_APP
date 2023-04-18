import { Col, Row, Space } from "antd";
import './QuizPage.scss';
import QuizForm from "../../components/QuizForm/QuizForm";
import QuizList from "../../components/QuizList/QuizList";

const QuizPage = () => {


   
    return (
        <div className='quiz-page-container'>
            <Row gutter={[25,10]} className='quiz-row'>              

                <Col span={24} className='quiz-postlist-col'>
                    <QuizList/>
                </Col>
            </Row>
        </div>
    );
};

export default QuizPage;
