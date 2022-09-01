import React from "react";

import { useSelector } from "react-redux";
import { calculateItemValue, findItems } from "../../lib";
import { getPop, useAppSelector } from "../../redux";

import { ItemTable } from "./ItemTable";

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
		<div style={{ overflow: "auto", flex: 1 }}>
			<ItemTable data={gridItems} />
		</div>
	);
};
