import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useAuthen } from "../helpers/useAuthen";
import "./login.scss";

import { loginMutation } from "../graphql-client/mutations";
import {
  selectAuth,
  setAccessTokenRedux,
  setUserRedux,
} from "../features/auth/authSlice";
import { IUser } from "../features/auth/types";
import { mutationClient } from "../graphql-client/config";

const formDataDefaultValue = {
  email: "admin@gmail.com",
  password: "123456",
};
type Props = {};

const LoginPage = (props: Props) => {
  useAuthen();
  const { accessToken, loading } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(formDataDefaultValue);
  const { email, password } = formData;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { resData } = (await mutationClient(
      accessToken,
      dispatch,
      loginMutation,
      {
        email,
        password,
      }
    )) as any;
    if (resData) {
      const { email, id, accessToken } = resData.data.login;
      dispatch(setAccessTokenRedux(accessToken as string));
      dispatch(setUserRedux({ email, id } as IUser));
    }
  };
  return (
    <div className="login">
      <div className="background"></div>
      <form onSubmit={handleSubmit}>
        <h3>Login Here</h3>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          placeholder="Email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
        />
        <label htmlFor="password">Password</label>
        <input
          placeholder="Password"
          id="password"
          name="password"
          value={password}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          Log In{" "}
        </button>
        <div className="social">
          <div className="go">
            <i className="fab fa-google" /> Google
          </div>
          <div className="fb">
            <i className="fab fa-facebook" /> Facebook
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
