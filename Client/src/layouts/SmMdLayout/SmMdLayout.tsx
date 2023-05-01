import { QuestionOutlined, SmileOutlined, TrophyOutlined } from '@ant-design/icons';
import { Image, Layout, Menu, MenuProps, Typography } from 'antd';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { ANSWER_ROUTE, QUIZZES_ROUTE, RESULTS_ROUTE } from '../../utils/consts';
import './SmMdLayout.scss';
import React from 'react';

//@ts-expect-error
import logo from '../../assets/logo/logo.png';


const { Header,Content} = Layout;




export default function SmMdLayout() 
{
    const zoomContext:any = useAppSelector((state:any) => state.zoomContext.context);


    const user = useAppSelector((state:any) => state.zoomContext?.user)

    const navigate = useNavigate();

    const items: MenuProps['items'] = [
        {
            label: (<Typography.Text strong type='secondary'>
                        <NavLink to={`../${QUIZZES_ROUTE}?context=${zoomContext}`}>Your quizzes</NavLink>
                    </Typography.Text>),
            icon:<QuestionOutlined/>,
            key: QUIZZES_ROUTE,
        },
        {
            label: (<Typography.Text strong type='secondary'>
                        <NavLink to={`../${ANSWER_ROUTE}?context=${zoomContext}`}>Answer!</NavLink>
                    </Typography.Text>),
            icon:<SmileOutlined/>,
            key: ANSWER_ROUTE,
        },
        {
            label: (<Typography.Text strong type='secondary'>
                        <NavLink to={`../${RESULTS_ROUTE}?context=${zoomContext}`}>Results</NavLink>
                    </Typography.Text>),
            icon:<TrophyOutlined/>,
            key: RESULTS_ROUTE,
        }
    ];


    const currentPath = 
    window.location.pathname !== RESULTS_ROUTE && 
    window.location.pathname !== ANSWER_ROUTE  ? QUIZZES_ROUTE : window.location.pathname;


    return (
        <Layout className={`smMd-layout `}>
            <Header>
                <div onClick={() => navigate(QUIZZES_ROUTE)} style={{cursor:'pointer'}}>
                    <Image preview={false} width={130} src={logo}/>
                </div>
                <div className='header-nav-container'>
                    <Menu selectedKeys={[currentPath]} mode="horizontal" items={items}/>
                </div>


                    <div className='header-popover-container'>
                    <Typography.Text type="secondary">
                            Welcome{user ? ', ' + user.display_name : ', Player'}!
                    </Typography.Text>
                    </div>
               
            </Header>
            <Content>
                <Outlet/>
            </Content>

        </Layout>
    );
}