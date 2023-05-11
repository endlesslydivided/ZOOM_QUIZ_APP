import { configureStore,Store } from '@reduxjs/toolkit';

import { apiSlice } from '../services/ApiSlice';
import playSessionsReducer from './slices/PlaySessionsSlice';
import quizzesReducer from './slices/QuizzesSlice';
import resultsReducer from './slices/ResultsSlice';
import zoomContextReducer from './slices/ZoomContextSlice';

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
