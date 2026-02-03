import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";


function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "https://canteenflow-backend-1.onrender.com/api/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await response.json();
        if (!response.ok) {
          setMessage("Failed to fetch orders");
          return;
        }

        setOrders(data);
      } catch {
        setMessage("Server error");
      }
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");

    await fetch(
      `https://canteenflow-backend-1.onrender.com/api/orders/update-status/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      }
    );

    setOrders(
      orders.map((order) =>
        order._id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const statusStyle = (status) => {
    if (status === "Pending")
      return "bg-yellow-100 text-yellow-700";
    if (status === "Preparing")
      return "bg-blue-100 text-blue-700";
    if (status === "Ready")
      return "bg-green-100 text-green-700";
    return "bg-slate-100 text-slate-700";
  };
  const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("DYPCOEI-Canteen Flow – Order History", 14, 15);

  let y = 30;
  let totalCollection = 0; // 🔹 total money

  orders.forEach((order, index) => {
    doc.setFontSize(12);
    doc.text(`Order ${index + 1}`, 14, y);
    y += 6;

    doc.text(`Token: ${order.token}`, 14, y);
    y += 6;

    doc.text(`Status: ${order.status}`, 14, y);
    y += 6;

    doc.text("Items:", 14, y);
    y += 6;

    order.items.forEach((item) => {
      const itemTotal = item.price * item.qty;
      totalCollection += itemTotal; // 🔹 add to total

      doc.text(
        `- ${item.name} × ${item.qty} (₹${itemTotal})`,
        18,
        y
      );
      y += 6;
    });

    y += 8;

    if (y > 260) {
      doc.addPage();
      y = 20;
    }
  });

  // 🔹 FINAL TOTAL COLLECTION
  doc.setFontSize(14);
  doc.text("--------------------------------", 14, y);
  y += 8;

  doc.text(
    `TOTAL COLLECTION: ₹ ${totalCollection}`,
    14,
    y
  );

  doc.save("canteen-order-history.pdf");
};
const clearHistory = async () => {
  const confirmClear = window.confirm(
    "Are you sure you want to delete all collected orders?"
  );

  if (!confirmClear) return;

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      "http://localhost:5000/api/orders/clear-history",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();
    alert(data.message);

    // Remove collected orders from UI
    setOrders(
      orders.filter(order => order.status !== "Collected")
    );
  } catch {
    alert("Server error");
  }
};



  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Admin Order Dashboard
      </h2>
      <button
  onClick={downloadPDF}
  className="mb-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
>
  Download Order History (PDF)
</button>
<button
  onClick={clearHistory}
  className="ml-3 mb-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
>
  Clear Collected Orders
</button>



      {message && <p className="text-red-500">{message}</p>}

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left">Token</th>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order._id}
                className="border-t hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-semibold">
                  #{order.token}
                </td>

                <td className="px-4 py-3">
                  {order.items.map((item, i) => (
                    <div key={i}>
                      {item.name} × {item.qty}
                    </div>
                  ))}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-4 py-3 space-x-2">
                  <button
                    onClick={() =>
                      updateStatus(order._id, "Preparing")
                    }
                    className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
                  >
                    Preparing
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(order._id, "Ready")
                    }
                    className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs"
                  >
                    Ready
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(order._id, "Collected")
                    }
                    className="px-2 py-1 bg-slate-500 hover:bg-slate-600 text-white rounded text-xs"
                  >
                    Collected
                  </button>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-slate-500"
                >
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;

