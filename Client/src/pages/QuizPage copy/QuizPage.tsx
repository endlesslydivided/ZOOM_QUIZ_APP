import { Col, Row, Space } from "antd";
import './QuizPage.scss';

const QuizPage = () => {


   
    return (
        <div className='quiz-page-container'>
            <Row gutter={[25,10]} className='quiz-row'>              
                <Col span={24} className='quiz-postlist-col'>
                    <Space direction="vertical" size='large'>

                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default QuizPage;

