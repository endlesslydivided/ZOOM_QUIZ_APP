import { createSlice } from "@reduxjs/toolkit";


export const quizzesSlice: any = createSlice({
  initialState: <any>[],
  name: "quizzesSlice",
  reducers: {
    setQuizzes: (state: any, action) => {
      const quizzes = action.payload;
      return [...quizzes];
    },
    appendQuiz: (state: any, action) => {
      const data = action.payload;
      return [data, ...state];
    },
    appendQuizzes: (state: any, action) => {
      const data = action.payload;
      return [...data, ...state];
    },
    deleteQuiz: (state: any, action) => {
      const id = action.payload;
      return [...state.filter((i: any) => i.id !== id)];
    },

    appendPage:(state:any,action:any) =>
    {
      const data = action.payload;
      const retrievedQuizzes = data.filter((c:any) => !state?.includes(c));

      const editedQuizzes = retrievedQuizzes.filter((r:any) => state?.some((c:any) => c.id === r.id));

      const newQuizzes = retrievedQuizzes.filter((c:any) => !state?.some((r:any) => c.id === r.id));

      const appliedQuizzes = [...state?.map((c:any) => editedQuizzes.map((e:any) => c.id === e.id ? e : c)[0] || c)];

      const finalList = appliedQuizzes ? [...appliedQuizzes,...newQuizzes]: [...newQuizzes];

      return finalList;
    },
    reset: () => [],
  },
});

export const {
  setQuizzes,
  appendQuiz,
  appendQuizzes,
  deleteQuiz,
  appendPage:appendQuizPage,
  reset: resetQuizzes,
} = quizzesSlice.actions;

export default quizzesSlice.reducer;
