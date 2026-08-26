import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Day } from "./types.mobile";

export type State = {
  days: Day[];
};

const initialState: State = {
  days: [],
};

const slice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setDays: (state: State, action: PayloadAction<Day[]>) => {
      state.days = action.payload;
    },
  },
});

export const { setDays } = slice.actions;

export const todoReducer = slice.reducer;
