import { createSlice,Slice } from '@reduxjs/toolkit';

import {
    DecryptedContext,
    UserZoomContext,
    ZoomContextString,
    ZoomTokens,
    ZoomUser,
} from '../../types/storeSliceTypes';

const initialState: UserZoomContext = {
    context: null,
    decrypted: null,
    tokens: null,
    user: null,
};

export const zoomContextSlice: Slice<UserZoomContext> = createSlice({
    initialState,
    name: 'zoomContextSlice',
    reducers: {
        setContext: (state, action) => {
            const context: ZoomContextString = action.payload;
            state.context = context;
            return state;
        },
        setDecryptedContext: (state, action) => {
            const context: DecryptedContext = action.payload;
            state.decrypted = context;
            return state;
        },
        setToken: (state, action) => {
            const tokens: ZoomTokens = action.payload;
            state.tokens = tokens;
            return state;
        },
        setUser: (state, action) => {
            const user: ZoomUser = action.payload;
            state.user = user;
            return state;
        },
    },
});

export const { setContext, setDecryptedContext, setToken, setUser } =
    zoomContextSlice.actions;

export default zoomContextSlice.reducer;
