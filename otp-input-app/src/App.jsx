import React from "react";
import OTPInput from "./components/OTPInput";

function App() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        flexDirection: "column",
      }}
    >
      <h2>Enter 4-Digit OTP</h2>
      <OTPInput />
    </div>
  );
}

export default App;
