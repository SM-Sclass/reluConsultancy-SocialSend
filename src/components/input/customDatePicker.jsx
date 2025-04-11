import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";

const CustomDatePicker = ({ dateValue, setDateValue, placeholder }) => {
  const [selectedDate, setSelectedDate] = useState(dateValue);
  const [isOpen, setIsOpen] = useState(false);

  // Handle the date selection and format it to YYYY-MM-DD
  const handleDateChange = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    setSelectedDate(formattedDate); // Set the date directly as YYYY-MM-DD

    setIsOpen(false); // Close the calendar after selecting a date
    console.log("Selected Date:", formattedDate); // Log in YYYY-MM-DD format
    setDateValue(formattedDate);
  };

  const toggleCalendar = () => {
    setIsOpen(!isOpen); // Toggle the calendar visibility
  };

  useEffect(() => {
    setSelectedDate(dateValue)
  },[dateValue])

  return (
    <div className="relative flex items-center justify-center p-4">
      <div className="relative">
        <input
          id="date-picker"
          type="text"
          value={selectedDate}
          onClick={toggleCalendar} // Open calendar on input click
          placeholder={`${placeholder ? placeholder : "Select Date"}`}
          readOnly
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {isOpen && (
          <div className="absolute z-10 bg-white shadow-lg rounded-md mt-2">
            <DayPicker
              selected={selectedDate ? new Date(selectedDate) : null}
              onDayClick={handleDateChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomDatePicker;
