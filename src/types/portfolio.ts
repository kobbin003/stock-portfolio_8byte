export type TStock = {
	name: string;
	purchasePrice: number;
	quantity: number;
	code: string;
	sector: string;
};

export type TStockDisplay = TStock & {
	investment: number;
	cmp: number;
	presentValue: number;
	net: number;
	weightage: number;
	peRatio: number;
	latestEarnings: number;
};
