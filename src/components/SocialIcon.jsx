/* ─── Social icons (inline SVG, 1em sizing) ───────────────────────────────
 * Shared by the website draft and the [BLACKOUT] kit. Paths are drawn on a
 * 24×24 grid in currentColor, so each page colours them with its own text
 * colour. */
const ICON_PATHS = {
  instagram: (
    <>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.3" cy="6.7" r="1.25" fill="currentColor" />
    </>
  ),
  tiktok: (
    <path
      fill="currentColor"
      d="M16.6 3c.36 1.98 1.61 3.32 3.66 3.45v2.58c-1.36.05-2.55-.35-3.66-1.12v5.87c0 3.62-2.4 5.72-5.42 5.72-2.84 0-5.18-2.13-5.18-5.03 0-2.98 2.42-5.06 5.5-4.9v2.63c-.3-.06-.6-.09-.9-.07-1.32.08-2.24 1.03-2.24 2.34 0 1.35 1.07 2.4 2.5 2.4 1.6 0 2.66-1.12 2.66-3.03V3h3.08Z"
    />
  ),
  youtube: (
    <>
      <rect x="2" y="5.5" width="20" height="13" rx="3.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path fill="currentColor" d="M10.2 9.2v5.6l5-2.8-5-2.8Z" />
    </>
  ),
  spotify: (
    <>
      <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M7.6 9.7c3-.85 6.1-.6 8.8.85M8 12.4c2.5-.7 5-.45 7.2.75M8.4 15c2-.55 3.9-.35 5.7.6"
      />
    </>
  ),
  apple: (
    <path
      fill="currentColor"
      d="M16.7 12.6c-.02-2 1.63-2.96 1.7-3-.92-1.35-2.36-1.54-2.87-1.56-1.22-.12-2.38.72-3 .72-.62 0-1.58-.7-2.6-.68-1.33.02-2.56.78-3.25 1.97-1.39 2.4-.36 5.96 1 7.9.66.95 1.45 2.02 2.48 1.98 1-.04 1.37-.64 2.58-.64 1.2 0 1.54.64 2.6.62 1.07-.02 1.75-.97 2.4-1.93.76-1.1 1.07-2.17 1.09-2.23-.03-.01-2.1-.8-2.13-3.15ZM14.7 6.7c.55-.66.92-1.58.82-2.5-.79.03-1.75.53-2.32 1.19-.5.58-.95 1.52-.83 2.42.88.07 1.78-.45 2.33-1.11Z"
    />
  ),
  soundcloud: (
    <path
      fill="currentColor"
      d="M18.1 10.2c-.3 0-.58.05-.85.14A5.06 5.06 0 0 0 12.3 6c-.58 0-1.15.1-1.66.29-.2.07-.25.15-.25.3v9.06c0 .16.12.3.28.31h7.43c1.7 0 3.07-1.34 3.07-3.02a3.05 3.05 0 0 0-3.07-2.74ZM8.9 7.5c-.22 0-.4.18-.4.4v7.66c0 .22.18.4.4.4s.4-.18.4-.4V7.9c0-.22-.18-.4-.4-.4ZM6.6 8.8c-.22 0-.4.18-.4.4v6.36c0 .22.18.4.4.4s.4-.18.4-.4V9.2c0-.22-.18-.4-.4-.4ZM4.3 10.3c-.22 0-.4.18-.4.4v4.86c0 .22.18.4.4.4s.4-.18.4-.4V10.7c0-.22-.18-.4-.4-.4ZM2 11.4c-.22 0-.4.18-.4.4v3.16c0 .22.18.4.4.4s.4-.18.4-.4V11.8c0-.22-.18-.4-.4-.4Z"
    />
  ),
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
};

export default function SocialIcon({ icon }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {ICON_PATHS[icon] || null}
    </svg>
  );
}
