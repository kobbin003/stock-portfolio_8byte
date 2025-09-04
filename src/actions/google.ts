"use server";
import { TGoogleData } from "@/types/portfolio";
import { Browser } from "puppeteer";

export const getGoogleFinanceData = async (codes: string[]) => {
	const urls = codes.map((code) => ({
		url: `https://www.google.com/finance/quote/${code}:NSE`,
		code,
	}));

	const result: Record<string, TGoogleData> = {};

	try {
		// Launch the browser and open a new blank page
		const browser = await getBrowser();
		// const browser = await puppeteer.launch();

		const results = await Promise.allSettled<{
			pageData: TGoogleData;
			code: string;
		}>(
			urls.map(async ({ url, code }) => {
				const pageData = await scrapGoogleFinancePage(url, browser);
				return { pageData, code };
			})
		);

		results.map((settledResult) => {
			if (settledResult.status === "fulfilled") {
				const { code, pageData } = settledResult.value;
				if (!result[code]) {
					result[code] = { latestEarning: null, peRatio: null };
				}
				result[code] = {
					latestEarning: pageData.latestEarning || null,
					peRatio: pageData.peRatio!,
				};
			} else {
				console.log(settledResult.status, "-", settledResult.reason);
			}
		});

		// close the browser
		await browser.close();

		return result;
	} catch (error) {
		throw error;
	}
};

const getBrowser = async () => {
	let browser;
	try {
		const isVercel = !!process.env.VERCEL_ENV;

		let puppeteer: any,
			launchOptions: any = {
				headless: true,
			};

		if (isVercel) {
			const chromium = (await import("@sparticuz/chromium")).default;
			puppeteer = await import("puppeteer-core");
			launchOptions = {
				...launchOptions,
				args: chromium.args,
				executablePath: await chromium.executablePath(),
			};
		} else {
			puppeteer = await import("puppeteer");
		}

		browser = await puppeteer.launch(launchOptions);
		return browser;
	} catch (error) {
		throw error;
	}
};

const scrapGoogleFinancePage = async (url: string, browser: Browser) => {
	const page = await browser.newPage();
	try {
		// Navigate the page to a URL
		await page.goto(url, { waitUntil: "load" });

		// Set screen size
		await page.setViewport({ width: 1080, height: 2500 });
		// Enable request interception
		await page.setRequestInterception(true);

		// Intercept requests and block certain resource types
		page.on("request", (req) => {
			if (
				req.resourceType() === "stylesheet" ||
				req.resourceType() === "font" ||
				req.resourceType() === "image" ||
				req.resourceType() === "media" ||
				req.resourceType() === "script" ||
				req.resourceType() === "other"
			) {
				req.abort();
			} else {
				req.continue();
			}
		});

		// Direct DOM manipulation with Puppeteer
		const peRatioPath =
			"[aria-labelledby=key-stats-heading]>div:nth-child(7)>div";

		await page.waitForSelector(peRatioPath, { visible: true });

		const peRatioElement = await page.$(peRatioPath);

		let peRatio = null;
		if (peRatioElement) {
			peRatio = await page.evaluate((el) => el.textContent, peRatioElement);
		}
		// console.log("peRatio: ", peRatio);

		const epsValuePath =
			"table.slpEwd:nth-of-type(1) > tr:nth-child(6) > td:nth-child(2)";

		await page.waitForSelector(epsValuePath, { visible: true });

		const epsElement = await page.$(epsValuePath);

		let eps = null;
		if (epsElement) {
			eps = await page.evaluate((el) => el.textContent, epsElement);
		}
		// console.log("eps", eps);

		return { peRatio: Number(peRatio), latestEarning: Number(eps) }; // ✅ Return the data
	} catch (error) {
		console.error("Error scraping:", error);
		return { peRatio: null, latestEarning: null }; // ✅ Return null values on error
	} finally {
		await page.close(); // ✅ Add await
	}
};
