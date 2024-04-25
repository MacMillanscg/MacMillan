import React from "react";
import styles from "./Dashboard.module.css";
import { useNavigate } from "react-router-dom";
import { Header } from "../Header/Header";
import { Sidebar } from "../Sidebar/Sidebar";

export const Dashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear local storage
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className={styles.dashboard}>
      {/* <Header />
      <Sidebar /> */}
      Welcome to Dashboard
    </div>
  );
};
