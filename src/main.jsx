import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import EmskiEPK from "./components/EmskiEPK";
import logoSrc from "./assets/EMSKI-logo-white-rgb.png";

/* ── Dynamic favicon: crop the "E" from the EMSKI logo ── */
(function setFavicon() {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    // Crop the left ~20% of the logo (the "E"), fit into a square
    const cropW = img.width * 0.23;
    const cropH = img.height;
    const pad = 4;
    const drawSize = size - pad * 2;
    const scale = Math.min(drawSize / cropW, drawSize / cropH);
    const dw = cropW * scale;
    const dh = cropH * scale;
    const dx = (size - dw) / 2;
    const dy = (size - dh) / 2;

    ctx.drawImage(img, 0, 0, cropW, cropH, dx, dy, dw, dh);

    const link = document.querySelector("link[rel='icon']") || document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    link.href = canvas.toDataURL("image/png");
    document.head.appendChild(link);
  };
  img.src = logoSrc;
})();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EmskiEPK />
  </StrictMode>
);
