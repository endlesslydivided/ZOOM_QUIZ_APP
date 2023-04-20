import { Col, Empty, Form, List, Modal, Row, Select, Statistic, notification } from 'antd';
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
                    <Form.Item label={"Choose meeting begin time"} name={"createdAt"}>
                        <Select onChange={onChangeSelect}>
                            {playSessions.map((p:any)=> <Select.Option value={p.meetId}>{dayjs(p.createdAt).format('DD/MM/YYYY HH:mm:ss')}</Select.Option>)}
                        </Select>
                    </Form.Item>
                </Form>
            </Col>
            <Col span={24}>
            {
                report ?
                <>
                   <Statistic title="Correct answers" value={report?.correctAnswersCount} />
                    <Statistic title="Incorrect answers" value={report?.incorrectAnswersCount} />
                    <Statistic title="Overall answers" value={report?.overallAnswersCount} />
                    <Statistic title="Refrain from answering" value={report?.refrainAnswersCount} />
                    <List>
                        {report?.participants.map((p:any) => (
                        <List.Item>
                            {p.name}
                            {p.answer}
                        </List.Item>))}
                    </List>
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