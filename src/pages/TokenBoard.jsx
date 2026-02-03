import React, { useEffect, useState, useRef } from "react";



function TokenBoard() {
  const [tokens, setTokens] = useState([]);
  const prevTokenCount = useRef(0);
  const [audioEnabled, setAudioEnabled] = useState(false);


  const fetchReadyTokens = async () => {
    try {
      const response = await fetch(
        "https://canteenflow-backend-1.onrender.com/api/orders"
      );

      const data = await response.json();

      // show only READY orders
      const readyOrders = data.filter(
        (order) => order.status === "Ready"
      );

      // play sound if new token added
if (
  audioEnabled &&
  readyOrders.length > prevTokenCount.current
) {
  const audio = new Audio("/beep.mp3");
  audio.play();
}


prevTokenCount.current = readyOrders.length;
setTokens(readyOrders);

    } catch (error) {
      console.log("Error fetching tokens");
    }
  };

  useEffect(() => {
    fetchReadyTokens();

    const interval = setInterval(fetchReadyTokens, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
  onClick={() => {
  document.documentElement.requestFullscreen();
  setAudioEnabled(true);
}}

  style={{
    height: "100vh",
    background: "#0f172a",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer"
  }}
>

      <h1 style={{ fontSize: "48px", marginBottom: "30px" }}>
        NOW SERVING
      </h1>

      {tokens.length === 0 && (
        <h2>No tokens ready</h2>
      )}

      {tokens.map((order) => (
        <div
          key={order._id}
          style={{
            fontSize: "40px",
            margin: "10px",
            background: "#22c55e",
            padding: "20px 40px",
            borderRadius: "10px"
          }}
        >
          TOKEN {order.token}
        </div>
      ))}
    </div>
  );
}

export default TokenBoard;

