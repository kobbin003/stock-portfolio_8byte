export type TStock = {
	name: string;
	purchasePrice: number;
	quantity: number;
	code: string;
	sector: string;
};

export type TStockDisplay = TStock & {
	investment: number;
	cmp: number | null;
	presentValue: number | null;
	net: number | null;
	weightage: number;
	peRatio: number | null;
	latestEarnings: number | null;
};

export type TYahooData = { cmp: number | null };

export type TGoogleData = {
	peRatio: number | null;
	latestEarning: number | null;
};

export type TStockFetchedData = Record<string, TYahooData & TGoogleData>;
