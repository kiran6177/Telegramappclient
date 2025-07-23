import React, { useState, useEffect, useRef } from "react";
import api from "../api";

function BookingForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", motive: "" });
  const [slotId, setSlotId] = useState("");
  const [slots, setSlots] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    api.get("/slots").then(res => setSlots(res.data));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSlotSelect = (id) => {
    setSlotId(id);
    setDropdownOpen(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const telegramId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || "test_user";
    await api.post("/bookings", { ...form, slotId, telegramId });
    setSubmitted(true);
  };

  // Helper to format UTC datetime to local string
  function formatSlotDate(utcString) {
    if (!utcString) return '';
    const d = new Date(utcString);
    return d.toLocaleString(undefined, {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    }).replace(/, (\d{1,2}):([0-5][0-9]) (AM|PM)/, (m, h, min, ap) => `, ${h}${min !== '00' ? ':' + min : ''} ${ap}`);
  }

  if (submitted) return <div className="text-green-600 font-semibold text-center">Booking submitted! You'll be notified after approval.</div>;

  return (
    <div className="max-w-xl mx-auto bg-[#eaf3fb] p-6 rounded-2xl shadow-lg border border-[#b3d1f7]">
      <h2 className="text-2xl font-editorial text-[#2563eb] mb-4">Let's Build Something Bold</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required className="w-full border border-[#b3d1f7] rounded-lg px-4 py-3 bg-white text-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#60a5fa]" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full border border-[#b3d1f7] rounded-lg px-4 py-3 bg-white text-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#60a5fa]" />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required className="w-full border border-[#b3d1f7] rounded-lg px-4 py-3 bg-white text-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#60a5fa]" />
        <textarea name="motive" placeholder="Motive" value={form.motive} onChange={handleChange} required className="w-full border border-[#b3d1f7] rounded-lg px-4 py-3 bg-white text-[#2563eb] focus:outline-none resize-none focus:ring-2 focus:ring-[#60a5fa]" />
        {/* Custom Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className={`w-full flex justify-between items-center border border-[#b3d1f7] rounded-lg px-4 py-3 bg-white text-[#2563eb] font-medium focus:outline-none focus:ring-2 focus:ring-[#60a5fa] transition ${dropdownOpen ? 'ring-2 ring-[#60a5fa]' : ''}`}
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <span>{slotId ? formatSlotDate(slots.find(s => s._id === slotId)?.datetimeUtc) : "Select a slot"}</span>
            <svg className={`w-5 h-5 ml-2 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
          {dropdownOpen && (
            <ul className="absolute z-10 mt-1 w-full p-2 flex flex-col gap-2 bg-white border border-[#b3d1f7] rounded-lg shadow-lg max-h-60 overflow-auto">
              {slots.length === 0 && (
                <li className="px-4 py-2 text-[#2563eb]">No slots available</li>
              )}
              {slots.map(slot => (
                <li
                  key={slot._id}
                  className={`px-4 py-2 cursor-pointer rounded-xl hover:bg-[#e0edfa] text-[#2563eb] ${slotId === slot._id ? 'bg-[#dbeafe] font-semibold' : ''}`}
                  onClick={() => handleSlotSelect(slot._id)}
                >
                  {formatSlotDate(slot.datetimeUtc)}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="w-full bg-[#2563eb] text-white py-3 rounded-lg font-editorial text-lg hover:bg-[#1d4ed8] transition">Book</button>
      </form>
    </div>
  );
}

export default BookingForm; 