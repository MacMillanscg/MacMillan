import React from "react";

export const MaskedToken = ({ token }) => {
  console.log("toekn", token);
  // Function to mask the token
  const maskToken = (token) => {
    if (!token) {
      // If token is undefined, null, or empty, return an appropriate message or an empty string
      return "";
    }
    const visibleChars = 3; // Number of characters to show at the beginning and end
    const maskedSection = "*".repeat(token.length - visibleChars * 2);
    return (
      token.substring(0, visibleChars) +
      maskedSection +
      token.substring(token.length - visibleChars)
    );
  };

  const maskedToken = maskToken(token);

  return (
    <div>
      <p className="mb-2">{maskedToken}</p>
    </div>
  );
};
