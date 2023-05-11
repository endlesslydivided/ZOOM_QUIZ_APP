import { createSlice,Slice } from '@reduxjs/toolkit';

import { UserPlaySession } from '../../types/storeSliceTypes';

export const playSessionsSlice: Slice<UserPlaySession[]> = createSlice({
    initialState: Array<UserPlaySession>,
    name: 'playSessionsSlice',
    reducers: {
        setPlaySessions: (state, action) => {
            const data: UserPlaySession[] = action.payload;

            const retrievedSessions: UserPlaySession[] = data.filter(
                (r: UserPlaySession) => !state?.some((s: UserPlaySession) => s.id === r.id)
            );

            const finalList: UserPlaySession[] =[...state, ...retrievedSessions];

            return finalList;
        },
        appendPlaySession: (state, action) => {
            const playSession: UserPlaySession = action.payload;
            return [playSession, ...state];
        },
        updateResultPlaySession: (state, action) => {
            const { answers, results } = action.payload;
            return state.map((p: UserPlaySession) =>
                p.id === results[0].playSession.id
                    ? { ...p, results, answers }
                    : p
            );
        },

        reset: () => [],
    },
});

export const {
    setPlaySessions,
    appendPlaySession,
    updateResultPlaySession,
    reset: resetPlaySessions,
} = playSessionsSlice.actions;

export default playSessionsSlice.reducer;
