import { createSlice } from "@reduxjs/toolkit";


export const playSessionsSlice: any = createSlice({
  initialState: <any>[],
  name: "playSessionsSlice",
  reducers: {
    setPlaySessions:(state:any,action:any) =>
    {
      const data = action.payload;
      const retrievedSessions = data.filter((c:any) => !state?.some((i:any) => i.id === c.id));

      const editedSessions = retrievedSessions.filter((r:any) => state?.some((c:any) => c.id === r.id));

      const newSessions = retrievedSessions.filter((c:any) => !state?.some((r:any) => c.id === r.id));

      const appliedSessions = [...state?.map((c:any) => editedSessions.map((e:any) => c.id === e.id ? e : c)[0] || c)];

      const finalList = appliedSessions ? [...appliedSessions,...newSessions]: [...newSessions];

      return finalList;
    },
    appendPlaySession: (state: any, action) => {
      const playSession = action.payload;
      return [playSession, ...state];
    },
    updateResultPlaySession: (state: any, action) => {
      const {answers,results} = action.payload;
      return state.map((p:any) => p.id === results[0].playSession.id ? 
      {...p,results,answers}: p);
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
