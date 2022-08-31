import React from "react";
import styled from "styled-components";
import { configSlice, useAppDispatch, useAppSelector } from "../redux";
import { ItemSelect } from "./ItemSelect";

export const Config: React.FC = function Config() {
	const veryHighItems = useAppSelector((s) => s.config.veryHighItems);
	const dispatch = useAppDispatch();

	return (
		<div>
			Very High Items:
			<br />
			Select several of your "Very High" popularity item until there is only one match left.
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
			matches: 0
			<hr />
			<a href="https://github.com/CitySim/miqo" target="_blank">
				GitHub
			</a>
			&nbsp;&mdash;&nbsp; Discord: Yue#0034
			<br />
			<ul>
				<li>this entire thing is a bit of a mess right now :)</li>
				<li>assumes you have a rank 10 island, and rank 3 workshops</li>
				<li>supply is entirely ignored currently</li>
				<li>groove is also missing at the moment</li>
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
		</div>
	);
};
