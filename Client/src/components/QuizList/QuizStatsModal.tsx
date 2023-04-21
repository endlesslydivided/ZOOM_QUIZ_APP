import { Col, Empty, Form, List, Modal, Row, Select, Statistic, Typography, notification } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { useLazyGetPlaySessionReportQuery } from '../../services/PlaySessionsApiSlice';


interface QuizStatsModalProps
{
    isModalOpened: boolean;
    setIsModalOpened:Function;
    playSessions:any;
}

const QuizStatsModal:React.FC<QuizStatsModalProps> = ({isModalOpened,setIsModalOpened,playSessions}) => {

    const dispatch = useAppDispatch();
    const [report,setReport]:any = useState(null);
    const [getReport] = useLazyGetPlaySessionReportQuery();

    const onChangeSelect = async (value:any) =>
    {
        const {data,error} = await getReport({psId:value})

        if(data)
        {
            setReport(data);
        }
        else
        {
            notification.error({message:'Some error occured on server'});
        }
    }

    return (
        <Modal
            destroyOnClose={true}
            className="modal"
            title={`Quiz report`}
            cancelButtonProps={{style:{display:'none'}}}
            okButtonProps={{style:{display:'none'}}}
            centered
            onCancel={() => setIsModalOpened(false)}
            open={isModalOpened}
        >
        <Row>
            <Col span={24}>
                <Form >
                    <Form.Item label={"Choose play session begin time"} name={"createdAt"}>
                        <Select 
                            onChange={onChangeSelect} 
                            placeholder={<Typography.Text type='secondary'>Choose date</Typography.Text>}>
                            {playSessions?.map((p:any)=> <Select.Option value={p.id}>{dayjs(p.createdAt).format('DD/MM/YYYY HH:mm:ss')}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Col>
            <Col span={24}>
            {
                report ?
                <>
                    <Statistic valueStyle={{ color: 'rgba(9, 208, 59, 0.771)' }} title="Correct answers:" value={report?.correctAnswersCount} />
                    <Statistic valueStyle={{ color: 'rgba(214, 80, 80, 0.633)' }} title="Incorrect answers:" value={report?.incorrectAnswersCount} />
                    <Statistic title="Overall answers:" value={report?.overallAnswersCount} />
                </>
                :
                <Empty/>
            }
             
            </Col>
        </Row>
            
  
    
        </Modal>
  )
}

export default QuizStatsModal