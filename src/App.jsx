import React, { useState, useEffect } from "react";
import BookingForm from "./components/BookingForm.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import api from "./api";

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
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Book a Call</h1>
      {isAdmin ? <AdminPanel /> : <BookingForm />}
    </div>
  );
}

export default App;
