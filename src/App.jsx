import React, { useState, useEffect } from "react";
import BookingForm from "./components/BookingForm.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import api from "./api";
import darkLogo from "./assets/svg/dark_logo.png";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const telegramUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    console.log(telegramUser);
    if (telegramUser && telegramUser.id) {
      setIsAdmin(true);
      setChecked(true);
      api.post("/whoami", { telegramId: telegramUser.id })
        .then(res => {
          setIsAdmin(res.data.role === "admin");
          setChecked(true);
        });
    } else {
      setChecked(true); // fallback for non-Telegram browser
    }
  }, []);

  if (!checked) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="w-screen  min-h-screen mx-auto p-4">
      <div className="flex items-end max-w-xl mx-auto gap-4 mb-4">
        <img src={darkLogo} alt="logo" className="w-32 " />
        <h1 className="text-2xl font-bold  place-self-baseline">Appoitment Tracker</h1>
      </div>
      {isAdmin ? <AdminPanel /> : <BookingForm />}
    </div>
  );
}

export default App;
