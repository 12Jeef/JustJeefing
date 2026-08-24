import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConnectionState } from "./types";

export type State = {
  server: {
    dev: boolean;
    connection: ConnectionState;
  };
};

const initialState: State = {
  server: {
    dev: true,
    connection: "DISCONNECTED",
  },
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setDev: (state: State, action: PayloadAction<boolean>) => {
      state.server.dev = action.payload;
    },
    setConnection: (state: State, action: PayloadAction<ConnectionState>) => {
      state.server.connection = action.payload;
    },
  },
});

export const { setDev, setConnection } = slice.actions;

export default slice.reducer;
