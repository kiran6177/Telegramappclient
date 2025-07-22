import React, { useEffect, useState } from "react";
import api from "../api";

function AdminPanel() {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
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
    await api.post("/slots", { date, time, telegramId });
    setDate(""); setTime("");
    fetchSlots();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
      <form onSubmit={addSlot} className="flex gap-2 mb-6">
        <input value={date} onChange={e => setDate(e.target.value)} placeholder="Date (YYYY-MM-DD)" required className="border rounded px-3 py-2 flex-1" />
        <input value={time} onChange={e => setTime(e.target.value)} placeholder="Time (HH:MM)" required className="border rounded px-3 py-2 flex-1" />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Add Slot</button>
      </form>
      <h3 className="font-semibold mb-2">Available Slots</h3>
      <ul className="mb-6 list-disc pl-5">
        {slots.map(slot => <li key={slot._id}>{slot.date} {slot.time}</li>)}
      </ul>
      <h3 className="font-semibold mb-2">Bookings</h3>
      <ul className="list-disc pl-5">
        {bookings.map(b => (
          <li key={b._id}>
            {b.user?.name} - {b.slot?.date} {b.slot?.time} - {b.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel; 