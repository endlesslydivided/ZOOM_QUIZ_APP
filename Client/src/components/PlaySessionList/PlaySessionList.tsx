import './PlaySessionList.scss';

import { List, Space, Typography } from 'antd';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../hooks/redux';
import { useNotify } from '../../hooks/useNotify';
import { useGetPlaySessionsQuery } from '../../services/PlaySessionsApiSlice';
import { setPlaySessions } from '../../store/slices/PlaySessionsSlice';
import { RootState } from '../../store/store';
import { UserPlaySession } from '../../types/storeSliceTypes';
import PlaySessionItem from './PlaySessionItem';

const PlaySessionList: React.FC = () => {
    const playSessionsState: UserPlaySession[] = useAppSelector(
        (state: RootState) => state.playSessions
    );

    const dispatch = useDispatch();

    const playSessions = useGetPlaySessionsQuery(null);

    useNotify({
        result: playSessions,
        successCB: () => {
            const data = playSessions.data;
            dispatch(setPlaySessions(data));
        },
    });

    return (
        <Space size={'middle'} direction='vertical'>
            <Typography.Title level={4} type={'secondary'}>
                Answer quizzes:
            </Typography.Title>

            <List
                itemLayout='horizontal'
                className='playsession-list'
                split={true}
                size={'small'}
                loading={playSessions.isFetching}
                grid={{ gutter: 10, column: 1 }}
                dataSource={playSessionsState}
                renderItem={(playSession: UserPlaySession) => (
                    <PlaySessionItem playSession={playSession} />
                )}
            />
        </Space>
    );
};

export default PlaySessionList;
