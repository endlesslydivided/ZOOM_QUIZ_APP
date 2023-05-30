import { Filters } from 'shared/models';

import { CreateQuizDTO, Quiz } from '../model/types';
import { apiSlice } from 'shared/api/api';

const BASE_URL = '/quizzes';

/*#region Quiz api consts*/
export const GET_USER_QUIZZES_URI = BASE_URL;
export const CREATE_QUIZ_URI = BASE_URL;
export const DELETE_QUIZ_URI = (quizId: string) => `${BASE_URL}/${quizId}`;
/*#endregion*/

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
