import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import io from "socket.io-client";

export const socket = io("https://team06-api.kwweb.duckdns.org");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>
);

reportWebVitals();
