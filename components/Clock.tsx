"use client";

import React, { useState, useEffect } from "react";

const Clock = () => {
  const [hour, setHour] = useState(6);
  const [isAM, setIsAM] = useState(true);

  useEffect(() => {
    const timerId = setInterval(() => {
      setHour((currentHour) => {
        // Increment the hour, and wrap back to 1 after 12
        return currentHour === 12 ? 1 : currentHour + 1;
      });
    }, 1000); // Update every second for demonstration

    return () => {
      clearInterval(timerId);
    };
  }, []);

  useEffect(() => {
    // Toggle AM/PM when hour wraps from 12 to 1
    if (hour === 12) {
      setIsAM(!isAM);
    }
  }, [hour]); // This effect runs whenever 'hour' changes

  const hourDegrees = ((hour % 12) / 12) * 360 + 90;
  const hourDigits = hour < 10 ? `0${hour}` : hour;

  return (
    <div className="flex flex-col items-center absolute top-14 right-1/2">
      {" "}
      {/* Updated class for center alignment */}
      <div className="w-48 h-48 border-8 border-white rounded-full relative bg-white shadow-xl">
        <div
          className="w-1/2 h-1 bg-black absolute top-1/2 -translate-y-1/2 left-0 transform origin-right"
          style={{ transform: `rotate(${hourDegrees}deg)` }}
        ></div>
      </div>
      <div className="text-white mt-4">
        {hourDigits}:00 {isAM ? "AM" : "PM"}
      </div>
    </div>
  );
};

export default Clock;
