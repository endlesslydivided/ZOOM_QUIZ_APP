import {
    Col,
    Empty,
    Form,
    Modal,
    notification,
    Row,
    Select,
    Statistic,
    Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { useLazyGetPlaySessionReportQuery } from '../../services/PlaySessionsApiSlice';
import { PlaySession } from '../../types/entityTypes';
import { Report } from '../../types/serviceSliceTypes';
import { UserPlaySession } from '../../types/storeSliceTypes';

interface QuizStatsModalProps {
    isModalOpened: boolean;
    setIsModalOpened: Dispatch<SetStateAction<boolean>>;
    playSessions: PlaySession[] | UserPlaySession[];
}

const QuizStatsModal: React.FC<QuizStatsModalProps> = ({
    isModalOpened,
    setIsModalOpened,
    playSessions,
}) => {
    const [report, setReport] = useState<Report | null>(null);
    const [getReport] = useLazyGetPlaySessionReportQuery();

    const onChangeSelect = async (value: string) => {
        const { data } = await getReport({ psId: value });

        if (data) {
            setReport(data);
        } else {
            notification.error({ message: 'Some error occured on server' });
        }
    };

    return (
        <Modal
            destroyOnClose={true}
            className='modal'
            title={`Quiz report`}
            cancelButtonProps={{ style: { display: 'none' } }}
            okButtonProps={{ style: { display: 'none' } }}
            centered
            onCancel={() => setIsModalOpened(false)}
            open={isModalOpened}
        >
            <Row>
                <Col span={24}>
                    <Form>
                        <Form.Item
                            label={'Choose play session begin time'}
                            name={'createdAt'}
                        >
                            <Select
                                onChange={onChangeSelect}
                                placeholder={
                                    <Typography.Text type='secondary'>
                                        Choose date
                                    </Typography.Text>
                                }
                            >
                                {playSessions?.map((p) => (
                                    <Select.Option key={p.id} value={p.id}>
                                        {dayjs(p.createdAt).format(
                                            'DD/MM/YYYY HH:mm:ss'
                                        )}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={24}>
                    {report ? (
                        <>
                            <Statistic
                                valueStyle={{
                                    color: 'rgba(9, 208, 59, 0.771)',
                                }}
                                title='Correct answers:'
                                value={report?.correctAnswersCount}
                            />
                            <Statistic
                                valueStyle={{
                                    color: 'rgba(214, 80, 80, 0.633)',
                                }}
                                title='Incorrect answers:'
                                value={report?.incorrectAnswersCount}
                            />
                            <Statistic
                                title='Overall answers:'
                                value={report?.overallAnswersCount}
                            />
                        </>
                    ) : (
                        <Empty />
                    )}
                </Col>
            </Row>
        </Modal>
    );
};

export default QuizStatsModal;
