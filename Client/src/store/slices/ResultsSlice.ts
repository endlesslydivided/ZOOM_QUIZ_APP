import { Slice, createSlice } from "@reduxjs/toolkit";
import { UserPlaySessionResult } from "../../types/storeSliceTypes";


export const resultsSlice: Slice<UserPlaySessionResult[]> = createSlice({
  initialState: Array<UserPlaySessionResult>,
  name: "resultsSlice",
  reducers: {
    setResults: (state, action) => {
      const results:UserPlaySessionResult[] = action.payload;
      return [...results];
    },
    appendResult: (state, action) => {
      const data:UserPlaySessionResult = action.payload;
      return [data, ...state];
    },
    appendResults: (state, action) => {
      const data:UserPlaySessionResult[] = action.payload;
      return [...data, ...state];
    },
    deleteResult: (state, action) => {
      const id:string = action.payload;
      return [...state.filter((i:UserPlaySessionResult) => i.id !== id)];
    },

    appendPage:(state,action) =>
    {
      const data:UserPlaySessionResult[] = action.payload;
      const retrievedResults:UserPlaySessionResult[] = data.filter((c:UserPlaySessionResult) => !state?.includes(c));

      const editedResults:UserPlaySessionResult[] = retrievedResults.filter((r:UserPlaySessionResult) => state?.some((c:UserPlaySessionResult) => c.id === r.id));

      const newResults:UserPlaySessionResult[] = retrievedResults.filter((c:UserPlaySessionResult) => !state?.some((r:UserPlaySessionResult) => c.id === r.id));

      const appliedResults:UserPlaySessionResult[] = [...state!.map((c:UserPlaySessionResult) => editedResults.map((e:UserPlaySessionResult) => c.id === e.id ? e : c)[0] || c)];

      const finalList:UserPlaySessionResult[] = appliedResults ? [...appliedResults,...newResults]: [...newResults];

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
  appendPage:appendResultPage,
  reset: resetResults,
} = resultsSlice.actions;

export default resultsSlice.reducer;
