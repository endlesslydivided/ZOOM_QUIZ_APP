import { Button, Card, Collapse, List, Modal, Pagination, PaginationProps, Space, Tooltip, Typography, notification } from "antd";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/redux";
import { useNotify } from "../../hooks/useNotify";
import { useGetUserQuizzesQuery } from "../../services/QuizzesApiSlice";
import { setQuizzes } from "../../store/slices/QuizzesSlice";
import { CloseOutlined, PlusOutlined, SendOutlined } from "@ant-design/icons";
import QuizForm from "../QuizForm/QuizForm";
import { useContext, useEffect, useState } from "react";
import './QuizList.scss'
import { QuizServerEvent, SocketContext } from "../SocketProvider/SocketProvider";
import { RootState } from "../../store/store";
import QuizListItem from "./QuizListItem";
import { usePagination } from "../../hooks/usePagination";

interface QuizListProps
{

}



const QuizList:React.FC<QuizListProps> = () =>
{
    const quizzes:any = useAppSelector((state:any) => state.quizzes);

    const [isFormOpened, setIsFormOpened] = useState(false);
    const {setFilters,filters,pagesCount,getContentResult} = usePagination(
        {
            setContent:setQuizzes,
            getContentCB:useGetUserQuizzesQuery,
        }
    ) 

    const onChangePage: PaginationProps['onChange'] = (page) => setFilters((p:any) => {return {...p, page}});

     

    return (
        <Space size={'middle'} direction="vertical">
            <QuizForm isFormOpened={isFormOpened} setIsFormOpened={setIsFormOpened}/>
            
            <Button onClick={() => setIsFormOpened(true)} block icon={<PlusOutlined/>}> Add new quiz</Button>

            <Typography.Title level={4} type={"secondary"}>Your quizzes:</Typography.Title>
            
            <Pagination current={filters.page} defaultPageSize={filters.limit} total={pagesCount} onChange={onChangePage}/>

            <List 
                itemLayout="horizontal" 
                loading={getContentResult.isFetching} 
                className="quiz-list" 
                split={true} 
                grid={{gutter:10,column:1}}
                size={"small"} 
                dataSource={quizzes}
                renderItem={(quiz:any) => <QuizListItem quiz={quiz}/>}/>
            <Pagination current={filters.page} defaultPageSize={filters.limit} total={pagesCount} onChange={onChangePage}/>
        </Space>
    )

}

export default QuizList;


