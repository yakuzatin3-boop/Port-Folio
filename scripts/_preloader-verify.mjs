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
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("requestfailed", (r) => failed.push(r.url()));
}

const snap = (page, name) => page.screenshot({ path: `${OUT}/${name}.png` });

async function gone(page) {
  await page.waitForFunction(() => !document.querySelector(".preloader"), { timeout: 8000 });
}

const EXIT_STARTED = () => {
  if (!document.querySelector(".preloader")) return true;
  const p = document.querySelector(".preloader-photo > div");
  return p && parseFloat(getComputedStyle(p).opacity) < 0.95;
};

const browser = await puppeteer.launch({ executablePath: CHROME, headless: "new", args: ["--no-sandbox", "--disable-dev-shm-usage"] });

// ---------- 1. desktop mid-load + exit ----------
{
  const page = await browser.newPage();
  watch(page);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".preloader");
  await sleep(650);
  const mid = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const rect = (s) => q(s).getBoundingClientRect();
    const round = (n) => Math.round(n * 100) / 100;
    const photo = rect(".preloader-photo");
    const count = rect(".preloader-count");
    const img = q(".preloader-photo img");
    const fills = [...document.querySelectorAll(".preloader .bg-accent")];
    const bar = fills.find((el) => el.style.width);
    const cs = getComputedStyle(q(".preloader"));
    return {
      header: [...document.querySelectorAll(".preloader .mono-label span")].map((s) => s.textContent.trim()),
      roleOk: document.body.innerText.includes("IT Instructor & Full-Stack Web Developer"),
      photoCenter: [round(photo.x + photo.width / 2 - innerWidth / 2), round(photo.y + photo.height / 2 - innerHeight / 2)],
      photoSize: [photo.width, photo.height],
      filter: img.style.filter,
      imgOk: img.complete && img.naturalWidth > 0,
      floatAnim: [getComputedStyle(q(".preloader-float")).animationName, getComputedStyle(q(".preloader-float")).animationDuration],
      blobs: [...document.querySelectorAll(".preloader-blob")].map((b) => [getComputedStyle(b).animationDuration, getComputedStyle(b).filter]),
      grainOpacity: getComputedStyle(q(".preloader-grain")).opacity,
      rootBg: cs.backgroundColor,
      fgColor: getComputedStyle(q(".preloader .text-fg")).color,
      counterBox: [round(count.x), round(count.y), round(count.width), round(count.height)],
      counterVsPhotoGap: round(count.x - (photo.x + photo.width)),
      counterCenterY: round(count.y + count.height / 2 - innerHeight / 2),
      counterFont: getComputedStyle(q(".preloader-count")).fontSize,
      countText: q(".preloader-count").textContent,
      barWidth: bar.style.width,
      barShadow: getComputedStyle(bar).boxShadow,
      overflowX: document.documentElement.scrollWidth - innerWidth,
      mainUnder: !!q("#top"),
    };
  });

  await page.mouse.move(1350, 90);
  await sleep(650);
  mid.parallax = await page.evaluate(() => {
    const el = document.querySelector(".preloader-parallax");
    if (!el) return { gone: true };
    return [el.style.getPropertyValue("--px"), el.style.getPropertyValue("--py"), getComputedStyle(el).transform];
  });
  await snap(page, "preloader-desktop-mid");
  console.log("MID", JSON.stringify(mid, null, 1));
  await page.close();
}

// ---------- 1b. desktop exit (fresh load) ----------
{
  const page = await browser.newPage();
  watch(page);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".preloader");
  await page.waitForFunction(EXIT_STARTED, { timeout: 8000 });
  const exitStart = await page.evaluate(() => {
    const root = document.querySelector(".preloader");
    if (!root) return { rootGone: true };
    const photo = document.querySelector(".preloader-photo > div");
    return {
      photoOpacity: getComputedStyle(photo).opacity,
      mainUnder: !!document.querySelector("#top"),
      scrollLocked: document.body.classList.contains("no-scroll"),
    };
  });
  await sleep(430);
  const exitMid = await page.evaluate(() => {
    const root = document.querySelector(".preloader");
    if (!root) return { rootGone: true };
    const photo = document.querySelector(".preloader-photo > div");
    const t = getComputedStyle(root).transform;
    const m = t.match(/matrix\(([^)]+)\)/);
    const ty = m ? parseFloat(m[1].split(",")[5]) : 0;
    return {
      transform: t,
      translateYpx: Math.round(ty),
      translateYpct: Math.round((ty / innerHeight) * 100),
      photoOpacity: getComputedStyle(photo).opacity,
      photoTransform: getComputedStyle(photo).transform,
      scrollLocked: document.body.classList.contains("no-scroll"),
      mainUnder: !!document.querySelector("#top"),
    };
  });
  await snap(page, "preloader-desktop-exit");
  await gone(page);
  await sleep(400);
  const post = await page.evaluate(() => ({
    main: !!document.querySelector("#top"),
    sections: document.querySelectorAll("main section").length,
    scrollUnlocked: !document.body.classList.contains("no-scroll"),
    overflowX: document.documentElement.scrollWidth - innerWidth,
  }));
  await snap(page, "preloader-desktop-post");
  console.log("EXIT_START", JSON.stringify(exitStart));
  console.log("EXIT_MID", JSON.stringify(exitMid));
  console.log("POST", JSON.stringify(post));
  await page.close();
}

// ---------- 2. mobile ----------
{
  const page = await browser.newPage();
  watch(page);
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".preloader");
  await sleep(650);
  const m = await page.evaluate(() => {
    const rect = (s) => document.querySelector(s).getBoundingClientRect();
    const photo = rect(".preloader-photo");
    const count = rect(".preloader-count");
    return {
      photoSize: [photo.width, photo.height],
      photoCenter: [Math.round(photo.x + photo.width / 2 - innerWidth / 2), Math.round(photo.y + photo.height / 2 - innerHeight / 2)],
      counterGapBelowPhoto: Math.round(count.y - (photo.y + photo.height)),
      counterCenterX: Math.round(count.x + count.width / 2 - innerWidth / 2),
      counterFont: getComputedStyle(document.querySelector(".preloader-count")).fontSize,
      overflowX: document.documentElement.scrollWidth - innerWidth,
      countText: document.querySelector(".preloader-count").textContent,
      barWidth: [...document.querySelectorAll(".preloader .bg-accent")].find((el) => el.style.width).style.width,
    };
  });
  await snap(page, "preloader-mobile-mid");
  console.log("MOBILE", JSON.stringify(m));
  await page.close();
}

// ---------- 3. reduced motion ----------
{
  const page = await browser.newPage();
  watch(page);
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".preloader");
  await page.waitForFunction(EXIT_STARTED, { timeout: 5000 });
  const rm = await page.evaluate(() => {
    const root = document.querySelector(".preloader");
    if (!root) return { rootGone: true };
    const photo = document.querySelector(".preloader-photo > div");
    const t = getComputedStyle(root).transform;
    const m = t.match(/matrix\(([^)]+)\)/);
    const ty = m ? parseFloat(m[1].split(",")[5]) : 0;
    return {
      transform: t,
      translateYpx: Math.round(ty),
      opacity: getComputedStyle(root).opacity,
      photoOpacity: getComputedStyle(photo).opacity,
      photoTransform: getComputedStyle(photo).transform,
      floatAnim: getComputedStyle(document.querySelector(".preloader-float")).animationDuration,
      countText: document.querySelector(".preloader-count")?.textContent,
    };
  });
  await snap(page, "preloader-reduced-exit");
  await gone(page);
  await sleep(300);
  rm.postMain = await page.evaluate(() => !!document.querySelector("#top"));
  console.log("REDUCED", JSON.stringify(rm));
  await page.close();
}

await browser.close();
console.log("errors:", JSON.stringify(errors));
console.log("failed:", JSON.stringify(failed));
