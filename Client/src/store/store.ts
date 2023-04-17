import {configureStore} from "@reduxjs/toolkit";
import {apiSlice} from "../services/ApiSlice";

import quizzesReducer from "./slices/QuizzesSlice";
import resultsReducer from "./slices/ResultsSlice";
import zoomContextReducer from "./slices/ZoomContextSlice";
import playSessionsReducer from "./slices/PlaySessionsSlice";


export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        quizzes: quizzesReducer,
        results: resultsReducer,
        zoomContext: zoomContextReducer,
        playSessions: playSessionsReducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({serializableCheck: false}).concat(apiSlice.middleware),
    devTools: true
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
  