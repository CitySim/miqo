import React from "react";
import {
	CellContext,
	ColumnDef,
	ColumnDefTemplate,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import styled from "styled-components";
import { configSlice, useAppDispatch, useAppSelector } from "../../redux";

interface GridRow {
	popularity: number;
	efficiencyBonus: boolean;
	value: number;
	hourValue: number;
	item: any;

	material0: { amount: number; item: number };
	material1: { amount: number; item: number };
	material2: { amount: number; item: number };
	material3: { amount: number; item: number };
}

const popName = {
	1: "Very High",
	2: "High",
	3: "Average",
	4: "Low",
};

const PopularityCell: React.FC<CellContext<GridRow, number>> = function PopularityCell(props) {
	const value = props.getValue();
	return <>{popName[value] ?? value}</>;
};

const ItemCell: React.FC<CellContext<GridRow, unknown>> = function ItemCell(props) {
	const item = props.row.original.item;

	return (
		<>
			<img src={`https://xivapi.com/${item.Item.IconHD}`} style={{ height: "1em" }} />
			&nbsp;
			{item.Item.Name}
		</>
	);
};

const MaterialCell: React.FC<CellContext<GridRow, GridRow["material0"]>> = function MaterialCell(props) {
	const material = props.getValue();
	if (material.amount === 0) return <React.Fragment />;

	return (
		<>
			{material.amount}
			&nbsp;
			<Material item={material.item} />
		</>
	);
};

const materialGranary = [
	27, // Island Alyssum
	28, // Raw Island Garnet
	29, // Island Spruce Log
	30, // Island Hammerhead
	31, // Island Silver Ore
];

const Material: React.FC<{ item: any }> = function (props) {
	const { item } = props;

	return (
		<>
			<img src={`https://xivapi.com/${item.Item.IconHD}`} style={{ height: "1em" }} />
			&nbsp;
			{materialGranary.includes(item.ID) ? <Label>G</Label> : null}
			{item?.Category.ID === 4 ? <Label>P</Label> : null}
			{item?.Category.ID === 5 ? <Label>L</Label> : null}
			&nbsp;
			{item.Item.Name ?? null}
		</>
	);
};

const Label = styled.span`
	background-color: #646464;
	color: white;
	border-radius: 5px;
	padding: 1px 4px;
`;

const columnHelper = createColumnHelper<GridRow>();
const defaultColumns: ColumnDef<GridRow, any>[] = [
	columnHelper.accessor((r) => r.item.Name, {
		id: "name",
		enableSorting: true,
		header: "Item",
		cell: ItemCell,
	}),
	columnHelper.accessor((r) => r.item.Theme0?.Name, {
		id: "theme0",
		header: "Theme",
	}),
	columnHelper.accessor((r) => r.item.Theme1?.Name, {
		id: "theme1",
		header: "Theme",
	}),
	columnHelper.accessor((r) => r.efficiencyBonus, {
		header: "Bonus",
		cell: (props) => (props.getValue() ? "✓" : ""),
	}),
	columnHelper.accessor((r) => r.item.CraftingTime, {
		id: "time",
		header: "Time",
	}),
	columnHelper.accessor((r) => r.popularity, {
		id: "popularity",
		header: "Popularity",
		cell: PopularityCell,
	}),
	columnHelper.accessor((r) => r.item.Value, {
		id: "value",
		header: "Base",
	}),
	columnHelper.accessor((r) => r.value, {
		id: "valueFinal",
		header: "Final",
	}),
	columnHelper.accessor((r) => r.hourValue, {
		id: "hourValue",
		header: "/h",
		cell: (props) => props.getValue().toFixed(2),
	}),
	columnHelper.accessor((r) => r.material0, {
		id: "material0",
		header: "Material",
		cell: MaterialCell,
	}),
	columnHelper.accessor((r) => r.material1, {
		id: "material1",
		header: "Material",
		cell: MaterialCell,
	}),
	columnHelper.accessor((r) => r.material2, {
		id: "material2",
		header: "Material",
		cell: MaterialCell,
	}),
];

const Table = styled.table`
	margin: 0;
	border-collapse: collapse;

	& > thead {
		position: sticky;
		top: 0;
		background: #222222;
	}

	& > thead > tr > th,
	& > tbody > tr > td {
		padding: 4px;
		border: 1px solid #444444;
	}

	& > tbody > tr:hover {
		cursor: pointer;
		background: #222222;
	}
`;

export interface ItemTableProps {
	data: GridRow[];
}

export const ItemTable: React.FC<ItemTableProps> = function ItemTable(props) {
	const workshop = useAppSelector((s) => s.config.activeWorkshop);
	const dispatch = useAppDispatch();

	if (workshop == null) return <React.Fragment />;

	const table = useReactTable({
		data: props.data,
		columns: defaultColumns,
		initialState: {
			sorting: [
				{
					id: "hourValue",
					desc: true,
				},
			],
		},
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<Table>
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<th
								key={header.id}
								style={{
									cursor: header.column.getCanSort() ? "pointer" : undefined,
									userSelect: header.column.getCanSort() ? "none" : undefined,
								}}
								onClick={header.column.getToggleSortingHandler()}
							>
								{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}

								{{
									asc: " 🔼",
									desc: " 🔽",
								}[header.column.getIsSorted() as string] ?? null}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody>
				{table.getRowModel().rows.map((row) => (
					<tr
						key={row.id}
						onClick={() => dispatch(configSlice.actions.addToQueue({ workshop, item: row.original.item }))}
					>
						{row.getVisibleCells().map((cell) => (
							<td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
						))}
					</tr>
				))}
			</tbody>
		</Table>
	);
};
