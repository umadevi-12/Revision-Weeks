import React, { useRef, useState } from "react";

function OTPInput() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return; 

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();

    if (/^\d{4}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      inputRefs.current[3].focus();
    }
  };

  const combinedOtp = otp.join("");

  const handleSubmit = () => {
    if (combinedOtp.length === 4) {
      console.log("Entered OTP:", combinedOtp);
      alert(`Entered OTP: ${combinedOtp}`);
    } else {
      alert("Please enter all 4 digits");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            ref={(el) => (inputRefs.current[index] = el)}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            style={{
              width: "50px",
              height: "50px",
              textAlign: "center",
              fontSize: "20px",
              border: "2px solid #333",
              borderRadius: "8px",
            }}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#007bff",
          color: "#fff",
        }}
      >
        Submit
      </button>
    </div>
  );
}

export default OTPInput;
