"use server";
import { TYahooData } from "@/types/portfolio";
import yahooFinance from "yahoo-finance2";

const getYahooFinanceData = async (
	codes: string[]
): Promise<Record<string, TYahooData>> => {
	yahooFinance.suppressNotices(["yahooSurvey"]);
	try {
		const result: Record<string, TYahooData> = {};
		codes = codes.map((code) => code + ".NS");
		const quotes = await yahooFinance.quote(codes);

		// regularMarketPrice is the one we need as CMP
		quotes.forEach(({ symbol, regularMarketPrice }) => {
			const code = symbol.split(".")[0]; // have to remove the ".NS" suffix
			if (!result[code]) {
				result[code] = { cmp: null };
			}
			result[code].cmp = regularMarketPrice || null;
		});

		return result;
	} catch (error) {
		throw error;
	}
};

// your existing logic
export default getYahooFinanceData;
