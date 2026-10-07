import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const URL = "http://localhost:5199/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

async function shoot(viewport, name) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto(URL, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => !document.querySelector(".blackhole-loader"), {
    timeout: 15000,
  });
  await sleep(600);
  await page.evaluate(() => document.querySelector("#contact").scrollIntoView({ block: "start" }));
  await sleep(1200);
  await page.screenshot({ path: `scripts/shots/${name}.png` });
  await page.close();
}

await shoot({ width: 1440, height: 900 }, "contact-full-desktop");
await shoot({ width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 }, "contact-full-mobile");
await browser.close();
console.log("shots ok");
