import { notification } from "antd";
import {apiSlice} from "./ApiSlice";
import { setDecryptedContext, setToken, setUser } from "../store/slices/ZoomContextSlice";


export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getContext: builder.query({
            query: () => ({
                url: '/context',
                method: 'GET',
                credentials: 'include',
            }),
            onQueryStarted: async (id, {dispatch, queryFulfilled}) => {
                
                const {data} = await queryFulfilled;
                dispatch(setDecryptedContext(data));
                

            }
        }),

        getToken: builder.query({
            query: ({params}) => ({
                url: '/auth/token',
                method: 'GET',
                credentials: 'include',
                params
            }),
            onQueryStarted: async (id, {dispatch, queryFulfilled}) => {
                         
                const {data} = await queryFulfilled;
                dispatch(setToken(data));

            }
        }),

        getMe: builder.query({
            query: ({params}) => ({
                url: '/auth/me',
                method: 'GET',
                credentials: 'include'
            }),
            onQueryStarted: async (id, {dispatch, queryFulfilled}) => {
                         
                const {data} = await queryFulfilled;
                dispatch(setUser(data));

            }
        }),
    })
})


export const {
    useGetContextQuery,
    useLazyGetTokenQuery,
    useLazyGetMeQuery
} = authApiSlice;