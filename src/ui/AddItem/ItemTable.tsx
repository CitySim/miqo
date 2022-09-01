import React from "react";
import {
	CellContext,
	ColumnDef,
	ColumnDefTemplate,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	getGroupedRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";

import styled, { css } from "styled-components";
import { configSlice, MJICraftworksObject, useAppDispatch, useAppSelector } from "../../redux";
import { MJIItemPouch } from "../../redux/xivSlice";

export interface GridRow {
	popularity: number;
	efficiencyBonus: boolean;
	value: number;
	hourValue: number;
	item: MJICraftworksObject;

	material0: { amount: number; item?: MJIItemPouch };
	material1: { amount: number; item?: MJIItemPouch };
	material2: { amount: number; item?: MJIItemPouch };
	material3: { amount: number; item?: MJIItemPouch };
}

const popName: Record<number, string> = {
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
			<img src={`https://xivapi.com/${item.Item.Icon}`} style={{ height: "1em" }} />
			&nbsp;
			{item.Item.Name}
		</>
	);
};

const MaterialCell: React.FC<CellContext<GridRow, GridRow["material0"]>> = function MaterialCell(props) {
	const material = props.getValue();
	if (material.amount === 0 || material.item == null) return <React.Fragment />;

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

const Material: React.FC<{ item: MJIItemPouch }> = function (props) {
	const { item } = props;

	return (
		<>
			<img src={`https://xivapi.com/${item.Item.Icon}`} style={{ height: "1em" }} />
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
	columnHelper.accessor((r) => r.item.Item.Name, {
		id: "name",
		header: "Item",
		cell: ItemCell,
		size: 300,
	}),
	columnHelper.accessor((r) => r.item.Theme0?.Name ?? "", {
		id: "theme0",
		header: "Theme",
		size: 170,
		filterFn: "includesString",
	}),
	columnHelper.accessor((r) => r.item.Theme1?.Name ?? "", {
		id: "theme1",
		header: "Theme",
		size: 170,
		filterFn: "includesString",
	}),
	// columnHelper.accessor((r) => r.efficiencyBonus, {
	// 	header: "Bonus",
	// 	cell: (props) => (props.getValue() ? "✓" : ""),
	// 	size: 60,
	// 	enableColumnFilter: false,
	// }),
	columnHelper.accessor((r) => r.item.CraftingTime, {
		id: "time",
		header: "Time",
		size: 60,
		filterFn: "weakEquals",
	}),
	columnHelper.accessor((r) => r.popularity, {
		id: "popularity",
		header: "Popularity",
		cell: PopularityCell,
		// popularity is internally "inverted", 1 for "Very High" and bigger numbers for less popular items
		invertSorting: true,
		size: 90,
		filterFn: "weakEquals",
	}),
	columnHelper.accessor((r) => r.item.Value, {
		id: "value",
		header: "Base",
		enableGrouping: false,
		enableColumnFilter: false,
		size: 60,
	}),
	columnHelper.accessor((r) => r.value, {
		id: "valueFinal",
		header: "Final",
		enableGrouping: false,
		enableColumnFilter: false,
		size: 60,
	}),
	columnHelper.accessor((r) => r.hourValue, {
		id: "hourValue",
		header: "/h",
		cell: (props) => props.getValue().toFixed(2),
		enableGrouping: false,
		enableColumnFilter: false,
		size: 60,
	}),
	columnHelper.accessor((r) => r.material0, {
		id: "material0",
		header: "Material",
		cell: MaterialCell,
		enableSorting: false,
		enableGrouping: false,
		enableColumnFilter: false,
		size: 250,
	}),
	columnHelper.accessor((r) => r.material1, {
		id: "material1",
		header: "Material",
		cell: MaterialCell,
		enableSorting: false,
		enableGrouping: false,
		enableColumnFilter: false,
		size: 250,
	}),
	columnHelper.accessor((r) => r.material2, {
		id: "material2",
		header: "Material",
		cell: MaterialCell,
		enableSorting: false,
		enableGrouping: false,
		enableColumnFilter: false,
		size: 250,
	}),
];

const Table = styled.table`
	margin: 0;
	border-collapse: collapse;
	table-layout: fixed;

	& > thead {
		position: sticky;
		top: 0;
		background: #222222;
		z-index: 1;
	}

	& > thead > tr > th,
	& > tbody > tr > td {
		position: relative;
		padding: 4px;
		border: 1px solid #444444;
	}

	& > thead > tr > th {
		user-select: none;
	}

	& > tbody > tr > td {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	& > tbody > tr:hover {
		cursor: pointer;
		background: #222222;
	}
`;

const ResizeHandle = styled.div<{ isResizing: boolean }>`
	position: absolute;
	right: 0;
	top: 0;
	height: 100%;
	width: 5px;
	background: #666666;
	cursor: col-resize;
	user-select: none;
	touch-action: none;
	opacity: 0;
	z-index: 2;

	${(props) =>
		props.isResizing
			? css`
					background: blue;
					opacity: 1;
			  `
			: ""}

	*:hover > & {
		opacity: 1;
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
		defaultColumn: {
			size: 200,
			minSize: 60,
			maxSize: 300,
		},
		columnResizeMode: "onEnd",
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getGroupedRowModel: getGroupedRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
	});

	return (
		<Table
			style={{
				width: table.getCenterTotalSize(),
			}}
		>
			<thead>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<th
								key={header.id}
								style={{
									width: header.getSize(),
									cursor: header.column.getCanSort() ? "pointer" : undefined,
								}}
								colSpan={header.colSpan}
							>
								{header.isPlaceholder ? null : (
									<div style={{ width: "100%", display: "flex", flexDirection: "row", whiteSpace: "nowrap" }}>
										<div
											style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}
											onClick={header.column.getToggleSortingHandler()}
										>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</div>
										<div>
											{/* sort indicator */}
											{header.column.getIsSorted() ? (
												<>
													{{
														asc: <span onClick={header.column.getToggleSortingHandler()}>🔼</span>,
														desc: <span onClick={header.column.getToggleSortingHandler()}>🔽</span>,
													}[header.column.getIsSorted() as string] ?? null}
													{/* show index if we're sorting by more then one column */}
													{table.getState().sorting.length > 1 ? <sup>{header.column.getSortIndex() + 1}</sup> : null}
												</>
											) : null}
											{/* group */}
											{header.column.getCanGroup() ? (
												<span
													onClick={header.column.getToggleGroupingHandler()}
													style={{
														cursor: "pointer",
													}}
												>
													{header.column.getIsGrouped() ? (
														<>
															❌<sup>{header.column.getGroupedIndex()}</sup>
														</>
													) : (
														`⏏️`
													)}
												</span>
											) : null}
											{/* resize handle */}
											<ResizeHandle
												onMouseDown={header.getResizeHandler()}
												onTouchStart={header.getResizeHandler()}
												isResizing={header.column.getIsResizing()}
												style={{
													transform: header.column.getIsResizing()
														? `translateX(${table.getState().columnSizingInfo.deltaOffset}px)`
														: undefined,
												}}
											/>
										</div>
									</div>
								)}
							</th>
						))}
					</tr>
				))}
				<tr>
					{table
						.getHeaderGroups()
						.slice(-1)[0]
						.headers.map((header) => (
							<th key={header.id}>
								{header.column.getCanFilter() ? (
									header.column.id === "popularity" ? (
										<select
											value={(header.column.getFilterValue() ?? "") as string}
											onChange={(e) => header.column.setFilterValue(e.target.value)}
											style={{
												width: "100%",
											}}
										>
											<option></option>
											<option value="1">Very High</option>
											<option value="2">High</option>
											<option value="3">Average</option>
											<option value="4">Low</option>
										</select>
									) : (
										<input
											type="text"
											value={(header.column.getFilterValue() ?? "") as string}
											onChange={(e) => header.column.setFilterValue(e.target.value)}
											placeholder={`filter...`}
											style={{
												width: "100%",
											}}
										/>
									)
								) : null}
							</th>
						))}
				</tr>
			</thead>
			<tbody>
				{table.getRowModel().rows.map((row) => (
					<tr
						key={row.id}
						onClick={() => {
							if (row.getIsGrouped()) return;

							dispatch(configSlice.actions.addToQueue({ workshop, item: row.original.item }));
						}}
					>
						{row.getVisibleCells().map((cell) => (
							<td
								key={cell.id}
								onClick={row.getCanExpand() ? row.getToggleExpandedHandler() : undefined}
								style={{
									cursor: row.getCanExpand() ? "pointer" : undefined,
								}}
							>
								{cell.getIsGrouped() ? (
									<>
										{row.getIsExpanded() ? "▽" : "▷"} {flexRender(cell.column.columnDef.cell, cell.getContext())} (
										{row.subRows.length})
									</>
								) : cell.getIsAggregated() ? (
									flexRender(cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell, cell.getContext())
								) : cell.getIsPlaceholder() ? (
									<></>
								) : (
									flexRender(cell.column.columnDef.cell, cell.getContext())
								)}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</Table>
	);
};
