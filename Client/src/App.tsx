import './App.scss';

import zoomSdk from '@zoom/appssdk';
import { notification } from 'antd';
import { useEffect } from 'react';

import AppRouter from './components/AppRouter';
import {
    useLazyGetMeQuery,
    useLazyGetTokenQuery,
} from './services/AuthApiSlice';
import { codeChallenge, state, verifier,ZoomCapabilities } from './utils/zoomConsts';

const base64URL = (s: string | Buffer) =>
    s
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

function App() {
    const [getToken] = useLazyGetTokenQuery();
    const [getMe] = useLazyGetMeQuery();

    const configAuth = async () => {
        await zoomSdk.config({
            capabilities: [
                ZoomCapabilities.GET_RUNNING_CONTEXT,
                ZoomCapabilities.GET_SUPPORTED_JS_APIS,
                ZoomCapabilities.OPEN_URL,
                ZoomCapabilities.AUTHORIZE,
                ZoomCapabilities.ON_AUTHORIZE,
            ],
        });

        const challenge = base64URL(codeChallenge);

        zoomSdk.addEventListener(
            'onAuthorized',
            async (event: { code: string; state: string }) => {
                const params = {
                    code: event.code,
                    state: event.state,
                    verifier,
                };

                await getToken({ params });
                await getMe(null);
            }
        );

        zoomSdk.authorize({ state, codeChallenge: challenge }).catch(() => {
            notification.error({
                message:
                    'Some erro occured during ZoomSDK authorize. You better restart the app.',
            });
        });
    };

    useEffect(() => {
        configAuth();
    }, []);

    return <AppRouter />;
}

export default App;
