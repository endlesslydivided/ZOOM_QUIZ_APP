import { notification } from "antd";
import {apiSlice} from "./ApiSlice";
import { setDecryptedContext } from "../store/slices/ZoomContextSlice";


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
    })
})


export const {
    useGetContextQuery
} = authApiSlice;