import React from "react";

import { useSelector } from "react-redux";
import { calculateItemValue, findItems } from "../../../lib";
import { getPop, useAppSelector } from "../../../redux";
import { Container, elevationColor } from "../../lib";

import { GridRow, ItemTable } from "./ItemTable";

export const AddItem: React.FC = function AddItem() {
	const config = useAppSelector((s) => s.config);
	const popMatrix = useSelector(getPop);

	if (config.activeWorkshop == null) {
		return <div />;
	}

	const workshop = config.activeWorkshop;
	const queue = config.workshops[workshop].queue;
	const previousItem = queue[queue.length - 1];

	const [goodItems] = findItems(workshop);
	const gridItems = goodItems.map<GridRow>((item) => {
		const calculation = calculateItemValue({
			workshop,
			item,
			previousItem,
			groove: 0,
		});

		return {
			popularity: popMatrix[item.ID],
			efficiencyBonus: calculation.efficiencyBonus,
			value: calculation.valueTotal,
			hourValue: calculation.valueTotal / item.CraftingTime,
			item: item,

			material0: { amount: item.Amount0, item: item.Material0 },
			material1: { amount: item.Amount1, item: item.Material1 },
			material2: { amount: item.Amount2, item: item.Material2 },
			material3: { amount: item.Amount3, item: item.Material3 },
		};
	});

	return (
		<>
			<div
				style={{
					backgroundColor: elevationColor(1),
					borderTop: `1px solid ${elevationColor(2)}`,
					borderBottom: `1px solid ${elevationColor(2)}`,
					padding: "8px 16px",
					margin: "16px 0",
					cursor: "pointer",
				}}
				onClick={(e) => {
					e.currentTarget.scrollIntoView({
						block: "start",
						behavior: "smooth",
					});
				}}
			>
				<b>Add Item to Workshop {workshop + 1}</b>
			</div>
			<div style={{ minHeight: "50vh", overflowX: "auto" }}>
				<ItemTable data={gridItems} />
			</div>
		</>
	);
};
