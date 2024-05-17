import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { resolvePath } from "react-router-dom";

// Create a context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [id, setId] = useState(null);
  const [filterData, setFilteredData] = useState([]);

  const [sidebarMinimized, setSidebarMinimized] = useState(false);

  const user = JSON.parse(localStorage.getItem("rememberMeUser"));
  console.log(filterData);

  useEffect(() => {
    axios
      .get("http://localhost:5000/auth")
      .then((response) => {
        if (response) {
          const filtered = response.data.filter((fil) => fil._id === user._id);
          setFilteredData(
            filtered.map(
              ({ _id, name, email }) => (
                setEmail(email), setName(name), setId(_id)
              )
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle error - show error message to the user
      });
  }, [id]);

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
        name,
        setName,
        email,
        phone,
        setPhone,
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
