import './QuizPage.scss';

import { Col, Row } from 'antd';
import { QuizList } from 'widgets/Lists/QuizList';

const QuizPage = () => {
    return (
        <div className='quiz-page-container'>
            <Row gutter={[25, 10]} className='quiz-row'>
                <Col span={24} className='quiz-postlist-col'>
                    <QuizList />
                </Col>
            </Row>
        </div>
    );
};

export default QuizPage;
