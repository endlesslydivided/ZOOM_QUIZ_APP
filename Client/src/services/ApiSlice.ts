import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { notification } from 'antd';
import { RootState } from '../store/store';
import { UserZoomContext } from '../types/storeSliceTypes';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACK_URI,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const zoomContext: UserZoomContext = (getState() as RootState)
            .zoomContext;
        const accessToken = zoomContext?.tokens?.access_token;
        const refreshToken = zoomContext?.tokens?.refresh_token;

        const zoomContextParam: string | null = new URLSearchParams(
            window.location.search
        ).get('context');

        if (zoomContext.context) {
            headers.set('x-zoom-app-context', zoomContext.context);
        } else if (zoomContextParam) {
            headers.set('x-zoom-app-context', zoomContextParam);
        }

        if (accessToken) {
            headers.set('Authorization', `Bearer ${accessToken}`);
        }

        if (refreshToken) {
            headers.set('Refresh', `${refreshToken}`);
        }

        return headers;
    },
});

const baseQueryWithReauth = async (
    args?: any,
    api?: any,
    extraOptions?: any
) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403) {
        const refreshResult: any = await baseQuery(
            {
                url: '/auth/refresh-token',
                method: 'GET',
            },
            api,
            extraOptions
        );

        if (refreshResult.meta.response.ok) {
            result = await baseQuery(args, api, extraOptions);
        } else {
            notification.error({
                message:
                    'Some error occured during token update. You better restart the app.',
            });
        }
    }

    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({}),
});
