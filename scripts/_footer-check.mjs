import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = "http://localhost:5199/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
await page.setViewport({ width: 1440, height: 900 });
await page.goto(URL, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => !document.querySelector(".blackhole-loader"), { timeout: 15000 });
await page.evaluate(() => document.querySelector("footer").scrollIntoView({ block: "center" }));
await sleep(1500);

const dom = await page.evaluate(() => {
  const footer = document.querySelector("footer");
  const wrap = document.querySelector(".footer-watermark");
  const canvas = footer.querySelector("canvas");
  const text = wrap.querySelector("svg text");
  const f = footer.getBoundingClientRect();
  const c = canvas.getBoundingClientRect();
  const w = wrap.getBoundingClientRect();
  const ctx = canvas.getContext("2d");
  const dpr = canvas.width / c.width;

  // the hole's core should sit at the watermark's center
  const anchorX = (w.left + w.width / 2 - c.left) * dpr;
  const anchorY = (w.top + w.height / 2 - c.top) * dpr;
  const at = (x, y) => {
    const d = ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data;
    return d[0] + d[1] + d[2];
  };
  const core = at(anchorX, anchorY); // event horizon: pure black
  const ring = at(anchorX + 160 * dpr, anchorY); // disk band: lit
  const ring2 = at(anchorX - 160 * dpr, anchorY);

  return {
    footer: [Math.round(f.left), Math.round(f.top), Math.round(f.width), Math.round(f.height)],
    canvas: [Math.round(c.left), Math.round(c.top), Math.round(c.width), Math.round(c.height)],
    wrap: [Math.round(w.left), Math.round(w.top), Math.round(w.width), Math.round(w.height)],
    coversFooter:
      Math.abs(c.left - f.left) < 2 &&
      Math.abs(c.top - f.top) < 2 &&
      Math.abs(c.bottom - f.bottom) < 2,
    coreAtName: core < 25,
    diskBesideName: ring > 60 || ring2 > 60,
    fill: text.getAttribute("fill"),
    stroke: text.getAttribute("stroke"),
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
});

const shot = await page.screenshot({ encoding: "base64" });
const pixels = await page.evaluate(async (b64) => {
  const img = new Image();
  img.src = "data:image/png;base64," + b64;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const px = (x, y) => {
    const d = ctx.getImageData(x, y, 1, 1).data;
    return [d[0], d[1], d[2]];
  };
  const whiteish = ([r, g, b]) => r + g + b > 380 && Math.max(r, g, b) - Math.min(r, g, b) < 40;

  const wrap = document.querySelector(".footer-watermark").getBoundingClientRect();
  const footer = document.querySelector("footer").getBoundingClientRect();
  const wrapL = Math.round(wrap.left);
  const wrapR = Math.round(wrap.right);
  const midY = Math.round(wrap.top + wrap.height / 2);

  // 1. name visible: white stroke pixels crossing the middle of the letters
  let strokeHits = 0;
  for (let x = wrapL; x <= wrapR; x++) if (whiteish(px(x, midY))) strokeHits++;

  // 2. background full: scene visible in the empty gap between the link
  //    columns and the watermark (no text there)
  let sceneLit = 0;
  const gapTop = Math.round(wrap.top) - 70;
  const gapBot = Math.round(wrap.top) - 12;
  for (let y = gapTop; y < gapBot; y += 2)
    for (let x = Math.round(footer.left) + 30; x < Math.round(footer.right) - 30; x += 3)
      if (px(x, y).reduce((a, b) => a + b, 0) > 45) sceneLit++;

  // 3. scene visible in the side margin beside the watermark
  let sideLit = 0;
  for (let y = Math.round(wrap.top); y < Math.round(wrap.bottom); y += 2)
    for (let x = Math.round(footer.left) + 8; x < wrapL - 4; x += 2)
      if (px(x, y).reduce((a, b) => a + b, 0) > 45) sideLit++;

  return { strokeHits, sceneLit, sideLit };
}, shot);

await page.screenshot({ path: "scripts/shots/footer-full-scene.png" });
console.log(JSON.stringify({ ...dom, ...pixels, errors }, null, 2));
await browser.close();
