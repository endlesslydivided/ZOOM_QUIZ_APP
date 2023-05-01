import { Slice, createSlice } from "@reduxjs/toolkit";
import { UserPlaySession } from "../../types/storeSliceTypes";

export const playSessionsSlice: Slice<UserPlaySession[]> = 
createSlice({
  initialState: Array<UserPlaySession>,
  name: "playSessionsSlice",
  reducers: {
    setPlaySessions:(state:any,action:any) =>
    {
      const data:UserPlaySession[] = action.payload;
      const retrievedSessions:UserPlaySession[] = data.filter((c:any) => !state?.some((i:any) => i.id === c.id));

      const editedSessions:UserPlaySession[] = retrievedSessions.filter((r:any) => state?.some((c:any) => c.id === r.id));

      const newSessions:UserPlaySession[] = retrievedSessions.filter((c:any) => !state?.some((r:any) => c.id === r.id));

      const appliedSessions:UserPlaySession[] = [...state!.map((c:any) => editedSessions.map((e:any) => c.id === e.id ? e : c)[0] || c)];

      const finalList:UserPlaySession[] = appliedSessions ? [...appliedSessions,...newSessions]: [...newSessions];

      return finalList;
    },
    appendPlaySession: (state: any, action) => {
      const playSession:UserPlaySession = action.payload;
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
