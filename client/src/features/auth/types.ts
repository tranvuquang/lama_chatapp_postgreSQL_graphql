export type IUser = {
  id: string;
  email: string;
};

export type AuthState = {
  user: IUser;
  accessToken: string;
  loading: boolean;
};

export const userDefaultData = {
  id: "",
  email: "",
};
