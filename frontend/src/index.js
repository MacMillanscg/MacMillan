import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "./Components/Context/AppContext";
import { Buffer } from "buffer";
window.Buffer = Buffer;

ReactDOM.render(
  <BrowserRouter>
    <AppProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <App />
    </AppProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
