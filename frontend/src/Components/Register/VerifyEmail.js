import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/auth/verify/${token}`
        );
        if (response.data.success) {
          setVerificationStatus("success");
          toast.success(response.data.message);
          navigate("/login");
        } else {
          setVerificationStatus("error");
          toast.error(response.data.message);
        }
      } catch (error) {
        setVerificationStatus("error");
        toast.error("Verification failed. Please try again.");
      }
    };

    verifyToken();
  }, [token, navigate]);

  return (
    <div className="verify-email-container">
      {verificationStatus === "" && <p>Verifying your email...</p>}
      {verificationStatus === "success" && (
        <p>Email verified successfully. Redirecting to login...</p>
      )}
      {verificationStatus === "error" && (
        <p>Invalid or expired verification link.</p>
      )}
    </div>
  );
};
