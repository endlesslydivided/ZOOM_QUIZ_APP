import { Quiz } from "../types/entityTypes";
import { CreateQuizDTO, Filters } from "../types/serviceSliceTypes";
import { apiSlice } from "./ApiSlice";


export const QuizzesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createQuiz: builder.mutation<Quiz,{body:CreateQuizDTO}>({
            query: ({body}) => ({
                url: '/quizzes',
                method: 'POST',
                body: body
            }),
        }),
        getUserQuizzes: builder.query<Quiz,{filters:Filters}>({
            query: ({filters}) => ({
                url: '/quizzes',
                method: 'GET',
                params:filters
            }),
        }),
        deleteQuiz: builder.mutation<Quiz,{quizId:string}>({
            query: ({quizId}) => ({
                url: `/quizzes/${quizId}`,
                method: 'DELETE'
            }),
        }),
       
       
    })
})


export const {
    useCreateQuizMutation,
    useGetUserQuizzesQuery,
    useDeleteQuizMutation,
    
} = QuizzesApiSlice;