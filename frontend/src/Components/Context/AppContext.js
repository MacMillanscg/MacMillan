import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { resolvePath } from "react-router-dom";

// Create a context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [id, setId] = useState(null);
  const [filterData, setFilteredData] = useState([]);

  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  // const user = JSON.parse(localStorage.getItem("rememberMeUser"));
  // const user1 = JSON.parse(sessionStorage.getItem("user"));
  // console.log("user111", user1);
  // console.log("user", user);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/auth")
  //     .then((response) => {
  //       if (response) {
  //         const filtered = response.data.filter((fil) => fil._id === user._id);
  //         setFilteredData(
  //           filtered.map(
  //             ({ _id, name, email }) => (
  //               setEmail(email), setName(name), setId(_id)
  //             )
  //           )
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //       // Handle error - show error message to the user
  //     });
  // }, [user, user1]);

  // Calculate dashboard width based on sidebar state
  const dashboardWidth = sidebarMinimized
    ? "calc(100% - 80px)"
    : "calc(100% - 238px)";

  return (
    <AppContext.Provider
      value={{
        sidebarMinimized,
        setSidebarMinimized,
        dashboardWidth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  return useContext(AppContext);
};
