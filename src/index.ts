import { promises as fs, constants as fsConstants } from "fs";
import { CronJob } from "cron";
import puppeteer from "puppeteer";
import { format } from "date-fns";
import pino from "pino";

const EVERY_30_MINUTES = "*/30 * * * *";
const CAPACITY_URL = "https://maisqueauga.com/es/aforo-2/";

const logger = pino({
  prettyPrint: {
    translateTime: true,
  },
});

const takeCapacityScreenshot = async () => {
  logger.info("Taking capacity screenshot...");

  const screenshotsDir = `screenshots/${format(new Date(), "d-M-y")}`;

  try {
    await fs.mkdir(screenshotsDir);
  } catch {}

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(CAPACITY_URL);

  await page.screenshot({
    path: `${screenshotsDir}/${format(new Date(), "H:mm:ss")}.png`,
    fullPage: true,
  });

  await browser.close();
};

// Take a initial screenshot.
takeCapacityScreenshot();

// Take a screenshot every 30th minute.
const job = new CronJob(EVERY_30_MINUTES, takeCapacityScreenshot, null, true);
