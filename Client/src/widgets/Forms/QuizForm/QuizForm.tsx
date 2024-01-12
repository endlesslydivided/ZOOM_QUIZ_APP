import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import {
    Button,
    Col,
    Form,
    Input,
    Modal,
    notification,
    Radio,
    Row,
} from 'antd';
import { useCreateQuizMutation } from 'entities/quiz/api/slice';
import { appendQuiz } from 'entities/quiz/model/slice';
import { Quiz } from 'entities/quiz/model/types';
import React from 'react';
import { useAppDispatch } from 'shared/hooks/redux';

interface QuizFormProps {
    isFormOpened: boolean;
    setIsFormOpened: (arg0: boolean) => void;
}

type QuizFormValues = {
    text: string;
    correctNumber: number;
    firstAnswer: string;
    secondAnswer: string;
    thirdAnswer: string;
    fourthAnswer: string;
    [key: string]: string | number;
};

const QuizForm: React.FC<QuizFormProps> = ({
    isFormOpened,
    setIsFormOpened,
}) => {
    const [createQuiz] = useCreateQuizMutation();
    const dispatch = useAppDispatch();

    const onFinish = async (values: QuizFormValues) => {
        const body: {
            text: string;
            answers: Array<{ text: string; isCorrect: boolean }>;
        } = { text: values.text, answers: [] };
        for (const property in values) {
            if (property.match(/Answer/g)) {
                body.answers.push({
                    text: values[property] as string,
                    isCorrect: false,
                });
            }
        }

        body.answers[values.correctNumber].isCorrect = true;

        const {
            data,
            error,
        }: QueryReturnValue<Quiz, FetchBaseQueryError | SerializedError> =
            await createQuiz({ body });

        if (data) {
            dispatch(appendQuiz(data));
        } else {
            const message = (error as FetchBaseQueryError).data
                ? ((error as FetchBaseQueryError).data as { message: string })
                      .message
                : (error as SerializedError).message;

            notification.error({ message, placement: 'topRight', duration: 2 });
        }
    };

    return (
        <Modal
            destroyOnClose={true}
            className='modal'
            title={`Create new quiz`}
            cancelButtonProps={{ style: { display: 'none' } }}
            okButtonProps={{ style: { display: 'none' } }}
            centered
            onCancel={() => setIsFormOpened(false)}
            open={isFormOpened}
        >
            <Form name='quiz' onFinish={onFinish}>
                <Row style={{ width: '100%' }}>
                    <Col span={24}>
                        <Form.Item
                            name={'text'}
                            label='Question text:'
                            colon={false}
                            labelCol={{ span: 24 }}
                        >
                            <Input.TextArea
                                autoSize={{ minRows: 2, maxRows: 4 }}
                                maxLength={500}
                                showCount
                                placeholder='Write your question...'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name='firstAnswer'
                            label='1.'
                            colon={false}
                            rules={[
                                {
                                    required: true,
                                    message: 'Missing answer text',
                                },
                            ]}
                        >
                            <Input placeholder='1# Answer text' />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name='secondAnswer'
                            label='2.'
                            colon={false}
                            rules={[
                                {
                                    required: true,
                                    message: 'Missing answer text',
                                },
                            ]}
                        >
                            <Input placeholder='2# Answer text' />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name='thirdAnswer'
                            label='3.'
                            colon={false}
                            rules={[
                                {
                                    required: true,
                                    message: 'Missing answer text',
                                },
                            ]}
                        >
                            <Input placeholder='3# Answer text' />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name='fourthAnswer'
                            label='4.'
                            colon={false}
                            rules={[
                                {
                                    required: true,
                                    message: 'Missing answer text',
                                },
                            ]}
                        >
                            <Input placeholder='4# Answer text' />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label='Correct answer: '
                            name='correctNumber'
                            colon={false}
                            rules={[
                                {
                                    required: true,
                                    message: 'Missing correct answer',
                                },
                            ]}
                        >
                            <Radio.Group>
                                <Radio value={0}>1.</Radio>
                                <Radio value={1}>2.</Radio>
                                <Radio value={2}>3.</Radio>
                                <Radio value={3}>4.</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item wrapperCol={{ offset: 20, span: 4 }}>
                    <Button block type='primary' htmlType='submit'>
                        Create
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default QuizForm;
