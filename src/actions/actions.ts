"use server";

import { revalidateTag, unstable_cache } from "next/cache";
import getYahooFinanceData from "./yahoo";
import { TStockFetchedData } from "@/types/portfolio";
import { getGoogleFinanceData } from "./google";

export const getStockData = unstable_cache(
	async (
		codes: string[]
	): Promise<{ data: TStockFetchedData | null; error: any | null }> => {
		const result: Record<
			string,
			{
				cmp: number | null;
				peRatio: number | null;
				latestEarning: number | null;
			}
		> = {};
		try {
			//  fetch from yahoo and from google, parallelly
			const [googleData, yahooData] = await Promise.all([
				getGoogleFinanceData(codes),
				getYahooFinanceData(codes),
			]);

			for (let key of Object.keys(googleData)) {
				if (!result[key]) {
					result[key] = { cmp: null, latestEarning: null, peRatio: null };
				}
				result[key] = {
					...googleData[key],
					...yahooData[key],
				};
			}

			return { data: result, error: null };
		} catch (error) {
			console.error("fetchStockData error: ", error);
			return { data: null, error };
		}
	},
	[],
	{
		revalidate: 12, // 12 seconds; few seconds before 15sec
		tags: ["stock-data"],
	}
);

export const invalidateStockCache = async () => {
	revalidateTag("stock-data");
};
