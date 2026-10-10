/* Money formatting shared by the Stardust proposal pages. */
export const usd = (n) => "$" + Math.round(n).toLocaleString("en-US");
export const k = (n) =>
  n >= 1000 ? "$" + (n / 1000).toFixed(1).replace(/\.0$/, "") + "K" : usd(n);
