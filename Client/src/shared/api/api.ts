import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import {
    BaseQueryApi,
    createApi,
    FetchArgs,
    fetchBaseQuery,
    FetchBaseQueryError,
    FetchBaseQueryMeta,
} from '@reduxjs/toolkit/dist/query/react';
import { notification } from 'antd';
import { UserZoomContext } from 'entities/zoomContext';
import { API_URL } from 'shared/config';

import { RootState } from './store';

const baseQuery = fetchBaseQuery({
    baseUrl: API_URL,
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
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: object
) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403) {
        const refreshResult: QueryReturnValue<
            unknown,
            FetchBaseQueryError,
            FetchBaseQueryMeta
        > = await baseQuery(
            {
                url: '/auth/refresh-tokne',
                method: 'GET',
            },
            api,
            extraOptions
        );

        if (refreshResult.meta?.response?.ok) {
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
