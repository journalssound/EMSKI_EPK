/* Pieces shared by the Stardust proposal pages (v1 and v2). */

/* Same header as the kit: sans title, mono number. */
export function H({ n, children }) {
  return (
    <h2 className="bo-h">
      <span className="bo-h__n bo-mono">{n}</span>
      <span className="bo-h__t">{children}</span>
    </h2>
  );
}

export function Tiles({ items }) {
  return (
    <div className="sp-tiles">
      {items.map((t) => (
        <div className="sp-tile" key={t.l}>
          <span className="sp-tile__n">{t.n}</span>
          <span className="sp-tile__l bo-mono">{t.l}</span>
          {t.s ? <span className="sp-tile__s bo-mono">{t.s}</span> : null}
        </div>
      ))}
    </div>
  );
}

/* Split bar: EMSKI's share in off-white, Stardust's in rust. */
export function Split({ label, emski }) {
  const stardust = 1 - emski;
  return (
    <>
      <span className="sp-split__label bo-mono">{label}</span>
      <div className="sp-split__bar">
        {emski > 0 && (
          <span className="sp-split__seg sp-split__seg--emski" style={{ flex: emski }}>
            EMSKI {Math.round(emski * 100)}
          </span>
        )}
        {stardust > 0 && (
          <span className="sp-split__seg sp-split__seg--stardust" style={{ flex: stardust }}>
            STARDUST {Math.round(stardust * 100)}
          </span>
        )}
      </div>
    </>
  );
}
