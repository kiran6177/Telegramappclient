import React, { useState, useEffect } from "react";
import api from "../api";

function BookingForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", motive: "" });
  const [slotId, setSlotId] = useState("");
  const [slots, setSlots] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get("/slots").then(res => setSlots(res.data));
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSlotChange = e => setSlotId(e.target.value);

  const handleSubmit = async e => {
    e.preventDefault();
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || "test_user";
    await api.post("/bookings", { ...form, slotId, telegramId });
    setSubmitted(true);
  };

  if (submitted) return <div className="text-green-600 font-semibold text-center">Booking submitted! You'll be notified after approval.</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      <input name="motive" placeholder="Motive" value={form.motive} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      <select value={slotId} onChange={handleSlotChange} required className="w-full border rounded px-3 py-2">
        <option value="">Select a slot</option>
        {slots.map(slot => (
          <option key={slot._id} value={slot._id}>{slot.date} {slot.time}</option>
        ))}
      </select>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Book</button>
    </form>
  );
}

export default BookingForm; 