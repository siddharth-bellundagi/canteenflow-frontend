import React, { useState } from "react";
import Login from "./pages/Login";
import Menu from "./pages/Menu";
import AdminMenu from "./pages/AdminMenu";
import AdminOrders from "./pages/AdminOrders";
import TokenBoard from "./pages/TokenBoard";
import Footer from "./components/Footer";




function App() {
  const path = window.location.pathname;

  if (path === "/token-board") {
    return <TokenBoard />;
  }

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <Login />;
  }

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white shadow-md">
  <h3 className="text-xl font-semibold tracking-wide">
    DYPCOEI-CanteenFlow 🍽️
  </h3>

  <button
    onClick={handleLogout}
    className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-md text-sm font-medium"
  >
    Logout
  </button>
</div>


      {role === "admin" && (
        <>
          <AdminMenu />
          <AdminOrders />
        </>
      )}

      <Menu />
      <Footer />

    </div>
  );
}


export default App;



