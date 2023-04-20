import { apiSlice } from "./ApiSlice";


export const QuizzesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createQuiz: builder.mutation({
            query: ({body}) => ({
                url: '/quizzes',
                method: 'POST',
                body: body
            }),
        }),

        getUserQuizzes: builder.query({
            query: ({filters}) => ({
                url: '/quizzes',
                method: 'GET',
                params:filters
            }),
        }),

      

        deleteQuiz: builder.mutation({
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