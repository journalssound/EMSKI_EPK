import { useEffect, useRef, useCallback } from "react";

/**
 * EMSKI Reactive Video Component
 *
 * Renders the video at FULL native resolution.
 * Dark pixels are transparent (no background rectangle).
 * Mouse/touch displaces nearby pixels (repulsion effect).
 */

const MOUSE_RADIUS = 80;
const PUSH_FORCE = 30;
const BG_THRESHOLD = 35;

export default function VideoParticles({ src, width = 900, height = 900 }) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const frameRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const dimsRef = useRef({ cw: width, ch: height });
  const setupDone = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const dpr = window.devicePixelRatio || 1;
    const ctx = canvas.getContext("2d");

    const off = document.createElement("canvas");
    const octx = off.getContext("2d", { willReadFrequently: true });

    function setup() {
      if (setupDone.current) return;
      setupDone.current = true;

      const vw = video.videoWidth || width;
      const vh = video.videoHeight || height;
      const scale = Math.min(width / vw, height / vh);
      const cw = Math.round(vw * scale);
      const ch = Math.round(vh * scale);
      dimsRef.current = { cw, ch };

      canvas.width = cw * dpr;
      canvas.height = ch * dpr;
      canvas.style.width = cw + "px";
      canvas.style.height = ch + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      off.width = cw;
      off.height = ch;

      tryPlay();
      loop();
    }

    function tryPlay() {
      const p = video.play();
      if (p && p.catch) {
        p.catch(() => {
          // Autoplay blocked — try again on first user interaction
          const resume = () => {
            video.play().catch(() => {});
            document.removeEventListener("touchstart", resume);
            document.removeEventListener("click", resume);
          };
          document.addEventListener("touchstart", resume, { once: true });
          document.addEventListener("click", resume, { once: true });
        });
      }
    }

    function loop() {
      const { cw, ch } = dimsRef.current;

      if (!video.paused && !video.ended && video.readyState >= 2) {
        octx.drawImage(video, 0, 0, cw, ch);
        const imageData = octx.getImageData(0, 0, cw, ch);
        const data = imageData.data;

        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;
        const mouseActive = mx > -1000 && my > -1000;

        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (brightness < BG_THRESHOLD) {
            data[i + 3] = 0;
          }
        }

        if (!mouseActive) {
          ctx.clearRect(0, 0, cw, ch);
          octx.putImageData(imageData, 0, 0);
          ctx.drawImage(off, 0, 0);
        } else {
          octx.putImageData(imageData, 0, 0);
          ctx.clearRect(0, 0, cw, ch);
          ctx.drawImage(off, 0, 0);

          const pad = MOUSE_RADIUS + PUSH_FORCE + 2;
          const rx = Math.max(0, Math.floor(mx - pad));
          const ry = Math.max(0, Math.floor(my - pad));
          const rw = Math.min(cw, Math.ceil(mx + pad)) - rx;
          const rh = Math.min(ch, Math.ceil(my + pad)) - ry;

          if (rw > 0 && rh > 0) {
            ctx.clearRect(rx, ry, rw, rh);
            const regionData = octx.getImageData(rx, ry, rw, rh);
            const rd = regionData.data;

            for (let y = 0; y < rh; y++) {
              for (let x = 0; x < rw; x++) {
                const idx = (y * rw + x) * 4;
                if (rd[idx + 3] === 0) continue;

                const px = rx + x;
                const py = ry + y;
                const ddx = px - mx;
                const ddy = py - my;
                const dist = Math.sqrt(ddx * ddx + ddy * ddy);

                if (dist < MOUSE_RADIUS && dist > 0) {
                  const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                  const fx = px + (ddx / dist) * force * PUSH_FORCE;
                  const fy = py + (ddy / dist) * force * PUSH_FORCE;
                  ctx.globalAlpha = rd[idx + 3] / 255;
                  ctx.fillStyle = `rgb(${rd[idx]},${rd[idx + 1]},${rd[idx + 2]})`;
                  ctx.fillRect(Math.round(fx), Math.round(fy), 1, 1);
                } else {
                  ctx.globalAlpha = rd[idx + 3] / 255;
                  ctx.fillStyle = `rgb(${rd[idx]},${rd[idx + 1]},${rd[idx + 2]})`;
                  ctx.fillRect(px, py, 1, 1);
                }
              }
            }
            ctx.globalAlpha = 1;
          }
        }
      }

      frameRef.current = requestAnimationFrame(loop);
    }

    // Listen for multiple events — mobile may only fire some of these
    video.addEventListener("canplaythrough", setup);
    video.addEventListener("loadeddata", setup);
    video.addEventListener("loadedmetadata", () => {
      // On iOS, loadedmetadata fires but canplaythrough may not
      // Wait a tick for videoWidth/Height to be available
      setTimeout(setup, 100);
    });
    if (video.readyState >= 2) setup();

    return () => {
      setupDone.current = false;
      cancelAnimationFrame(frameRef.current);
      video.pause();
    };
  }, [src, width, height]);

  const getCanvasCoords = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (!rect || !canvas) return null;
    const dpr = window.devicePixelRatio || 1;
    return {
      x: (clientX - rect.left) * (canvas.width / dpr / rect.width),
      y: (clientY - rect.top) * (canvas.height / dpr / rect.height),
    };
  }, []);

  const handleMouse = useCallback((e) => {
    const coords = getCanvasCoords(e.clientX, e.clientY);
    if (coords) mouseRef.current = coords;
  }, [getCanvasCoords]);

  const handleTouch = useCallback((e) => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      const coords = getCanvasCoords(t.clientX, t.clientY);
      if (coords) mouseRef.current = coords;
    }
  }, [getCanvasCoords]);

  const resetMouse = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        style={{ display: "none" }}
      />
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouse}
        onMouseLeave={resetMouse}
        onTouchMove={handleTouch}
        onTouchEnd={resetMouse}
        style={{
          cursor: "crosshair",
          maxWidth: "100%",
        }}
      />
    </div>
  );
}
