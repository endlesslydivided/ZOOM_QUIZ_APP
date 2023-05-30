
import { apiSlice } from "shared/api/api";
import { setDecryptedContext, setToken, setUser,ZoomContext, ZoomTokens, ZoomUser } from "entities/zoomContext";

const BASE_URL = '/auth';
const BASE_CONTEXT_URL = '/context';

/*#region Auth api consts*/
export const GET_CONTEXT = BASE_CONTEXT_URL;
export const GET_TOKEN = `${BASE_URL}/token`;
export const GET_ME = `${BASE_URL}/me`;
export const REFRESH_TOKEN = `${BASE_URL}/refresh-token`;
/*#endregion*/

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
