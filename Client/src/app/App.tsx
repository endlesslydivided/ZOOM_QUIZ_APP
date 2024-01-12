import zoomSdk from '@zoom/appssdk';
import { notification } from 'antd';
import {
    useLazyGetMeQuery,
    useLazyGetTokenQuery,
} from 'entities/auth/api/slice';
import AppRouter from 'pages';
import { useEffect } from 'react';
import {
    codeChallenge,
    state,
    verifier,
    ZoomCapabilities,
} from 'shared/consts/zoomConsts';

const base64URL = (s: string | Buffer) =>
    s
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

const App: React.FC = () => {
    const [getToken] = useLazyGetTokenQuery();
    const [getMe] = useLazyGetMeQuery();

    const configAuth = async () => {
        try
        {
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
        }
        catch(error)
        {
            notification.info({message:"Open app in Zoom Client"});
        }
      
    };

    useEffect(() => {
        configAuth();
    }, []);

    return <AppRouter />;
};

export default App;
