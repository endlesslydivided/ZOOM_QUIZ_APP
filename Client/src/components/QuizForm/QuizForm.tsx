import { Button, Col, Form, Input, Modal, Radio, Row, notification } from 'antd';
import React from 'react';
import { useAppDispatch } from '../../hooks/redux';
import { useCreateQuizMutation } from '../../services/QuizzesApiSlice';
import { appendQuiz } from '../../store/slices/QuizzesSlice';


interface QuizFormProps
{
  isFormOpened: boolean;
  setIsFormOpened:(arg0:boolean) => void;
}

const QuizForm:React.FC<QuizFormProps> = ({isFormOpened,setIsFormOpened}) => {

    const [createQuiz] = useCreateQuizMutation();
    const dispatch = useAppDispatch();
    
    const onFinish = async (values:any) => 
    {
      const body:any = {text:values.text,answers:[]}; 
      for (const property in values) 
      {
        if(property.match(/answers/g))
        {
          body.answers.push({text:values[property],isCorrect:false});
        }
      }

      body.answers[values.correctNumber].isCorrect = true;

      const {data,error}:any = await createQuiz({body});

      if(data)
      {
        dispatch(appendQuiz(data));
      }
      else
      {
        notification.error({message:error.data.message,placement:"topRight",duration:2});
      }
    };

  return (
    <Modal
            destroyOnClose={true}
            className="modal"
            title={`Create new quiz`}
            cancelButtonProps={{style:{display:'none'}}}
            okButtonProps={{style:{display:'none'}}}

            centered
            onCancel={() => setIsFormOpened(false)}
            open={isFormOpened}
        >
         
  <Form name='quiz' onFinish={onFinish}>
      <Row style={{ width:'100%' }} >
        <Col span={24}>
          <Form.Item name={"text"} label="Question text:" colon={false} labelCol={{span:24}}  >
            <Input.TextArea 
              autoSize={{minRows:2,maxRows:4}}  
              maxLength={500} 
              showCount
              placeholder="Write your question..."
          />
          </Form.Item>
        </Col>
        <Col  span={24}>
          <Form.Item name="answers1" label="1." colon={false}  rules={[{ required: true, message: 'Missing answer text' }]}>
            <Input placeholder="1# Answer text" />
          </Form.Item>
        </Col>
        <Col  span={24}>
          <Form.Item name="answers2" label="2." colon={false}  rules={[{ required: true, message: 'Missing answer text' }]}>
            <Input placeholder="2# Answer text" />
          </Form.Item>     
        </Col>
        <Col  span={24}>
          <Form.Item name="answers3" label="3." colon={false}  rules={[{ required: true, message: 'Missing answer text' }]}>
            <Input placeholder="3# Answer text"/>
          </Form.Item>    
        </Col>
        <Col  span={24}>
          <Form.Item name="answers4" label="4." colon={false}  rules={[{ required: true, message: 'Missing answer text' }]}>
            <Input placeholder="4# Answer text"/>
          </Form.Item>      
        </Col>
        <Col  span={24}>
          <Form.Item label="Correct answer: " name="correctNumber" colon={false}  rules={[{ required: true, message: 'Missing correct answer' }]}>
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
        <Button block type="primary" htmlType="submit">
          Create
        </Button>
      </Form.Item>
    </Form>
    
    </Modal>
  )
}

export default QuizForm