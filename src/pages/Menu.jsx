import React, { useEffect, useState } from "react";

function Menu() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [tokenNumber, setTokenNumber] = useState(null);

  const role = localStorage.getItem("role");

  // Fetch menu
  useEffect(() => {
    const fetchMenu = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("https://canteenflow-backend-1.onrender.com/api/menu", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (!response.ok) {
          setMessage("Failed to load menu");
          return;
        }
        setMenu(data);
      } catch {
        setMessage("Server error");
      }
    };

    fetchMenu();
  }, []);

  // Add to cart
  const addToCart = (item) => {
    const existing = cart.find((i) => i._id === item._id);

    if (existing) {
      setCart(
        cart.map((i) =>
          i._id === item._id ? { ...i, qty: i.qty + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  // Delete menu (admin)
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`https://canteenflow-backend-1.onrender.com/api/menu/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    setMenu(menu.filter((item) => item._id !== id));
  };

  // Total bill
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // Place order
  const placeOrder = async () => {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "https://canteenflow-backend-1.onrender.com/api/orders/place",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            name: item.name,
            price: item.price,
            qty: item.qty
          }))
        })
      }
    );

    const data = await response.json();
    setTokenNumber(data.token);
    setCart([]);
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* MENU SECTION */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-semibold mb-4">Menu</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menu.map((item) => (
            <div
  key={item._id}
  className="bg-white rounded-lg shadow p-4 flex justify-between items-center border border-black"
>

              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-slate-600">₹{item.price}</p>
              </div>

              {role === "admin" ? (
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              ) : (
                <button
                  onClick={() => addToCart(item)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded"
                >
                  Add
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CART SECTION */}
      {role !== "admin" && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-3">Your Order</h2>

          {cart.length === 0 && (
            <p className="text-slate-500">No items added</p>
          )}

          {cart.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center mb-2"
            >
              <span>
                {item.name} × {item.qty}
              </span>
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          {cart.length > 0 && (
            <>
              <hr className="my-3" />
              <p className="font-semibold">
                Total: ₹{totalAmount}
              </p>

              <button
                onClick={placeOrder}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
              >
                Place Order
              </button>
            </>
          )}

          {tokenNumber && (
            <p className="mt-4 font-bold text-green-600">
              🎟️ Token: {tokenNumber}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Menu;



