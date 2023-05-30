import { createSlice, Slice } from '@reduxjs/toolkit';

import { UserQuiz } from './types';

export const quizzesSlice: Slice<UserQuiz[]> = createSlice({
    initialState: Array<UserQuiz>,
    name: 'quizzesSlice',
    reducers: {
        setQuizzes: (state, action) => {
            const quizzes: UserQuiz[] = action.payload;
            return [...quizzes];
        },
        appendQuiz: (state, action) => {
            const data: UserQuiz = action.payload;
            return [data, ...state];
        },
        appendQuizzes: (state, action) => {
            const data: UserQuiz[] = action.payload;
            return [...data, ...state];
        },
        deleteQuiz: (state, action) => {
            const id: string = action.payload;
            return [...state.filter((i: UserQuiz) => i.id !== id)];
        },

        appendPage: (state, action) => {
            const data: UserQuiz[] = action.payload;

            const retrievedQuizzes: UserQuiz[] = data.filter(
                (r: UserQuiz) => !state?.some((s: UserQuiz) => s.id === r.id)
            );

            const finalList: UserQuiz[] = [...state, ...retrievedQuizzes];

            return finalList;
        },
        reset: () => [],
    },
});

export const {
    setQuizzes,
    appendQuiz,
    appendQuizzes,
    deleteQuiz,
    appendPage: appendQuizPage,
    reset: resetQuizzes,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;
