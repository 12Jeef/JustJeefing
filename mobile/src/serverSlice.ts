import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConnectionState } from "./types.mobile";

export type State = {
  dev: boolean;
  connection: ConnectionState;
};

const initialState: State = {
  dev: true,
  connection: "DISCONNECTED",
};

const slice = createSlice({
  name: "server",
  initialState,
  reducers: {
    setDev: (state: State, action: PayloadAction<boolean>) => {
      state.dev = action.payload;
    },
    setConnection: (state: State, action: PayloadAction<ConnectionState>) => {
      state.connection = action.payload;
    },
  },
});

export const { setDev, setConnection } = slice.actions;

export const serverReducer = slice.reducer;
