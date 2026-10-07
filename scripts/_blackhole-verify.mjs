import puppeteer from "puppeteer-core";
import fs from "node:fs";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = "http://localhost:5199/";
const OUT = "scripts/shots";
fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = [];
const failed = [];

function watch(page) {
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("requestfailed", (r) => failed.push(r.url()));
}

const snap = (page, name) => page.screenshot({ path: `${OUT}/${name}.png` });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

// ---------- 1. desktop: mid-load, catch, complete ----------
{
  const page = await browser.newPage();
  watch(page);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".blackhole-loader");
  await sleep(900);

  const mid = await page.evaluate(() => {
    const root = document.querySelector(".blackhole-loader");
    const canvas = root.querySelector("canvas");
    const img = root.querySelector("img");
    const ctx = canvas.getContext("2d");
    // Sample a horizontal strip through the core: the disk must be lit.
    const sw = Math.round(canvas.width / 2);
    const sh = Math.round(canvas.height / 2);
    const strip = ctx.getImageData(sw - 150, sh - 20, 300, 40).data;
    let lit = 0;
    for (let i = 0; i < strip.length; i += 4) {
      if (strip[i] + strip[i + 1] + strip[i + 2] > 60) lit++;
    }
    const counter = [...root.querySelectorAll("span")].find((s) => /%$/.test(s.textContent.trim()));
    const drift = [...root.querySelectorAll("div")].find((d) => d.style.transform);
    return {
      bg: getComputedStyle(root).backgroundColor,
      canvasSize: [canvas.width, canvas.height],
      litPixels: lit,
      imgOk: img.complete && img.naturalWidth > 0,
      imgSrc: img.getAttribute("src"),
      count1: counter ? counter.textContent : null,
      driftTransform: drift ? drift.style.transform.slice(0, 60) : null,
      barWidth: root.querySelector('[style*="width"]')?.style.width ?? null,
      scrollLocked: document.body.classList.contains("no-scroll"),
      mainUnder: !!document.querySelector("#top"),
    };
  });
  await sleep(500);
  mid.count2 = await page.evaluate(() => {
    const root = document.querySelector(".blackhole-loader");
    const counter = [...root.querySelectorAll("span")].find((s) => /%$/.test(s.textContent.trim()));
    return counter ? counter.textContent : null;
  });
  await snap(page, "blackhole-desktop-mid");
  console.log("MID", JSON.stringify(mid, null, 1));

  await page.waitForFunction(
    () => document.querySelector(".blackhole-loader .animate-bh-spiral-in"),
    { timeout: 9000 }
  );
  const catchInfo = await page.evaluate(() => {
    const el = document.querySelector(".blackhole-loader .animate-bh-spiral-in");
    const cs = getComputedStyle(el);
    return {
      animationName: cs.animationName,
      animationDuration: cs.animationDuration,
      sx: el.style.getPropertyValue("--bh-sx"),
      phi: el.style.getPropertyValue("--bh-phi"),
      counterHidden: getComputedStyle(
        document.querySelector(".blackhole-loader").querySelectorAll("div")[3]
      ).opacity,
    };
  });
  await sleep(700);
  await snap(page, "blackhole-desktop-catch");
  console.log("CATCH", JSON.stringify(catchInfo));

  await page.waitForFunction(() => !document.querySelector(".blackhole-loader"), {
    timeout: 9000,
  });
  await sleep(300);
  const post = await page.evaluate(() => ({
    main: !!document.querySelector("#top"),
    sections: document.querySelectorAll("main section").length,
    scrollUnlocked: !document.body.classList.contains("no-scroll"),
    overflowX: document.documentElement.scrollWidth - innerWidth,
  }));
  await snap(page, "blackhole-desktop-post");
  console.log("POST", JSON.stringify(post));
  await page.close();
}

// ---------- 2. mobile ----------
{
  const page = await browser.newPage();
  watch(page);
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".blackhole-loader");
  await sleep(900);
  const m = await page.evaluate(() => {
    const root = document.querySelector(".blackhole-loader");
    const img = root.querySelector("img").getBoundingClientRect();
    return {
      imgBox: [Math.round(img.x), Math.round(img.y), Math.round(img.width), Math.round(img.height)],
      count: [...root.querySelectorAll("span")].find((s) => /%$/.test(s.textContent.trim()))?.textContent,
      overflowX: document.documentElement.scrollWidth - innerWidth,
    };
  });
  await snap(page, "blackhole-mobile-mid");
  console.log("MOBILE", JSON.stringify(m));
  await page.waitForFunction(() => !document.querySelector(".blackhole-loader"), {
    timeout: 10000,
  });
  console.log("MOBILE_DONE", await page.evaluate(() => !!document.querySelector("#top")));
  await page.close();
}

// ---------- 3. reduced motion ----------
{
  const page = await browser.newPage();
  watch(page);
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".blackhole-loader");
  await page.waitForFunction(() => !document.querySelector(".blackhole-loader"), {
    timeout: 10000,
  });
  const rm = await page.evaluate(() => ({
    main: !!document.querySelector("#top"),
    scrollUnlocked: !document.body.classList.contains("no-scroll"),
  }));
  console.log("REDUCED", JSON.stringify(rm));
  await page.close();
}

await browser.close();
console.log("errors:", JSON.stringify(errors));
console.log("failed:", JSON.stringify(failed));
