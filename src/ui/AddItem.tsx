import React from "react";
import { ICellRendererParams, ModuleRegistry } from "@ag-grid-community/core";
import { AgGridReact } from "@ag-grid-community/react";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";

import { useSelector } from "react-redux";
import { calculateItemValue, findItems } from "../lib";
import { configSlice, getPop, store, useAppDispatch, useAppSelector } from "../redux";

import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-balham.css";
import styled from "styled-components";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const AddItem: React.FC = function AddItem() {
	const config = useAppSelector((s) => s.config);
	const popMatrix = useSelector(getPop);
	const dispatch = useAppDispatch();

	if (config.activeWorkshop == null) {
		return <div />;
	}

	const workshop = config.activeWorkshop;
	const queue = config.workshops[workshop].queue;
	const previousItem = queue[queue.length - 1];

	const [goodItems] = findItems(workshop);
	goodItems.sort((a, b) => {
		const [valueA] = calculateItemValue({ workshop, item: a, previousItem });
		const [valueB] = calculateItemValue({ workshop, item: b, previousItem });

		return valueB / b.CraftingTime - valueA / a.CraftingTime;
	});

	const gridItems = goodItems.map((item) => {
		const [value, efficiencyBonus] = calculateItemValue({
			workshop,
			item,
			previousItem,
		});

		return {
			popularity: popMatrix[item.ID],
			efficiencyBonus: efficiencyBonus,
			value: value,
			hourValue: value / item.CraftingTime,
			item: item,

			material0: { amount: item.Amount0, item: item.Material0 },
			material1: { amount: item.Amount1, item: item.Material1 },
			material2: { amount: item.Amount2, item: item.Material2 },
			material3: { amount: item.Amount3, item: item.Material3 },
		};
	});

	return (
		<div style={{ overflow: "hidden", flex: 1 }}>
			<AgGridReact
				className="ag-theme-balham-dark"
				//containerStyle={{ height: "100%" }}
				rowData={gridItems}
				onRowClicked={(e) => {
					dispatch(configSlice.actions.addToQueue({ workshop, item: e.data?.item }));
				}}
				columnDefs={[
					{
						headerName: "Itemaa",
						field: "item.Item.Name",
						cellRenderer: ItemCell,
						pinned: "left",
						sortable: true,
						filter: "agTextColumnFilter",
						floatingFilter: true,
					},
					{
						headerName: "Theme",
						field: "item.Theme0.Name",
						width: 150,
						sortable: true,
						filter: true,
						floatingFilter: true,
					},
					{
						headerName: "Theme",
						field: "item.Theme1.Name",
						width: 150,
						sortable: true,
						filter: true,
						floatingFilter: true,
					},
					{
						headerName: "Bonus",
						field: "efficiencyBonus",
						width: 60,
					},
					{
						headerName: "Time",
						field: "item.CraftingTime",
						width: 80,
						sortable: true,
						filter: true,
						floatingFilter: true,
					},
					{
						field: "popularity",
						sortable: true,
						width: 100,
						cellRenderer: PopularityCell,
					},
					{
						headerName: "Base",
						field: "item.Value",
						width: 60,
						sortable: true,
					},
					{
						headerName: "Final",
						field: "value",
						width: 60,
						sortable: true,
					},
					{
						headerName: "/h",
						field: "hourValue",
						width: 60,
						sortable: true,
						initialSort: "desc",
					},
					{
						headerName: "Material",
						field: "material0",
						cellRenderer: MaterialCell,
					},
					{
						headerName: "Material",
						field: "material1",
						cellRenderer: MaterialCell,
					},
					{
						headerName: "Material",
						field: "material2",
						cellRenderer: MaterialCell,
					},
				]}
			/>
		</div>
	);
};

const popName = {
	1: "Very High",
	2: "High",
	3: "Average",
	4: "Low",
};

const PopularityCell: React.FC<ICellRendererParams> = function PopularityCell(props) {
	const value = props.value;

	return <>{popName[value] ?? value}</>;
};

const ItemCell: React.FC<ICellRendererParams> = function ItemCell(props) {
	const item = props.data.item;

	return (
		<>
			<img src={`https://xivapi.com/${item.Item.IconHD}`} style={{ height: "1em" }} />
			&nbsp;
			{item.Item.Name}
		</>
	);
};

const MaterialCell: React.FC<ICellRendererParams> = function MaterialCell(props) {
	const material = props.value;

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
