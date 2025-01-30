import React from "react";
import { Header } from "./Header/Header";
import { Sidebar } from "./Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div>
      <Header />
      <Sidebar />
      <Outlet />
    </div>
  );
};
