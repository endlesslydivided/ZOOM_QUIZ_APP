import {
    setDecryptedContext,
    setToken,
    setUser,
} from '../store/slices/ZoomContextSlice';
import { ZoomContext, ZoomTokens, ZoomUser } from '../types/storeSliceTypes';
import { GET_CONTEXT, GET_ME,GET_TOKEN } from '../utils/apiConsts';
import { apiSlice } from './ApiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getContext: builder.query<ZoomContext, null>({
            query: () => ({
                url: GET_CONTEXT,
                method: 'GET',
                credentials: 'include',
            }),
            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                const { data } = await queryFulfilled;
                dispatch(setDecryptedContext(data));
            },
        }),

        getToken: builder.query<
            ZoomTokens,
            { params: { code?: string; verifier?: string } }
        >({
            query: ({ params }) => ({
                url: GET_TOKEN,
                method: 'GET',
                credentials: 'include',
                params,
            }),
            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                const { data } = await queryFulfilled;
                dispatch(setToken(data));
            },
        }),

        getMe: builder.query<ZoomUser, null>({
            query: () => ({
                url: GET_ME,
                method: 'GET',
                credentials: 'include',
            }),
            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                const { data } = await queryFulfilled;
                dispatch(setUser(data));
            },
        }),
    }),
});

export const { useGetContextQuery, useLazyGetTokenQuery, useLazyGetMeQuery } =
    authApiSlice;
