import React, { useEffect, useState } from "react";
import { format, parse, parseISO } from "date-fns";
import { useParams } from "react-router";
import {
  createSchedule,
  getScheduleData,
} from "@/pages/View/Campaigns/Service/Campaign.service";
import CustomDatePicker from "./input/customDatePicker";
import CustomTimePicker from "./input/customTimePicker";

const allDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const convertDaysArrayToObject = (daysArray) => {
  return Object.fromEntries(
    allDays.map((day) => [day, daysArray.includes(day)])
  );
};

function CampaignSchedule() {
  const [scheduleName, setScheduleName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [timeZone, setTimeZone] = useState("UTC");
  const [selectedDays, setSelectedDays] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false,
  });
  const { id } = useParams();

  const handleDayToggle = (day) => {
    setSelectedDays({
      ...selectedDays,
      [day]: !selectedDays[day],
    });
  };

  const resetSchedule = () => {
    setSelectedDays({
      Monday: true,
      Tuesday: true,
      Wednesday: true,
      Thursday: true,
      Friday: true,
      Saturday: false,
      Sunday: false,
    });
    setScheduleName("");
    setStartDate("");
    setEndDate("");
    setFromTime("");
    setToTime("");
  };
  const autoFillData = (schedule) => {
    setScheduleName(schedule.schedule_name);
    const newStartDate = format(schedule.start_date, "yyyy-MM-dd");
    setStartDate(newStartDate);
    const newEndDate = format(schedule.end_date, "yyyy-MM-dd");
    setEndDate(newEndDate);
    const newFromTime = format(
      parseISO(schedule.timing_info.timing_from, "HH:mm", new Date()),
      "HH:mm"
    );
    setFromTime(newFromTime);
    const newToTime = format(
      parseISO(schedule.timing_info.timing_to, "HH:mm", new Date()),
      "HH:mm"
    );
    setToTime(newToTime);
    const mahesh = convertDaysArrayToObject(schedule.days);
    setSelectedDays(mahesh);
  };

  const handleSave = () => {
    const payload = {
      campaign_id: id,
      start_date: startDate,
      end_date: endDate,
      schedule_name: scheduleName,
      timing_info: {
        timing_from: fromTime,
        timing_to: toTime,
      },
      timezone: timeZone,
      days: Object.keys(selectedDays).filter((day) => selectedDays[day]),
    };
    try {
      createSchedule(payload);
    } catch (error) {
      console.log(error);
    }
  };

  const setDefaultData = async () => {
    try {
      const response = await getScheduleData(id);
      if (response?.schedule) {
        autoFillData(response?.schedule);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    setDefaultData();
  }, []);

  return (
    <div className="p-4 border rounded-sm w-full">
      <div className="max-w-8xl mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Panel */}
          <div className="w-full md:w-60 space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Starting:</p>
              <div className=" rounded p-3">
                <CustomDatePicker
                  dateValue={startDate}
                  setDateValue={setStartDate}
                  placeholder={`Select Start Date`}
                />
                {/* <DatePicker /> */}
                {/* <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal"
                        // !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover> */}
                {/* <DatePickerPopover /> */}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Ending:</p>
              <div className="border rounded p-3">
                <CustomDatePicker
                  dateValue={endDate}
                  setDateValue={setEndDate}
                  placeholder={`Select End Date`}
                />
                {/* <p className="text-blue-600 cursor-pointer">Select end date</p> */}
              </div>
            </div>

            <button
              onClick={resetSchedule}
              className="w-full border rounded p-3 text-blue-600 flex items-center justify-center gap-2 mt-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Schedule
            </button>
            {/* ----  */}
            <button className="hidden w-full border rounded p-3 text-gray-800">
              Add Schedule
            </button>
          </div>

          {/* Right Panel */}
          <div className="flex-1 border rounded-lg p-6 space-y-6">
            {/* Schedule Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Schedule Name
              </label>
              <input
                type="text"
                value={scheduleName}
                onChange={(e) => setScheduleName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Timing */}
            <div>
              <h3 className="text-sm font-medium mb-4">Timing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">From</label>
                  <CustomTimePicker
                    timeValue={fromTime}
                    setTimeValue={setFromTime}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">To</label>
                  <CustomTimePicker
                    timeValue={toTime}
                    setTimeValue={setToTime}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Time Zone</label>
                  <select
                    className="w-full p-2 border rounded appearance-none bg-secondary pr-8"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                  >
                    <option value={"UTC"}>Coordinated Universal Time</option>
                    <option value="CTZ">Central Time Zone</option>
                    <option value="PTZ">Pacific Time Zone</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Days */}
            <div>
              <h3 className="text-sm font-medium mb-4">Days</h3>
              <div className="flex flex-wrap gap-3">
                {Object.keys(selectedDays).map((day) => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDays[day]}
                      onChange={() => handleDayToggle(day)}
                      className="h-4 w-4 text-blue-600 mr-2"
                    />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => handleSave()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={resetSchedule}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignSchedule;
