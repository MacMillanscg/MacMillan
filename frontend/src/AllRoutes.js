import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { NotFound } from "./Components/NotFound";
import { Register } from "./Components/Register/Register";
import { Login } from "./Components/Login/Login";
import { Dashboard } from "./Components/Dashboard/Dashboard";
import { OtpVerification } from "./Components/OtpVerification/OtpVerification";
import { ResetPassword } from "./Components/ResetPassword/ResetPassword";
import { ForgotPass } from "./Components/ForgotPass/ForgotPass";
import { Layout } from "./Components/Layout";
import { Support } from "./Components/Support/Support";
import { ProfileDetails } from "./Components/ProfileDetails/ProfileDetails";
import { ProfileResetPass } from "./Components/ProfileResetPass/ProfileResetPass";
import { Connections } from "./Components/Connections/Connections";
import { Connectors } from "./Components/Connectors/Connectors";
import { ClientsCom } from "./Components/ClientsCom/ClientsCom";
import { AlertMonitors } from "./Components/AlertMonitors/AlertMonitors";
import { DeployedInstances } from "./Components/DeployedInstances/DeployedInstances";

export const AllRoutes = () => {
  return (
    <div>
      <Routes>
        <Route
          element={
            <ProtectedRoutes>
              <Layout />
            </ProtectedRoutes>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/profiledetails" element={<ProfileDetails />} />
          <Route path="/profileResetPass" element={<ProfileResetPass />} />
          <Route path="/connectors" element={<Connectors />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/clients" element={<ClientsCom />} />
          <Route path="/alertmonitors" element={<AlertMonitors />} />
          <Route path="/deployedinstances" element={<DeployedInstances />} />
        </Route>

        <Route
          path="/register"
          element={
            <PublicRoutes>
              <Register />
            </PublicRoutes>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />

        <Route path="/forgot-password" element={<ForgotPass />} />
        <Route path="/otpverification" element={<OtpVerification />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        <Route path="/support" element={<Support />} />

        {/* <Route
          path="*"
          element={
            <ProtectedRoutes>
              <NotFound />
            </ProtectedRoutes>
          }
        /> */}
      </Routes>
    </div>
  );
};

export function ProtectedRoutes({ children }) {
  const user = localStorage.getItem("user");
  if (user !== "" && user) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export function PublicRoutes({ children }) {
  const user = localStorage.getItem("user");
  if (user !== "" && user) {
    return <Navigate to="/" />;
  } else {
    return children;
  }
}
