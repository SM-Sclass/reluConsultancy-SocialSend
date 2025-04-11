import React, { useEffect, useState } from "react";
import { parse, format } from "date-fns";

const CustomTimePicker = ({ timeValue, setTimeValue }) => {
    const formatTo24Hour = (time) => {
      const [hours, minutes] = time.split(":");
      return `${hours.padStart(2, "0")}:${minutes}`; // Pad the hour to 2 digits if needed
    };

  const [time, setTime] = useState(formatTo24Hour(timeValue)); // Initialize state for the time value


  // Handle change in the time input and format the time to 24-hour format before saving
  const handleTimeChange = (event) => {
    const newTime = event.target.value;

    // Format the time to 24-hour format using date-fns
    const formattedTime = format(parse(newTime, "HH:mm", new Date()), "HH:mm");

    // Save the formatted time in the state
    setTime(formattedTime);
    setTimeValue(formattedTime);
  };

  useEffect(() => {
    setTime(formatTo24Hour(timeValue))
  },[timeValue])
  return (
    <div>
      <div class="flex items-center space-x-2">
        <input
          type="time"
          id="time"
          name="time"
          value={time} // Bind the value of the input to the state
          onChange={handleTimeChange} // Update the state when the time changes
          className="border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
    </div>
  );
};

export default CustomTimePicker;
