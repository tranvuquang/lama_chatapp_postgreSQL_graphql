import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { AuthState, IUser, userDefaultData } from "./types";
import jwt_decode from "jwt-decode";

const accessToken = localStorage.getItem("accessToken") || "";

const getUser = () => {
  let user: IUser = userDefaultData;
  if (accessToken) {
    const { id, email } = jwt_decode(accessToken) as IUser;
    user = { ...user, id, email };
  }
  return user;
};

const initialState: AuthState = {
  user: getUser(),
  accessToken,
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserRedux: (state, action) => {
      state.user = action.payload;
    },
    setAccessTokenRedux: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem("accessToken", action.payload);
    },
    setLoadingRedux: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUserRedux, setAccessTokenRedux, setLoadingRedux } =
  authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
