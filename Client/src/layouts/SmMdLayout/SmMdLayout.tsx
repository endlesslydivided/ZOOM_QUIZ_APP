import type { MenuProps } from 'antd';
import { Layout, Menu, Typography } from 'antd';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../hooks/redux';
import { ANSWER_ROUTE, QUIZZES_ROUTE, RESULTS_ROUTE } from '../../utils/consts';
import './SmMdLayout.scss';

const { Header,Content,Footer} = Layout;

const items: MenuProps['items'] = [
    {
        label: (<Typography.Text strong type='secondary'>
                    <NavLink to={`../${QUIZZES_ROUTE}`}>Your quizzes</NavLink>
                </Typography.Text>),
        key: QUIZZES_ROUTE,
    },
    {
        label: (<Typography.Text strong type='secondary'>
                    <NavLink to={`../${ANSWER_ROUTE}`}>Answer!</NavLink>
                </Typography.Text>),
        key: ANSWER_ROUTE,
    },
    {
      label: (<Typography.Text strong type='secondary'>
                <NavLink to={`../${RESULTS_ROUTE}`}>Results</NavLink>
              </Typography.Text>),
      key: RESULTS_ROUTE,
    }
];


export default function SmMdLayout() 
{


    const navigate = useNavigate();


    const currentPath = 
    window.location.pathname !== RESULTS_ROUTE && 
    window.location.pathname !== ANSWER_ROUTE  ? QUIZZES_ROUTE : window.location.pathname;


    return (
        <Layout className={`smMd-layout `}>
            <Header>

                <div className='header-nav-container'>
                    <Menu selectedKeys={[currentPath]} mode="horizontal" items={items}/>
                </div>
               
            </Header>
            <Content>
                <Outlet/>
            </Content>
            {/* <Footer style={{ background: "#F2F2F2",position:'sticky',height:'100%',textAlign:'center'}}>
                <Typography.Title disabled level={5}> created by endlesslydivided, 2023</Typography.Title>
            </Footer> */}
        </Layout>
    );
}