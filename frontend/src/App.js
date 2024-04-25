import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
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

function App() {
  return (
    <div className="App">
      <Routes>
        {/* <ProtectedRoutes>
          <AllRoutes />
        </ProtectedRoutes> */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profiledetails" element={<ProfileDetails />} />
          <Route path="/profileResetPass" element={<ProfileResetPass />} />
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

        <Route path="/forgotpass" element={<ForgotPass />} />
        <Route path="/otpverification" element={<OtpVerification />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
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
}

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

export default App;
