import './SmMdLayout.scss';

import {
    QuestionOutlined,
    SmileOutlined,
    TrophyOutlined,
} from '@ant-design/icons';
import { Image, Layout, Menu, MenuProps, Typography } from 'antd';
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

//@ts-expect-error
import logo from '../../../assets/logo/logo.png';
import { useAppSelector } from '../../hooks/redux';
import { RootState } from '../../store/store';
import { ZoomContext, ZoomContextString } from '../../types/storeSliceTypes';
import { AppRoutes } from '../../utils/routeConsts';


const { Header, Content } = Layout;

export default function SmMdLayout() {
    const zoomContext: ZoomContextString | undefined = useAppSelector(
        (state: RootState) => state.zoomContext.context
    );

    const user = useAppSelector((state: RootState) => state.zoomContext?.user);

    const navigate = useNavigate();

    const items: MenuProps['items'] = [
        {
            label: (
                <Typography.Text strong type='secondary'>
                    <NavLink to={`../${AppRoutes.QUIZZES_ROUTE}?context=${zoomContext}`}>
                        Your quizzes
                    </NavLink>
                </Typography.Text>
            ),
            icon: <QuestionOutlined />,
            key: AppRoutes.QUIZZES_ROUTE,
        },
        {
            label: (
                <Typography.Text strong type='secondary'>
                    <NavLink to={`../${AppRoutes.ANSWER_ROUTE}?context=${zoomContext}`}>
                        Answer!
                    </NavLink>
                </Typography.Text>
            ),
            icon: <SmileOutlined />,
            key: AppRoutes.ANSWER_ROUTE,
        },
        {
            label: (
                <Typography.Text strong type='secondary'>
                    <NavLink to={`../${AppRoutes.RESULTS_ROUTE}?context=${zoomContext}`}>
                        Results
                    </NavLink>
                </Typography.Text>
            ),        
            icon: <TrophyOutlined />,
            key: AppRoutes.RESULTS_ROUTE,
        },
    ];

    const currentPath =
        window.location.pathname !== AppRoutes.RESULTS_ROUTE &&
        window.location.pathname !== AppRoutes.ANSWER_ROUTE
            ? AppRoutes.QUIZZES_ROUTE
            : window.location.pathname;

    return (
        <Layout className={`smMd-layout `}>
            <Header>
                <div
                    onClick={() => navigate(AppRoutes.QUIZZES_ROUTE)}
                    style={{ cursor: 'pointer' }}
                >
                    <Image preview={false} width={130} src={logo} />
                </div>
                <div className='header-nav-container'>
                    <Menu
                        selectedKeys={[currentPath]}
                        mode='horizontal'
                        items={items}
                    />
                </div>

                <div className='header-popover-container'>
                    <Typography.Text type='secondary'>
                        Welcome{user ? ', ' + user.display_name : ', Player'}!
                    </Typography.Text>
                </div>
            </Header>
            <Content>
                <Outlet />
            </Content>
        </Layout>
    );
}
