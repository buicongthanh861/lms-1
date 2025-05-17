import { createSlice } from "@reduxjs/toolkit";

const documentSlice = createSlice({
  name: "document",
  initialState: {
    document: null, // chỉ lưu 1 document hiện tại
  },
  reducers: {
    setDocument: (state, action) => {
      state.document = action.payload;
    },
  },
});

export const { setDocument } = documentSlice.actions;
export default documentSlice.reducer;

