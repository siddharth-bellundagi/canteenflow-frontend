import React, { useState } from "react";

function AdminMenu() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  const handleAddMenu = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("https://canteenflow-backend-1.onrender.com/api/menu/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          price
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to add menu");
        return;
      }

      setMessage("Menu item added successfully ✅");
      setName("");
      setPrice("");
    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
  <div className="container">
    <h2>Admin Panel – Add Menu</h2>

    <form onSubmit={handleAddMenu}>
      <label>Item Name</label>
      <input
        type="text"
        className="border border-black text-black px-3 py-1 rounded"

        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label  >Price</label>
      <input
        type="number"
         className="border border-black text-black px-3 py-1 rounded"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button type="submit" className="bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-1 rounded" >
        Add Menu Item
      </button>
    </form>

    <p className="message">{message}</p>
  </div>
);

}

export default AdminMenu;
