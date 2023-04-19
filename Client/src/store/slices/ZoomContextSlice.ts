import { createSlice } from "@reduxjs/toolkit";


export const zoomContextSlice: any = createSlice({
  initialState: {context: null,decrypted:null},
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
    }
  }
}
);

export const {
  setContext,
  setDecryptedContext
} = zoomContextSlice.actions;

export default zoomContextSlice.reducer;
