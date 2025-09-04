"use server";
import { TGoogleData } from "@/types/portfolio";
import axios from "axios";
import * as cheerio from "cheerio";

export const getGoogleFinanceData = async (codes: string[]) => {
	const urls = codes.map((code) => ({
		url: `https://www.google.com/finance/quote/${code}:NSE`,
		code,
	}));

	const result: Record<string, TGoogleData> = {};

	try {
		const results = await Promise.allSettled<{
			pageData: TGoogleData;
			code: string;
		}>(
			urls.map(async ({ url, code }) => {
				const pageData = await scrapGoogleFinancePage(url);
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
				console.error(settledResult.status, "-", settledResult.reason);
			}
		});

		return result;
	} catch (error) {
		throw error;
	}
};

const scrapGoogleFinancePage = async (url: string) => {
	try {
		const res = await axios.get(url);
		const content = res.data;
		const $ = cheerio.load(content);

		const peRatioPath =
			"[aria-labelledby=key-stats-heading]>div:nth-child(7)>div";
		const peRatio = $(peRatioPath).text();
		const epsValueTablePath = "table.slpEwd";
		const epsTable = $(epsValueTablePath).first();
		const cell = epsTable.find("tr:nth-child(6) > td:nth-child(2)");
		const eps = cell.text();
		return { peRatio: Number(peRatio), latestEarning: Number(eps) }; // ✅ Return the data
	} catch (error) {
		console.error("Error scraping:", error);
		return { peRatio: null, latestEarning: null }; // ✅ Return null values on error
	}
};
