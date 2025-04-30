import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // ✅ Uncomm   ent if you have global styles  
import App from "./App";  // ✅ Keep Router only inside App.js

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
