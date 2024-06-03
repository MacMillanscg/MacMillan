import React from "react";

export const MaskedToken = ({ token }) => {
  // Function to mask the token
  const maskToken = (token) => {
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
      <p>{maskedToken}</p>
    </div>
  );
};
