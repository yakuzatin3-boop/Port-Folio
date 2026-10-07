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
await sleep(500);
await page.evaluate(() => document.querySelector("#contact").scrollIntoView({ block: "start" }));
await sleep(1500);

const report = await page.evaluate(() => {
  const section = document.querySelector("#contact");
  const sRect = section.getBoundingClientRect();
  const scene = section.querySelector("canvas");
  const cRect = scene.getBoundingClientRect();

  // hole must be fully inside the section (section has overflow-hidden)
  const inside =
    cRect.top >= sRect.top - 1 &&
    cRect.bottom <= sRect.bottom + 1 &&
    cRect.left >= sRect.left - 1 &&
    cRect.right <= sRect.right + 1;

  // sample the canvas: disk colors + event-horizon darkness
  const ctx = scene.getContext("2d");
  const dpr = scene.width / cRect.width;
  const cx = scene.width / 2;
  const cy = scene.height / 2;
  const minDim = Math.min(scene.width, scene.height);
  const r = minDim * 0.3; // disk outer radius in device px
  let hot = 0, violet = 0, coreDark = 0, lit = 0, n = 0;
  for (let a = 0; a < Math.PI * 2; a += 0.05) {
    for (let rr = r * 0.45; rr <= r * 1.05; rr += 3) {
      const x = Math.round(cx + Math.cos(a) * rr);
      const y = Math.round(cy + Math.sin(a) * rr);
      if (x < 0 || y < 0 || x >= scene.width || y >= scene.height) continue;
      const [R, G, B] = ctx.getImageData(x, y, 1, 1).data;
      n++;
      if (R > 90 && G > 40 && R > B) hot++;
      if (B > 60 && B > G && R > G) violet++;
      if (R + G + B > 60) lit++;
    }
  }
  const coreSample = ctx.getImageData(cx, cy, 1, 1).data;
  coreDark = coreSample[0] + coreSample[1] + coreSample[2];

  const glow = section.querySelector(".group > div[aria-hidden='true']");
  const glowStyle = glow ? getComputedStyle(glow) : null;

  return {
    inside,
    sectionBox: [Math.round(sRect.width), Math.round(sRect.height)],
    sceneBox: [Math.round(cRect.width), Math.round(cRect.height)],
    diskSamples: n,
    hotPct: +((hot / n) * 100).toFixed(1),
    violetPct: +((violet / n) * 100).toFixed(1),
    litPct: +((lit / n) * 100).toFixed(1),
    coreRGBsum: coreDark,
    glowOpacityIdle: glowStyle?.opacity,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
});

await page.click("#name");
await sleep(700);
const focused = await page.evaluate(() => {
  const glow = document.querySelector("#contact .group > div[aria-hidden='true']");
  return { glowOpacityFocused: glow ? getComputedStyle(glow).opacity : null };
});

console.log(JSON.stringify({ ...report, ...focused, errors }, null, 2));;
await browser.close();
