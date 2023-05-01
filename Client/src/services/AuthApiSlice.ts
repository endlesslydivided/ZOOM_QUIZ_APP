import { setDecryptedContext, setToken, setUser } from "../store/slices/ZoomContextSlice";
import { ZoomContext, ZoomTokens, ZoomUser } from "../types/storeSliceTypes";
import { apiSlice } from "./ApiSlice";


export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getContext: builder.query<ZoomContext,null>({
            query: () => ({
                url: '/context',
                method: 'GET',
                credentials: 'include',
            }),
            onQueryStarted: async (args, {dispatch, queryFulfilled}) => {
                
                const {data} = await queryFulfilled;
                dispatch(setDecryptedContext(data));
            
            }
        }),

        getToken: builder.query<ZoomTokens,{params:{code?:string,verifier?:string}}>({
            query: ({params}) => ({
                url: '/auth/token',
                method: 'GET',
                credentials: 'include',
                params
            }),
            onQueryStarted: async (args, {dispatch, queryFulfilled}) => {
                         
                const {data} = await queryFulfilled;
                dispatch(setToken(data));

            }
        }),

        getMe: builder.query<ZoomUser,null>({
            query: () => ({
                url: '/auth/me',
                method: 'GET',
                credentials: 'include'
            }),
            onQueryStarted: async (args, {dispatch, queryFulfilled}) => {
                         
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