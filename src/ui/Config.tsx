import React from "react";
import { useSelector } from "react-redux";
import { configSlice, getPopularity, useAppDispatch, useAppSelector } from "../redux";
import { ItemSelect } from "./ItemSelect";
import { Container, Panel, PanelBody, PanelFooter, PanelHeader } from "./lib";

const popName: Record<number, string> = {
	1: "Very High",
	2: "High",
	3: "Average",
	4: "Low",
};

export const Config: React.FC = function Config() {
	const popularity = useSelector(getPopularity);
	const landmarkCount = useAppSelector((s) => s.config.landmarkCount);
	const popularityRow = useAppSelector((s) => s.config.popularityRow);
	const veryHighItems = useAppSelector((s) => s.config.veryHighItems);
	const MJICraftworksObject = useAppSelector((s) => s.xiv.MJICraftworksObject);
	const MJICraftWorksPopularity = useAppSelector((s) => s.xiv.MJICraftWorksPopularity);
	const dispatch = useAppDispatch();

	console.log("veryHighItems", veryHighItems);
	const matrixList = React.useMemo(() => {
		return Object.entries(MJICraftWorksPopularity).filter(([index, popMatrix]) => {
			return veryHighItems.every((item) => item === 0 || item == null || popMatrix[item] === 1);
		});
	}, [veryHighItems.join()]);

	return (
		<Container>
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
					{veryHighItems.map((id, index) => (
						<React.Fragment key={index}>
							<ItemSelect value={id} onChange={(id) => dispatch(configSlice.actions.setVeryHighItem({ index, id }))} />
							<br />
						</React.Fragment>
					))}
					<ItemSelect
						value={0}
						onChange={(id) => dispatch(configSlice.actions.setVeryHighItem({ index: veryHighItems.length + 1, id }))}
					/>
					<br />
					<small>
						You have to choose some items with "Very High" popularity for the calculator to figure out popularity of all
						items.
						<br />
						{matrixList.length === 0 ? (
							<>Found no possible match, please check your selection</>
						) : matrixList.length === 1 ? (
							<>
								Found a match <br />
								<button onClick={() => dispatch(configSlice.actions.setPopularityRow(parseInt(matrixList[0][0])))}>
									apply popularity
								</button>
							</>
						) : (
							<>Found {matrixList.length} matches, please select more items so narrow down your selection</>
						)}
						<div style={{ maxHeight: 400, overflowY: "auto" }}>
							<table>
								<thead>
									<tr>
										<th>Item</th>
										<th>Current (row {popularityRow})</th>
										<th>{matrixList.length === 1 ? <>New Match (row {matrixList[0][0]})</> : null}</th>
									</tr>
								</thead>
								<tbody>
									{MJICraftworksObject.filter((i) => i.Item != null).map((item) => (
										<tr key={item.ID}>
											<td style={{ padding: 1 }}>
												<img src={`https://xivapi.com/${item.Item.Icon}`} style={{ height: "1em" }} />
												&nbsp;
												{item.Item.Name}
											</td>
											<td style={{ padding: 1 }}>{popName[popularity[item.ID]] ?? popularity[popularity[item.ID]]}</td>
											{matrixList.length === 1 ? (
												<td style={{ padding: 1 }}>
													{popName[matrixList[0][1][item.ID]] ?? matrixList[0][1][item.ID]}
												</td>
											) : null}
										</tr>
									))}
								</tbody>
							</table>
						</div>
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
		</Container>
	);
};
