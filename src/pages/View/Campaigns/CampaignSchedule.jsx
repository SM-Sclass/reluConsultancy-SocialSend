import React, { useState } from 'react'
import { format } from "date-fns"
import {cn } from '../../../lib/utils'
import { Popover, PopoverTrigger, PopoverContent } from '../../../components/ui/popover'
import { Button } from '../../../components/ui/button'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '../../../components/ui/calendar'

function CampaignSchedule() {
  const [date, setDate] = useState(null);
  const [scheduleName, setScheduleName] = useState('New Schedule');
  // const [startDate, setStartDate] = useState('Dec 25, 2024');
  // const [endDate, setEndDate] = useState('');
  const [fromTime, setFromTime] = useState('7:00 PM');
  const [toTime, setToTime] = useState('9:00 PM');
  const [timeZone, setTimeZone] = useState('Eastern Time Zone');
  const [selectedDays, setSelectedDays] = useState({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: false,
    Sunday: false
  });

  const handleDayToggle = (day) => {
    setSelectedDays({
      ...selectedDays,
      [day]: !selectedDays[day]
    });
  };

  return (
    <div className="max-w-8xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Panel */}
        <div className="w-full md:w-60 space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Starting:</p>
            <div className="border rounded p-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
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
              </Popover>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Ending:</p>
            <div className="border rounded p-3">
              <p className="text-blue-600 cursor-pointer">Select end date</p>
            </div>
          </div>

          <button className="w-full border rounded p-3 text-blue-600 flex items-center justify-center gap-2 mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Schedule
          </button>

          <button className="w-full border rounded p-3 text-gray-800">
            Add Schedule
          </button>
        </div>

        {/* Right Panel */}
        <div className="flex-1 border rounded-lg p-6 space-y-6">
          {/* Schedule Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Schedule Name</label>
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
                <select
                  className="w-full p-2 border rounded appearance-none bg-white pr-8 relative"
                  value={fromTime}
                  onChange={(e) => setFromTime(e.target.value)}
                >
                  <option>7:00 PM</option>
                  <option>8:00 PM</option>
                  <option>9:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">To</label>
                <select
                  className="w-full p-2 border rounded appearance-none bg-white pr-8"
                  value={toTime}
                  onChange={(e) => setToTime(e.target.value)}
                >
                  <option>9:00 PM</option>
                  <option>10:00 PM</option>
                  <option>11:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Time Zone</label>
                <select
                  className="w-full p-2 border rounded appearance-none bg-white pr-8"
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                >
                  <option>Eastern Time Zone</option>
                  <option>Central Time Zone</option>
                  <option>Pacific Time Zone</option>
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
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Save
            </button>
            <button className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              Discard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignSchedule