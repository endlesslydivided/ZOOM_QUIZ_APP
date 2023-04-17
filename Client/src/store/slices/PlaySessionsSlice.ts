import { createSlice } from "@reduxjs/toolkit";


export const playSessionsSlice: any = createSlice({
  initialState: <any>[],
  name: "playSessionsSlice",
  reducers: {
    setPlaySessions: (state: any, action) => {
      const playSessions = action.payload;
      return [...playSessions];
    },
    appendPlaySession: (state: any, action) => {
      const playSession = action.payload;
      return [playSession, ...state];
    },
    updateResultPlaySession: (state: any, action) => {
      const result = action.payload;
      return state.map((p:any) => p.id === result.playSession.id ? 
      {...p,result}: p);
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
