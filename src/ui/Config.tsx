import React from "react";
import { configSlice, useAppDispatch, useAppSelector } from "../redux";
import { ItemSelect } from "./ItemSelect";
import { Panel, PanelBody, PanelFooter, PanelHeader } from "./Panel";

export const Config: React.FC = function Config() {
	const landmarkCount = useAppSelector((s) => s.config.landmarkCount);
	const veryHighItems = useAppSelector((s) => s.config.veryHighItems);
	const dispatch = useAppDispatch();

	return (
		<Panel elevation={1}>
			<PanelHeader elevation={1}>
				<b>Config & Info</b>
			</PanelHeader>
			<PanelBody elevation={1}>
				landmark count:
				<br />
				<input
					type="number"
					value={landmarkCount}
					onChange={(e) => {
						dispatch(configSlice.actions.setLandmarkCount(parseInt(e.target.value)));
					}}
				/>
				<br />
				<small>
					The number of landmark increase the maximum groove you can have.
					<br />
					No Landmark: 5 Groove
					<br />
					1 Landmark: 15 Groove
					<br />
					2 Landmark: 25 Groove
					<br />3 Landmark: 35 Groove
				</small>
				<hr />
				Very High Items:
				<br />
				<ItemSelect
					value={veryHighItems[0]}
					onChange={(id) => dispatch(configSlice.actions.setVeryHighItem({ index: 0, id }))}
				/>
				<br />
				<ItemSelect
					value={veryHighItems[1]}
					onChange={(id) => dispatch(configSlice.actions.setVeryHighItem({ index: 1, id }))}
				/>
				<br />
				<ItemSelect
					value={veryHighItems[2]}
					onChange={(id) => dispatch(configSlice.actions.setVeryHighItem({ index: 2, id }))}
				/>
				<br />
				<ItemSelect
					value={veryHighItems[3]}
					onChange={(id) => dispatch(configSlice.actions.setVeryHighItem({ index: 3, id }))}
				/>
				<br />
				<ItemSelect
					value={veryHighItems[4]}
					onChange={(id) => dispatch(configSlice.actions.setVeryHighItem({ index: 4, id }))}
				/>
				<br />
				<small>
					You have to choose some items with "Very High" popularity for the calculator to figure out popularity of all
					items. You shouldn't need to touch it, it's a bit weird right now.
				</small>
				<hr />
				<ul>
					<li>this entire thing is (still) a bit of a mess right now :)</li>
					<li>note: workshop rank after an upgrade only applies for the next day</li>
					<li>supply is entirely ignored currently, "Sufficient" supply is assumed</li>
					<li>groove increased at the wrong time (at the start of the craft instead of when it ends)</li>
					<li>
						thanks to this{" "}
						<a
							href="https://docs.google.com/spreadsheets/d/1e5dyaHSt5lj25l3nFWO5QcPmAJ2aAoPxCWj-iZnKxRk/edit#gid=1283864903"
							target="_blank"
						>
							sheet
						</a>{" "}
						for the value formula
					</li>
				</ul>
			</PanelBody>
			<PanelFooter elevation={1}>
				<small>
					<a href="https://github.com/CitySim/miqo" target="_blank">
						GitHub
					</a>
					&nbsp;&mdash;&nbsp; Discord: Yue#0034
				</small>
			</PanelFooter>
		</Panel>
	);
};
