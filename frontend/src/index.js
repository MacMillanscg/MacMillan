import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import { Toaster } from "react-hot-toast";

ReactDOM.render(
  <BrowserRouter>
    <Toaster position="top-center" reverseOrder={false} />
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
