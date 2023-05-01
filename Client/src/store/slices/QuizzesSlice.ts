import { Slice, createSlice } from "@reduxjs/toolkit";
import { UserQuiz } from "../../types/storeSliceTypes";


export const quizzesSlice:Slice<UserQuiz[]> = createSlice({
  initialState: Array<UserQuiz>,
  name: "quizzesSlice",
  reducers: {
    setQuizzes: (state, action) => {
      const quizzes:UserQuiz[] = action.payload;
      return [...quizzes];
    },
    appendQuiz: (state, action) => {
      const data:UserQuiz = action.payload;
      return [data, ...state];
    },
    appendQuizzes: (state, action) => {
      const data:UserQuiz[] = action.payload;
      return [...data, ...state];
    },
    deleteQuiz: (state, action) => {
      const id:string = action.payload;
      return [...state.filter((i: UserQuiz) => i.id !== id)];
    },

    appendPage:(state,action) =>
    {
      const data:UserQuiz[] = action.payload;
      const retrievedQuizzes:UserQuiz[] = data.filter((c:UserQuiz) => !state?.includes(c));

      const editedQuizzes:UserQuiz[] = retrievedQuizzes.filter((r:UserQuiz) => state?.some((c:UserQuiz) => c.id === r.id));

      const newQuizzes:UserQuiz[] = retrievedQuizzes.filter((c:UserQuiz) => !state?.some((r:UserQuiz) => c.id === r.id));

      const appliedQuizzes:UserQuiz[] = [...state!.map((c:UserQuiz) => editedQuizzes.map((e:UserQuiz) => c.id === e.id ? e : c)[0] || c)];

      const finalList:UserQuiz[] = appliedQuizzes ? [...appliedQuizzes,...newQuizzes]: [...newQuizzes];

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
