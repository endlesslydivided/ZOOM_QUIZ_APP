import { Col, Row, Space } from 'antd';
import './AnswerPage.scss';
import PlaySessionList from '../../components/PlaySessionList/PlaySessionList';
import React from 'react';

const AnswerPage = () => {
    return (
        <div className='answer-page-container'>
            <Row gutter={[25, 10]} className='answer-row'>
                <Col span={24} className='answer-postlist-col'>
                    <Space direction='vertical' size='large'>
                        <PlaySessionList />
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default AnswerPage;
