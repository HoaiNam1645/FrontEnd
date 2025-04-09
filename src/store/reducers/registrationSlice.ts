import { createSlice } from "@reduxjs/toolkit";

interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
};

const registrationSlice = createSlice({
  name: "registration",
  initialState,
  reducers: {
    login: (state, action) => {
      console.log("Login action payload:", action.payload);
      state.isAuthenticated = true;
      state.token = action.payload.token || null;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },
    setUserData: (state, action) => {
      console.log("SetUserData action payload:", action.payload);
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
    },
  },
});

export const { logout, login, setUserData } = registrationSlice.actions;
export default registrationSlice.reducer;
