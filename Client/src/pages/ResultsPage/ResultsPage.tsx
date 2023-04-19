import { Col, Row, Space } from "antd";
import './ResultsPage.scss';
import ResultsList from "../../components/ResultsList/ResultsList";

const ResultsPage = () => {


   
    return (
        <div className='results-page-container'>
            <Row gutter={[25,10]} className='results-row'>              
                <Col span={24} className='results-postlist-col'>
                    <Space direction="vertical" size='large'>
                        <ResultsList/>
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default ResultsPage;

