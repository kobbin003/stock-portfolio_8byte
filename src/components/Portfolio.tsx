"use client";
import { getStockData } from "@/actions/actions";
import portfolio from "@/data/portfolio.json";
import { TStockDisplay } from "@/types/portfolio";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomToast from "./CustomToast";
import PortfolioSection from "./PortfolioSection";

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
				toast(
					<CustomToast message="Failed to load portfolio data. Please refresh the page to try again." />,
					{
						icon: false, // Disable default icon
						// ... other config
						className: "p-0 w-[400px] border border-purple-600/40",
					}
				);
			})
			.finally(() => {
				setIsLoading(false);
			});

		// fetch every 15 sec interval
		let timer = setInterval(() => {
			// dont want to update loading indicator when not "initial-fetch"
			getLiveData().catch((err) => {
				toast(
					<CustomToast message="Failed to load portfolio data. Please refresh the page to try again." />,
					{
						icon: false, // Disable default icon
						// ... other config
						className: "p-0 w-[400px] border border-purple-600/40",
					}
				);
			});
		}, 15000);

		async function getLiveData() {
			const { data, error } = await getStockData(portfolioCodeList);
			if (error) {
				throw error;
			}
			if (data) {
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
			<h1 className="text-3xl font-bold px-4 py-2">Your Portfolio</h1>
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
