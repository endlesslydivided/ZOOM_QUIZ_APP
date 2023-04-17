import { createSlice } from "@reduxjs/toolkit";


export const zoomContextSlice: any = createSlice({
  initialState: {context: null},
  name: "zoomContextSlice",
  reducers: {
    setContext: (state: any, action) => {
      const context = action.payload;
      state.context = context;
      return  state;
    }
  }
}
);

export const {
  setContext
} = zoomContextSlice.actions;

export default zoomContextSlice.reducer;
