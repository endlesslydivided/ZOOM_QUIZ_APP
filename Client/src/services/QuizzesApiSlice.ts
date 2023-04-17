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
            query: () => ({
                url: '/quizzes',
                method: 'GET'
            }),
        }),
       
    })
})


export const {
    useCreateQuizMutation,
    useGetUserQuizzesQuery
} = QuizzesApiSlice;