import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import EmskiEPK from "./components/EmskiEPK";
import EmskiPress from "./components/EmskiPress";
import logoSrc from "./assets/EMSKI-logo-white-rgb.png";

// Generative-art handoff (lives in /emski-wait-for-me-handoff/ as a self-contained
// drop-in). Lazy-loaded so the regl/WebGL bundle doesn't ship with the main EPK page.
const WaitForMe = lazy(() =>
  import("../emski-wait-for-me-handoff/src/components/wait-for-me/WaitForMe.jsx")
);
const WaitForMeV0 = lazy(() =>
  import("../emski-wait-for-me-handoff/src/components/wait-for-me/WaitForMeV0.jsx")
);
const WaitForMeRibbon = lazy(() =>
  import("../emski-wait-for-me-handoff/src/components/wait-for-me/WaitForMeRibbon.jsx")
);
const WaitForMeContours = lazy(() =>
  import("../emski-wait-for-me-handoff/src/components/wait-for-me/WaitForMeContours.jsx")
);
const WaitForMePhase = lazy(() =>
  import("../emski-wait-for-me-handoff/src/components/wait-for-me/WaitForMePhase.jsx")
);

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
          path="/generative_art"
          element={
            <Suspense fallback={null}>
              <WaitForMe />
            </Suspense>
          }
        />
        <Route
          path="/generative_art/ribbon"
          element={
            <Suspense fallback={null}>
              <WaitForMeRibbon />
            </Suspense>
          }
        />
        <Route
          path="/generative_art/contours"
          element={
            <Suspense fallback={null}>
              <WaitForMeContours />
            </Suspense>
          }
        />
        <Route
          path="/generative_art/phase"
          element={
            <Suspense fallback={null}>
              <WaitForMePhase />
            </Suspense>
          }
        />
        <Route
          path="/generative_art/v0"
          element={
            <Suspense fallback={null}>
              <WaitForMeV0 />
            </Suspense>
          }
        />
        <Route path="*" element={<EmskiEPK />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
