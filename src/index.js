import React from "react";
import ReactDOM from "react-dom/client";
import "./style/index.css";
import App from "./App";


const redirect = sessionStorage.redirect;
if (redirect) {
  sessionStorage.removeItem("redirect");
  window.history.replaceState(null, null, redirect);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
