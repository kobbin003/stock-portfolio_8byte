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
				cell: (info) => <i>{info.getValue()}</i>,
				header: () => <span>Purchase Price</span>,
				// footer: (info) => info.column.id,
			}),
			columnHelper.accessor((row) => row.quantity, {
				id: "quantity",
				header: () => "Qty",
				cell: (info) => info.getValue(),
				// cell: (info) => info.renderValue(),
				// footer: (info) => info.column.id,
			}),
			columnHelper.accessor((row) => row.investment, {
				id: "investment",
				header: () => "Investment",
				cell: (info) => info.getValue(),
			}),
			columnHelper.accessor((row) => row.weightage, {
				id: "weightage",
				cell: (info) => <i>{info.getValue()}</i>,
				header: () => <span>Portfolio(%)</span>,
				// footer: (info) => info.column.id,
			}),
			columnHelper.accessor((row) => row.code, {
				id: "code",
				header: () => "NSE/BSE",
				cell: (info) => info.getValue(),
				// cell: (info) => info.renderValue(),
				// footer: (info) => info.column.id,
			}),
			columnHelper.accessor((row) => row.cmp, {
				id: "cmp",
				header: () => "CMP",
				cell: (info) => (isLoading ? "loading..." : info.getValue() ?? "-"),
			}),
			columnHelper.accessor((row) => row.presentValue, {
				id: "presentValue",
				header: () => "Present Value",
				cell: (info) => (isLoading ? "loading..." : info.getValue() ?? "-"),
			}),
			columnHelper.accessor((row) => row.net, {
				id: "net",
				cell: (info) => (
					<i>{isLoading ? "loading..." : info.getValue() ?? "-"}</i>
				),
				header: () => <span>Gain/Loss</span>,
			}),
			columnHelper.accessor((row) => row.peRatio, {
				id: "peRatio",
				header: () => "P/E Ratio",
				cell: (info) => (isLoading ? "loading..." : info.getValue() ?? "-"),
			}),
			columnHelper.accessor((row) => row.latestEarnings, {
				id: "latestEarnings",
				header: () => "Latest Earnings",
				cell: (info) => (isLoading ? "loading..." : info.getValue() ?? "-"),
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
		<div className="p-2">
			<table>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id}>
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
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id}>
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
