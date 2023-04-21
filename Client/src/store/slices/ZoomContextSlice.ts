import { createSlice } from "@reduxjs/toolkit";


export const zoomContextSlice: any = createSlice({
  initialState: {context: null,decrypted:null,tokens:null,user:null},
  name: "zoomContextSlice",
  reducers: {
    setContext: (state: any, action) => {
      const context = action.payload;
      state.context = context;

      return  state;
    },
    setDecryptedContext: (state: any, action) => {
      const context = action.payload;
      state.decrypted = context;

      return  state;
    },
    setToken: (state: any, action) => {
      const tokens = action.payload;
      state.tokens = tokens;

      return  state;
    },
    setUser: (state: any, action) => {
      const user = action.payload;
      state.user = user;

      return  state;
    }
  }
}
);

export const {
  setContext,
  setDecryptedContext,
  setToken,
  setUser
} = zoomContextSlice.actions;

export default zoomContextSlice.reducer;
