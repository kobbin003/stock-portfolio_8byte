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
		<div>
			<h2>{sector} sector</h2>
			<p>Investment: {investment}</p>
			<p>Gain/Loss: {isLoading ? "loading..." : net}</p>
			<p>Present Value: {isLoading ? "loading..." : presentvalue}</p>
		</div>
	);
};

export default SectorSummary;
