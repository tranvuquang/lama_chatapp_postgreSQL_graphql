import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAuth } from "../../features/auth/authSlice";
import { socket } from "../../pages/messenger/MessengerHomePage";
import Menu from "../Menu/Menu";

type Props = {};

const Layout = (props: Props) => {
  const { user } = useAppSelector(selectAuth);
  useEffect(() => {
    socket.emit("addUserFromClient", user.id);
  }, [user]);

  return (
    <div>
      <Menu />
      <hr />
      <Outlet />
    </div>
  );
};

export default Layout;
