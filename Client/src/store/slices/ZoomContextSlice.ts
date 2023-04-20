import { createSlice } from "@reduxjs/toolkit";


export const zoomContextSlice: any = createSlice({
  initialState: {context: null,decrypted:null,token:null},
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
      const token = action.payload;
      state.token = token;

      return  state;
    }
  }
}
);

export const {
  setContext,
  setDecryptedContext,
  setToken
} = zoomContextSlice.actions;

export default zoomContextSlice.reducer;
