import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import EmskiEPK from "./components/EmskiEPK";
import EmskiPress from "./components/EmskiPress";
import logoSrc from "./assets/EMSKI-logo-white-rgb.png";

const WaitForMe = lazy(() => import("./components/wait-for-me/WaitForMe"));
const WaitForMeGallery = lazy(() => import("./components/wait-for-me/WaitForMeGallery"));
const WaitForMePreview = lazy(() => import("./components/wait-for-me/WaitForMePreview"));
const WaitForMeGallery2 = lazy(() => import("./components/wait-for-me/WaitForMeGallery2"));

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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmskiEPK />} />
        <Route path="/press" element={<EmskiPress />} />
        <Route
          path="/wait-for-me"
          element={
            <Suspense fallback={<div style={{ background: "#060609", position: "fixed", inset: 0 }} />}>
              <WaitForMe />
            </Suspense>
          }
        />
        <Route
          path="/wait-for-me/gallery"
          element={
            <Suspense fallback={<div style={{ background: "#060609", position: "fixed", inset: 0 }} />}>
              <WaitForMeGallery />
            </Suspense>
          }
        />
        <Route
          path="/wait-for-me/preview"
          element={
            <Suspense fallback={<div style={{ background: "#060609", position: "fixed", inset: 0 }} />}>
              <WaitForMePreview />
            </Suspense>
          }
        />
        <Route
          path="/wait-for-me/gallery2"
          element={
            <Suspense fallback={<div style={{ background: "#060609", position: "fixed", inset: 0 }} />}>
              <WaitForMeGallery2 />
            </Suspense>
          }
        />
        <Route path="*" element={<EmskiEPK />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
