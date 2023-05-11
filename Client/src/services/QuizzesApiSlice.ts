import { Quiz } from '../types/entityTypes';
import { CreateQuizDTO, Filters } from '../types/serviceSliceTypes';
import { CREATE_QUIZ_URI, DELETE_QUIZ_URI,GET_USER_QUIZZES_URI } from '../utils/apiConsts';
import { apiSlice } from './ApiSlice';

export const QuizzesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createQuiz: builder.mutation<Quiz, { body: CreateQuizDTO }>({
            query: ({ body }) => ({
                url: CREATE_QUIZ_URI,
                method: 'POST',
                body: body,
            }),
        }),
        getUserQuizzes: builder.query<Quiz, { filters: Filters }>({
            query: ({ filters }) => ({
                url: GET_USER_QUIZZES_URI,
                method: 'GET',
                params: filters,
            }),
        }),
        deleteQuiz: builder.mutation<Quiz, { quizId: string }>({
            query: ({ quizId }) => ({
                url: DELETE_QUIZ_URI(quizId),
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useCreateQuizMutation,
    useGetUserQuizzesQuery,
    useDeleteQuizMutation,
} = QuizzesApiSlice;
