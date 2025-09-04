"use server";
import { TGoogleData } from "@/types/portfolio";
import puppeteer, { Browser } from "puppeteer";

export const getGoogleFinanceData = async (codes: string[]) => {
	const urls = codes.map((code) => ({
		url: `https://www.google.com/finance/quote/${code}:NSE`,
		code,
	}));

	const result: Record<string, TGoogleData> = {};

	try {
		// Launch the browser and open a new blank page
		const browser = await puppeteer.launch();

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

const scrapGoogleFinancePage = async (url: string, browser: Browser) => {
	const page = await browser.newPage();
	try {
		// Navigate the page to a URL
		await page.goto(url);

		// Set screen size
		await page.setViewport({ width: 1080, height: 2500 });

		// Direct DOM manipulation with Puppeteer
		const peRatioPath =
			"[aria-labelledby=key-stats-heading]>div:nth-child(7)>div";

		await page.waitForSelector(peRatioPath);

		const peRatioElement = await page.$(peRatioPath);

		let peRatio = null;
		if (peRatioElement) {
			peRatio = await page.evaluate((el) => el.textContent, peRatioElement);
		}
		// console.log("peRatio: ", peRatio);

		const epsValuePath =
			"table.slpEwd:nth-of-type(1) > tr:nth-child(6) > td:nth-child(2)";

		await page.waitForSelector(epsValuePath);

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
