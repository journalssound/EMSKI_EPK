import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import EmskiEPK from "./components/EmskiEPK";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EmskiEPK />
  </StrictMode>
);
