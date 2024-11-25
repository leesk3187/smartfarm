// websocketcontext.js
import React, { createContext, useContext, useState, useEffect } from "react";

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const [sensorData, setSensorData] = useState({});
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("ws://192.168.0.100:8080");
    setWs(socket);

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        // console.log("Data received from server:", data);

        if (data.sensorData) {
          setSensorData(data.sensorData);
        } else {
          console.warn("No sensorData in received data");
        }
      } catch (error) {
        console.error("Error parsing message data:", error);
      }
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error.message);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setWs(null);
    };

    return () => {
      if (socket) socket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ ws, sensorData }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
