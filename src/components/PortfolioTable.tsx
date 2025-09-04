"use client";
import { useMemo } from "react";

import { TStockDisplay } from "@/types/portfolio";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper<TStockDisplay>();

type Props = {
	tableData: TStockDisplay[];
	isLoading: boolean;
};

export const PortfolioTable = ({ tableData, isLoading }: Props) => {
	const columns = useMemo(
		() => [
			columnHelper.accessor((row) => row.name, {
				id: "name",
				header: "Particulars",
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
			}),
			columnHelper.accessor((row) => row.purchasePrice, {
				id: "purchasePrice",
				cell: (info) => <i>{info.getValue().toLocaleString()}</i>,
				header: () => <span>Purchase Price (₹)</span>,
			}),
			columnHelper.accessor((row) => row.quantity, {
				id: "quantity",
				header: () => "Qty",
				cell: (info) => info.getValue(),
			}),
			columnHelper.accessor((row) => row.investment, {
				id: "investment",
				header: () => "Investment (₹)",
				cell: (info) => info.getValue().toLocaleString(),
			}),
			columnHelper.accessor((row) => row.weightage, {
				id: "weightage",
				cell: (info) => <i>{info.getValue()}</i>,
				header: () => <span>Portfolio (%)</span>,
			}),
			columnHelper.accessor((row) => row.code, {
				id: "code",
				header: () => "NSE/BSE",
				cell: (info) => info.getValue(),
			}),
			columnHelper.accessor((row) => row.cmp, {
				id: "cmp",
				header: () => "CMP",
				cell: (info) =>
					isLoading ? <i>loading...</i> : info.getValue() ?? "-",
			}),
			columnHelper.accessor((row) => row.presentValue, {
				id: "presentValue",
				header: () => "Present Value (₹)",
				cell: (info) =>
					isLoading ? (
						<i>loading...</i>
					) : (
						info.getValue()?.toLocaleString() ?? "-"
					),
			}),
			columnHelper.accessor((row) => row.net, {
				id: "net",
				cell: (info) => {
					const value = info.getValue();
					if (isLoading) return <i>loading...</i>;
					if (value === null || value === undefined) return <i>-</i>;
					const isGain = value >= 0;
					return (
						<i
							className={`font-semibold ${
								isGain ? "text-green-600" : "text-red-600"
							}`}
						>
							{value.toLocaleString()}
						</i>
					);
				},
				header: () => <span>Gain/Loss (₹)</span>,
			}),
			columnHelper.accessor((row) => row.peRatio, {
				id: "peRatio",
				header: () => "P/E Ratio",
				cell: (info) =>
					isLoading ? <i>loading...</i> : info.getValue() ?? "-",
			}),
			columnHelper.accessor((row) => row.latestEarnings, {
				id: "latestEarnings",
				header: () => "Latest Earnings",
				cell: (info) =>
					isLoading ? <i>loading...</i> : info.getValue() ?? "-",
			}),
		],
		[isLoading]
	);

	const table = useReactTable({
		data: tableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="overflow-x-auto">
			<table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
				<thead className="bg-gray-50">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id} className="border-b border-gray-200">
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider"
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
										  )}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{table.getRowModel().rows.map((row) => (
						<tr
							key={row.id}
							className="hover:bg-gray-50 transition-colors duration-150"
						>
							{row.getVisibleCells().map((cell) => (
								<td
									key={cell.id}
									className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
