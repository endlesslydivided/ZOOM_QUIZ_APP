import { notification } from "antd";
import {apiSlice} from "./ApiSlice";


export const QuizzesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        signIn: builder.mutation({
            query: (credentials) => ({
                url: '/auth/signIn',
                method: 'POST',
                body: {...credentials}
            }),
        }),
        signUp: builder.mutation({
            query: (data) => (
                {
                    url: '/auth/signUp',
                    method: 'POST',
                    body: data
                }
            )
        }),
       
    })
})


export const {
    useSignInMutation,
    useSignUpMutation,
} = QuizzesApiSlice;