import React from "react";
import styled from "styled-components";
import { ItemCalculation } from "../../lib";
import { configSlice, MJICraftworksObject, useAppDispatch } from "../../redux";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "../Panel";

const popName: Record<number, string> = {
	1: "Very High",
	2: "High",
	3: "Average",
	4: "Low",
};
const TimelinePanel = styled(Panel)`
	width: 100%;
	height: 100%;
`;

export interface TimelineItemProps {
	workshop: number;
	calculation: ItemCalculation;
	elevation: number;
}

export const TimelineItem: React.FC<TimelineItemProps> = function TimelineItem(props) {
	const { calculation, workshop } = props;
	const { item, efficiencyBonus, valueTotal, popularity, groove } = calculation;
	const dispatch = useAppDispatch();

	return (
		<TimelinePanel elevation={props.elevation}>
			<PanelHeader elevation={props.elevation}>
				<img src={`https://xivapi.com/${item.Item.Icon}`} style={{ height: 40, float: "left", marginRight: 2 }} />
				<b>{item.Item.Name}</b>
				<br />
				<small>
					{item.CraftingTime}h &nbsp;&mdash;&nbsp;
					{popName[popularity]}
				</small>
				{/*
				<button style={{ float: "right" }} onClick={() => dispatch(configSlice.actions.removeFromQueue(workshop))}>
					x
				</button>
			*/}
			</PanelHeader>
			<PanelBody elevation={props.elevation}>
				<div style={{ display: "flex" }}>
					<div style={{ flex: 1 }}>
						<img src="https://xivapi.com/i/065000/065096.png" style={{ height: "1em" }} />
						&nbsp;
						{valueTotal}
						&nbsp;&mdash;&nbsp;
						{groove} Groove
					</div>
					<div>{efficiencyBonus ? "Efficiency Bonus!" : ""}</div>
				</div>
			</PanelBody>
			<PanelFooter elevation={props.elevation}>
				<small>
					{item.Theme0?.Name ?? ""}
					{item.Theme1 != null ? " / " : ""}
					{item.Theme1?.Name ?? ""}
				</small>
			</PanelFooter>
		</TimelinePanel>
	);
};
