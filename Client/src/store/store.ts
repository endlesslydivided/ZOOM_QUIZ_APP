import {configureStore} from "@reduxjs/toolkit";
import {apiSlice} from "../services/ApiSlice";

import quizzesReducer from "./slices/QuizzesSlice";
import resultsReducer from "./slices/ResultsSlice";


export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        quizzes: quizzesReducer,
        results: resultsReducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({serializableCheck: false}).concat(apiSlice.middleware),
    devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
  