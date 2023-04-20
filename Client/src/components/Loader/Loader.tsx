import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import {FC} from 'react';
import './Loader.scss'

interface LoaderProps {
    containerStyle?: object;
    spinProps?:object;
}

const loadingIndicator = <LoadingOutlined style={{ fontSize: 24 }} spin />;


const Loader: FC<LoaderProps> = ({containerStyle,spinProps}) => {
    return (
            <Spin {...spinProps} size="large" indicator={loadingIndicator}/>
    );
};

export default Loader;

