import React from "react";
import AnimatedBanner from "./components/AnimatedBanner";
import "./index.css";

export default function App() {
  return (
    <div className="app-container">
      <div className="banner-box">
        <AnimatedBanner
          texts={["Create.", "Learn.", "Grow."]}
          typingSpeed={120}
          erasingSpeed={60}
          delayBeforeErase={1000}
          delayBeforeNext={500}
          loop={true}
        />
        <p className="subtitle">Build a portfolio — one step at a time.</p>
      </div>
    </div>
  );
}
