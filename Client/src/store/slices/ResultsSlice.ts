import { createSlice } from "@reduxjs/toolkit";


export const resultsSlice: any = createSlice({
  initialState: <any>[],
  name: "resultsSlice",
  reducers: {
    setResults: (state: any, action) => {
      const results = action.payload;
      return [...results];
    },
    appendResult: (state: any, action) => {
      const data = action.payload;
      return [data, ...state];
    },
    appendResults: (state: any, action) => {
      const data = action.payload;
      return [...data, ...state];
    },
    deleteResult: (state: any, action) => {
      const id = action.payload;
      return [...state.filter((i: any) => i.id !== id)];
    },

    appendPage:(state:any,action:any) =>
    {
      const data = action.payload;
      const retrievedResults = data.filter((c:any) => !state?.includes(c));

      const editedResults = retrievedResults.filter((r:any) => state?.some((c:any) => c.id === r.id));

      const newResults = retrievedResults.filter((c:any) => !state?.some((r:any) => c.id === r.id));

      const appliedResults = [...state?.map((c:any) => editedResults.map((e:any) => c.id === e.id ? e : c)[0] || c)];

      const finalList = appliedResults ? [...appliedResults,...newResults]: [...newResults];

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
