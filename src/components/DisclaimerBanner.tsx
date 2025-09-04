"use client";
import { TriangleAlertIcon } from "lucide-react";

const DisclaimerBanner = () => {
	return (
		<div className="bg-yellow-200/90 border-l-4 border-yellow-400 p-4 mb-6">
			<div className="flex w-full justify-center">
				<div>
					<TriangleAlertIcon className="h-5 w-5 text-yellow-400" />
				</div>
				<div className="ml-3 ">
					<p className="text-sm text-yellow-700">
						<strong>Data Disclaimer:</strong> Stock prices and financial data
						are scraped from third-party sources and may vary in accuracy.
						Please verify important information before making investment
						decisions.
					</p>
				</div>
			</div>
		</div>
	);
};

export default DisclaimerBanner;
