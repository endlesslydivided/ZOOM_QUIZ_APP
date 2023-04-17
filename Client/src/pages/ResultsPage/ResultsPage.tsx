import { Col, Row, Space } from "antd";
import './ResultsPage.scss';

const ResultsPage = () => {


   
    return (
        <div className='results-page-container'>
            <Row gutter={[25,10]} className='results-row'>              
                <Col span={24} className='results-postlist-col'>
                    <Space direction="vertical" size='large'>

                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default ResultsPage;

