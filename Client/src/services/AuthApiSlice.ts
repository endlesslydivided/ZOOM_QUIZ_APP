import { notification } from "antd";
import {apiSlice} from "./ApiSlice";
import { setDecryptedContext, setToken } from "../store/slices/ZoomContextSlice";


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
                notification.success({message:`Data: ${JSON.stringify(data)}`});

            }
        }),
    })
})


export const {
    useGetContextQuery,
    useLazyGetTokenQuery
} = authApiSlice;