import React from "react";
import styled from "styled-components";
import { calculateItemValue, ItemCalculation } from "../../lib";
import { configSlice, useAppDispatch, useAppSelector } from "../../redux";
import { MJICraftworksObject } from "../../redux/xivSlice";
import { TimelineItem } from "./TImelineItem";

const WorkshopContainer = styled.div`
	border: 1px solid #444444;
	margin: 5px;
	float: left;
	width: 400px;
`;

export interface WorkshopProps {
	/**
	 * Which workshop, 0-2
	 */
	index: number;
}

export const Workshop: React.FC<WorkshopProps> = function Workshop(props) {
	const config = useAppSelector((s) => s.config);
	const dispatch = useAppDispatch();

	const workshop = props.index;
	let totalValue = 0;

	let offset = new Date(Date.UTC(2022, 8, 1, 8)).getHours();
	const queue = config.workshops[workshop].queue;

	const itemByHour: Record<string, MJICraftworksObject> = {};
	let itemByHourOffset = 0;
	queue.forEach((item) => {
		itemByHour[itemByHourOffset] = item;
		itemByHourOffset += item.CraftingTime;
	});

	let previousItem: MJICraftworksObject;

	return (
		<WorkshopContainer
			onClick={() => {
				dispatch(configSlice.actions.setActiveWorkshop(workshop));
			}}
			style={{
				background: config.activeWorkshop === workshop ? "#222222" : undefined,
			}}
		>
			Workshop {workshop + 1}
			Rank
			<select
				value={config.workshops[workshop].rank}
				onChange={(e) => {
					dispatch(configSlice.actions.setWorkshopRank({ workshop, rank: parseInt(e.target.value) }));
				}}
			>
				<option value="0"></option>
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
			</select>
			<table style={{ width: "100%" }}>
				<tbody>
					{Array(24)
						.fill(1)
						.map((_, hour) => {
							const timeDisplay = offset + hour >= 24 ? `${offset + hour - 24}:00` : `${offset + hour}:00`;

							const item = itemByHour[hour];
							let calculation: ItemCalculation | undefined;
							if (item != null) {
								calculation = calculateItemValue({
									workshop,
									item,
									previousItem,
									groove: 0,
								});
							}

							if (item != null) previousItem = item;

							return (
								<tr key={hour}>
									<td style={{ height: 27, width: 50 }}>{timeDisplay}</td>
									{calculation != null ? (
										<td rowSpan={item.CraftingTime} style={{ height: 27 * item.CraftingTime }}>
											<TimelineItem calculation={calculation} workshop={workshop} />
										</td>
									) : (
										""
									)}
								</tr>
							);
						})}
				</tbody>
			</table>
			Total Value: {totalValue}
			<button onClick={() => dispatch(configSlice.actions.clearQueue(workshop))}>clear</button>
		</WorkshopContainer>
	);
};
