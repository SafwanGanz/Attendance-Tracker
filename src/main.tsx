import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("main.tsx is loading");

const rootElement = document.getElementById("root");
console.log("Root element:", rootElement);

if (!rootElement) {
  throw new Error("Root element not found");
}

console.log("About to render React app");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

console.log("React app rendered");