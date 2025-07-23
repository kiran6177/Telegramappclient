import React, { useEffect, useState } from "react";
import api from "../api";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';

function AdminPanel() {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

  useEffect(() => {
    fetchSlots();
    fetchBookings();
  }, []);

  const fetchSlots = async () => {
    const res = await api.get("/slots");
    setSlots(res.data);
  };

  const fetchBookings = async () => {
    const res = await api.get("/bookings", { params: { telegramId } });
    setBookings(res.data);
  };

  const addSlot = async e => {
    e.preventDefault();
    if (!date || !time) return;
    // Combine date and time into a single Date object in local time
    const localDate = new Date(date);
    localDate.setHours(time.getHours());
    localDate.setMinutes(time.getMinutes());
    localDate.setSeconds(0);
    localDate.setMilliseconds(0);
    // Store as UTC ISO string
    const datetimeUtc = localDate.toISOString();
    await api.post("/slots", { datetimeUtc, telegramId });
    setDate(null); setTime(null);
    fetchSlots();
  };

  function formatSlotDate(utcString) {
    if (!utcString) return '';
    const d = new Date(utcString);
    return d.toLocaleString(undefined, {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    }).replace(/, (\d{1,2}):([0-5][0-9]) (AM|PM)/, (m, h, min, ap) => `, ${h}${min !== '00' ? ':' + min : ''} ${ap}`);
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-[#eaf3fb] p-6 rounded-2xl shadow-lg border border-[#b3d1f7]">
      <h2 className="text-2xl font-editorial text-[#2563eb] mb-4">Admin Panel</h2>
      <div className="flex flex-col gap-2 bg-white/80 p-4 rounded-xl border border-[#b3d1f7]">
        <h3 className="font-semibold text-[#2563eb] mb-2 font-editorial">Add Slot</h3>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <form onSubmit={addSlot} className="flex flex-col gap-2">
            <div className="flex md:flex-row flex-col gap-2">
              <DatePicker
                label="Date"
                value={date}
                onChange={setDate}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                    size: 'small',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        minHeight: '44px',
                        maxHeight: '44px',
                        height: '44px',
                        background: '#f9f9f9',
                        fontSize: '1rem',
                        fontFamily: 'Satoshi, system-ui, Avenir, Helvetica, Arial, sans-serif',
                        fontWeight: 500,
                        color: '#2563eb',
                        padding: 0,
                      },
                      '& .MuiInputBase-input': {
                        minHeight: '44px',
                        maxHeight: '44px',
                        height: '44px',
                        padding: '0.6em 1.2em',
                        boxSizing: 'border-box',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#2563eb',
                        fontFamily: 'Satoshi, system-ui, Avenir, Helvetica, Arial, sans-serif',
                        fontWeight: 500,
                        fontSize: '1rem',
                      },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#b3d1f7' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' },
                      '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' },
                      '& input::placeholder': {
                        color: '#888',
                        opacity: 1,
                      },
                    },
                  },
                }}
              />
              <TimePicker
                label="Time"
                value={time}
                onChange={setTime}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                    size: 'small',
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        minHeight: '44px',
                        maxHeight: '44px',
                        height: '44px',
                        background: '#f9f9f9',
                        fontSize: '1rem',
                        fontFamily: 'Satoshi, system-ui, Avenir, Helvetica, Arial, sans-serif',
                        fontWeight: 500,
                        color: '#2563eb',
                        padding: 0,
                      },
                      '& .MuiInputBase-input': {
                        minHeight: '44px',
                        maxHeight: '44px',
                        height: '44px',
                        padding: '0.6em 1.2em',
                        boxSizing: 'border-box',
                      },
                      '& .MuiInputLabel-root': {
                        color: '#2563eb',
                        fontFamily: 'Satoshi, system-ui, Avenir, Helvetica, Arial, sans-serif',
                        fontWeight: 500,
                        fontSize: '1rem',
                      },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#b3d1f7' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' },
                      '& .Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2563eb' },
                      '& input::placeholder': {
                        color: '#888',
                        opacity: 1,
                      },
                    },
                  },
                }}
              />
            </div>
            <button type="submit" className="bg-[#2563eb] text-white rounded-lg font-editorial text-lg hover:bg-[#1d4ed8] transition">Add Slot</button>
          </form>
        </LocalizationProvider>
      </div>
      <div className="flex flex-col gap-2 bg-white/80 p-4 rounded-xl border border-[#b3d1f7] mt-4">
        <h3 className="font-semibold text-[#2563eb] mb-2 font-editorial">Available Slots</h3>
        <ul className="list-disc pl-5 text-[#2563eb]">
          {slots.map(slot => <li key={slot._id}>{formatSlotDate(slot.datetimeUtc)}</li>)}
        </ul>
      </div>
      <div className="flex flex-col gap-2 bg-white/80 p-4 rounded-xl border border-[#b3d1f7] mt-4">
        <h3 className="font-semibold text-[#2563eb] mb-2 font-editorial">Bookings</h3>
        <ul className="list-disc pl-5 text-[#2563eb]">
          {bookings.map(b => (
            <li key={b._id}>
              {b.user?.name} - {formatSlotDate(b.slot?.datetimeUtc)} - {b.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPanel; 