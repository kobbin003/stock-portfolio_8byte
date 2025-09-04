import { TStock, TStockDisplay } from "@/types/portfolio";
import { PortfolioTable } from "./PortfolioTable";
import SectorSummary from "./SectorSummary";

type Props = {
	tableData: TStockDisplay[];
	isLoading: boolean;
	sector: string;
};

const PortfolioSection = ({ tableData, isLoading, sector }: Props) => {
	const {
		investment,
		presentValue,
		net,
	}: {
		investment: number | null;
		presentValue: number | null;
		net: number | null;
	} = tableData.reduce(
		(acc, item) => {
			const { investment, presentValue, net } = item;

			return {
				investment: acc.investment + investment,
				presentValue: acc.presentValue + (presentValue || 0),
				net: acc.net + (net || 0),
			};
		},
		{ investment: 0, presentValue: 0, net: 0 }
	);
	return (
		<div className="p-4">
			<SectorSummary
				investment={investment}
				net={net}
				presentvalue={presentValue}
				sector={sector}
				isLoading={isLoading}
			/>
			<PortfolioTable tableData={tableData} isLoading={isLoading} />
		</div>
	);
};

export default PortfolioSection;
