import { createSlice,Slice } from '@reduxjs/toolkit';

import { UserPlaySessionResult } from '../../types/storeSliceTypes';

export const resultsSlice: Slice<UserPlaySessionResult[]> = createSlice({
    initialState: Array<UserPlaySessionResult>,
    name: 'resultsSlice',
    reducers: {
        setResults: (state, action) => {
            const results: UserPlaySessionResult[] = action.payload;
            return [...results];
        },
        appendResult: (state, action) => {
            const data: UserPlaySessionResult = action.payload;
            return [data, ...state];
        },
        appendResults: (state, action) => {
            const data: UserPlaySessionResult[] = action.payload;
            return [...data, ...state];
        },
        deleteResult: (state, action) => {
            const id: string = action.payload;
            return [...state.filter((i: UserPlaySessionResult) => i.id !== id)];
        },

        appendPage: (state, action) => {
            const data: UserPlaySessionResult[] = action.payload;

            const retrievedResults: UserPlaySessionResult[] = data.filter(
                (r: UserPlaySessionResult) => !state?.some((s: UserPlaySessionResult) => s.id === r.id)
            );
            

            const finalList: UserPlaySessionResult[] = [...state, ...retrievedResults]
             

            return finalList;
        },
        reset: () => [],
    },
});

export const {
    setResults,
    appendResult,
    appendResults,
    deleteResult,
    appendPage: appendResultPage,
    reset: resetResults,
} = resultsSlice.actions;

export default resultsSlice.reducer;
