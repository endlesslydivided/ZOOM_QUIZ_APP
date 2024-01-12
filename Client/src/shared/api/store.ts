import { configureStore } from '@reduxjs/toolkit';
import playSessionsReducer from 'entities/playSession/model/slice';
import quizzesReducer from 'entities/quiz/model/slice';
import resultsReducer from 'entities/result/model/slice';
import zoomContextReducer from 'entities/zoomContext/api/slice';

import { apiSlice } from './api';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        quizzes: quizzesReducer,
        results: resultsReducer,
        zoomContext: zoomContextReducer,
        playSessions: playSessionsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }).concat(
            apiSlice.middleware
        ),
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
