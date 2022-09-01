import React from "react";
import styled from "styled-components";
import { ItemCalculation } from "../../lib";
import { configSlice, MJICraftworksObject, useAppDispatch } from "../../redux";

const popName: Record<number, string> = {
	1: "Very High",
	2: "High",
	3: "Average",
	4: "Low",
};
const Panel = styled.div`
	width: 100%;
	height: 100%;

	display: flex;
	flex-flow: column nowrap;

	background: #444444;
	border-radius: 4px;
	box-shadow: 2px 2px 8px #55555555;
	border: 1px solid #555555;
	padding: 8px;
`;

export interface TimelineItemProps {
	calculation: ItemCalculation;
}

export const TimelineItem: React.FC<TimelineItemProps> = function TimelineItem(props) {
	const { calculation } = props;
	const { item, efficiencyBonus, valueTotal, popularity, groove } = calculation;
	const dispatch = useAppDispatch();

	return (
		<Panel>
			<div style={{ borderBottom: "1px solid #555555", paddingBottom: 2, marginTop: -2 }}>
				<img src={`https://xivapi.com/${item.Item.Icon}`} style={{ height: 40, float: "left", marginRight: 2 }} />
				<b>{item.Item.Name}</b>
				<br />
				<small>
					{item.CraftingTime}h &nbsp;&mdash;&nbsp;
					{popName[popularity]}
				</small>
				{/* <button onClick={() => dispatch(configSlice.actions.removeFromQueue(0))}>x</button> */}
			</div>
			<div style={{ flex: 1, padding: "4px 0" }}>
				<div style={{ display: "flex" }}>
					<div style={{ flex: 1 }}>
						<img src="https://xivapi.com/i/065000/065096.png" style={{ height: "1em" }} />
						&nbsp;
						{valueTotal}
					</div>
					<div>{efficiencyBonus ? "Efficiency Bonus!" : ""}</div>
				</div>
			</div>
			<div style={{ borderTop: "1px solid #555555", paddingTop: 2, marginBottom: -2 }}>
				<small>
					{item.Theme0?.Name ?? ""}
					{item.Theme1 != null ? " / " : ""}
					{item.Theme1?.Name ?? ""}
				</small>
			</div>
		</Panel>
	);
};
