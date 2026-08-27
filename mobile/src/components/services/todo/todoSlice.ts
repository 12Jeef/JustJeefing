import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Day } from "./types.mobile";
import { UUID } from "@/types.server";

export type State = {
  days: Day[];
  lockedItems: UUID[];
};

const initialState: State = {
  days: [],
  lockedItems: [],
};

const slice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setDays: (state: State, action: PayloadAction<Day[]>) => {
      state.days = action.payload;
    },
    lockItem: (state: State, action: PayloadAction<UUID>) => {
      state.lockedItems.push(action.payload);
    },
    unlockItem: (state: State, action: PayloadAction<UUID>) => {
      state.lockedItems.splice(state.lockedItems.indexOf(action.payload), 1);
    },
  },
});

export const { setDays, lockItem, unlockItem } = slice.actions;

export const todoReducer = slice.reducer;
