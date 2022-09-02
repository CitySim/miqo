import React from "react";
import styled from "styled-components";
import { calculate, calculateItemValue, ItemCalculation } from "../../lib";
import { configSlice, useAppDispatch, useAppSelector } from "../../redux";
import { Material } from "../Material";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "../Panel";
import { Timeline } from "./Timeline";

const WorkshopContainer = styled(Panel)`
	margin: 5px;
	flex: 1 1 350px;
	min-width: min(350px, 90vw);
	max-width: 400px;
`;

export const Workshop: React.FC = function Workshop() {
	const config = useAppSelector((s) => s.config);
	const dispatch = useAppDispatch();

	const workshops = useAppSelector((s) => s.config.workshops);
	const workshopCalculation = calculate(workshops);
	//console.log("workshopCalculation", workshopCalculation);

	return (
		<>
			<div style={{ display: "flex", flexFlow: "row nowrap", overflowY: "auto" }}>
				{workshopCalculation.workshops.map((workshop, index) => (
					<WorkshopContainer
						elevation={config.activeWorkshop === index ? 2 : 1}
						onClick={() => {
							dispatch(configSlice.actions.setActiveWorkshop(index));
						}}
					>
						<PanelHeader elevation={config.activeWorkshop === index ? 2 : 1}>
							<b>Workshop {index + 1}</b>

							<span style={{ float: "right" }}>
								Rank&nbsp;
								<select
									value={config.workshops[index].rank}
									onChange={(e) => {
										dispatch(configSlice.actions.setWorkshopRank({ workshop: index, rank: parseInt(e.target.value) }));
									}}
								>
									<option value="0"></option>
									<option value="1">1</option>
									<option value="2">2</option>
									<option value="3">3</option>
								</select>
							</span>
						</PanelHeader>
						<PanelBody elevation={config.activeWorkshop === index ? 2 : 1}>
							<Timeline
								index={index}
								workshopCalculation={workshopCalculation}
								elevation={config.activeWorkshop === index ? 3 : 2}
							/>
						</PanelBody>
						<PanelFooter elevation={config.activeWorkshop === index ? 2 : 1}>
							Total Value: {workshop.value}
							<button onClick={() => dispatch(configSlice.actions.clearQueue(index))}>clear</button>
							<button onClick={() => dispatch(configSlice.actions.removeFromQueue(index))}>remove last</button>
						</PanelFooter>
					</WorkshopContainer>
				))}
				<WorkshopContainer elevation={1}>
					<PanelHeader elevation={1}>
						<b>Results</b>
					</PanelHeader>
					<PanelBody elevation={1}>
						<small>starting Groove:</small>
						<br />
						<input
							type="number"
							value={config.groove}
							onChange={(e) => {
								dispatch(configSlice.actions.setGroove(parseInt(e.target.value)));
							}}
						/>
						<br />
						<small>final Groove:</small>
						<br />
						<input type="number" value={workshopCalculation.finalGroove} disabled />
						<br />
						<hr />
						<b>Results</b>
						<table style={{ width: "100%" }}>
							<thead>
								<tr>
									<th>Item</th>
									<th style={{ textAlign: "right" }}>Amount</th>
									<th style={{ textAlign: "right" }}>Value</th>
								</tr>
							</thead>
							<tbody>
								{workshopCalculation.items.map((itemResult) => (
									<tr>
										<td>
											<img src={`https://xivapi.com/${itemResult.item.Item.Icon}`} style={{ height: "1em" }} />
											&nbsp;
											{itemResult.item.Item.Name}
										</td>
										<td style={{ textAlign: "right" }}>{itemResult.amount}</td>
										<td style={{ textAlign: "right" }}>
											{itemResult.value}
											&nbsp;
											<img src="https://xivapi.com/i/065000/065096.png" style={{ height: "1em" }} />
										</td>
									</tr>
								))}
							</tbody>
							<tfoot>
								<tr>
									<td></td>
									<td style={{ textAlign: "right" }}>Total</td>
									<td style={{ textAlign: "right" }}>
										<b>
											{workshopCalculation.value}
											&nbsp;
											<img src="https://xivapi.com/i/065000/065096.png" style={{ height: "1em" }} />
										</b>
									</td>
								</tr>
							</tfoot>
						</table>
						<hr />
						<b>Materials</b>
						<table style={{ width: "100%" }}>
							<thead>
								<tr>
									<th>Item</th>
									<th style={{ textAlign: "right" }}>Amount</th>
								</tr>
							</thead>
							<tbody>
								{workshopCalculation.material.map((material) => (
									<tr>
										<td>
											<Material item={material.item} />
										</td>
										<td style={{ textAlign: "right" }}>{material.amount}</td>
									</tr>
								))}
							</tbody>
						</table>
					</PanelBody>
				</WorkshopContainer>
			</div>
		</>
	);
};
