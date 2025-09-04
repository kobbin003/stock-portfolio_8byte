import React from "react";

type Props = {
	sector: string;
	investment: number;
	presentvalue: number;
	net: number;
	isLoading: boolean;
};

const SectorSummary = ({
	investment,
	net,
	presentvalue,
	sector,
	isLoading,
}: Props) => {
	return (
		<div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200 w-full">
			<h2 className="text-xl font-bold text-gray-800 mb-4 capitalize">
				{sector} sector
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="bg-blue-50 p-4 rounded-lg">
					<p className="text-sm font-medium text-blue-600 mb-1">Investment</p>
					<p className="text-lg font-bold text-blue-800">
						₹{investment.toLocaleString()}
					</p>
				</div>
				<div
					className={`p-4 rounded-lg ${net >= 0 ? "bg-green-50" : "bg-red-50"}`}
				>
					<p
						className={`text-sm font-medium mb-1 ${
							net >= 0 ? "text-green-600" : "text-red-600"
						}`}
					>
						Gain/Loss
					</p>
					<p
						className={`text-lg font-bold ${
							net >= 0 ? "text-green-800" : "text-red-800"
						}`}
					>
						{isLoading ? <i>loading...</i> : `₹ ${net.toLocaleString()}`}
					</p>
				</div>
				<div className="bg-purple-50 p-4 rounded-lg">
					<p className="text-sm font-medium text-purple-600 mb-1">
						Present Value
					</p>
					<p className="text-lg font-bold text-purple-800">
						{isLoading ? (
							<i>loading...</i>
						) : (
							`₹ ${presentvalue.toLocaleString()}`
						)}
					</p>
				</div>
			</div>
		</div>
	);
};

export default SectorSummary;
