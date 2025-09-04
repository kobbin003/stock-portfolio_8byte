"use client";
import { getStockData } from "@/actions/actions";
import { TStockDisplay } from "@/types/portfolio";
import { useEffect, useState } from "react";
import PortfolioSection from "./PortfolioSection";
import portfolio from "@/data/portfolio.json";

export const portfolioCodeList = portfolio.map(({ code }) => code);

const totalInvestment = portfolio.reduce((acc, data) => {
	const investment = data.purchasePrice * data.quantity;
	return acc + investment;
}, 0);

const initialStockDisplayData: TStockDisplay[] = portfolio.map((item) => {
	const investment = item.purchasePrice * item.quantity;
	const weightage = (investment / totalInvestment) * 100;
	return {
		...item,
		investment: Number(investment.toFixed(2)),
		cmp: null,
		presentValue: null,
		net: null,
		weightage: Number(weightage.toFixed(2)),
		peRatio: null,
		latestEarnings: null,
	};
});
const Portfolio = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [stockDisplayData, setstockDisplayData] = useState<TStockDisplay[]>(
		initialStockDisplayData
	);

	// group the data based on sector
	const groupedData: Record<string, TStockDisplay[]> = stockDisplayData.reduce(
		(acc, value) => {
			const { sector } = value;
			if (!acc[sector]) {
				acc[sector] = [];
			}
			acc[sector].push(value);
			return acc;
		},
		{} as Record<string, TStockDisplay[]>
	);

	useEffect(() => {
		// first fetch call:
		setIsLoading(true);
		getLiveData()
			.catch((err) => {
				// TODO: handle error
			})
			.finally(() => {
				setIsLoading(false);
			});

		// fetch every 25 sec interval
		let timer = setInterval(() => {
			// dont want to update loading indicator when not "initial-fetch"
			// setIsLoading(true);
			getLiveData()
				.catch((err) => {
					// TODO: handle error
				})
				.finally(() => {
					// setIsLoading(false);
				});
		}, 25000);

		async function getLiveData() {
			const { data, error } = await getStockData(portfolioCodeList);
			if (error) {
				throw error;
			}
			if (data) {
				console.log("fetched-data: ", data);
				// update the stoackDisplayData after getting data:
				const updatedStoackDisplayData: TStockDisplay[] = portfolio.map(
					(item) => {
						const { code, purchasePrice, quantity } = item;
						const cmp = data[code] ? data[code].cmp : null;
						const investment = purchasePrice * quantity;
						const presentValue = cmp ? cmp * quantity : null;
						const net = presentValue ? presentValue - investment : null;
						const weightage = (investment / totalInvestment) * 100;
						const peRatio = data[code] ? data[code].peRatio : null;
						const latestEarnings = data[code] ? data[code].latestEarning : null;
						return {
							...item,
							cmp,
							investment: Number(investment.toFixed(2)),
							presentValue: presentValue
								? Number(presentValue.toFixed(2))
								: null,
							net: net ? Number(net.toFixed(2)) : null,
							weightage: Number(weightage.toFixed(2)),
							peRatio,
							latestEarnings,
						};
					}
				);
				setstockDisplayData(updatedStoackDisplayData);
			}
		}

		return () => clearInterval(timer);
	}, []);

	return (
		<div>
			{Object.keys(groupedData).map((key) => {
				return (
					<div key={key}>
						<PortfolioSection
							sector={key}
							tableData={groupedData[key]}
							isLoading={isLoading}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default Portfolio;
