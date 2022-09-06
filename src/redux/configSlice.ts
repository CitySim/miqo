import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MJICraftworksObject } from "./xivSlice";

export interface ConfigState {
	activeWorkshop?: number;
	groove: number;
	landmarkCount: number;
	popularityRow: number;
	veryHighItems: number[];
	workshops: WorkshopConfig[];
}

export interface WorkshopConfig {
	rank: number;
	queue: MJICraftworksObject[];
}

const initialState: ConfigState = {
	// 30-08-2022T08:00 - 83
	// 06-09-2022T08:00 - 31
	popularityRow: 31,
	groove: 0,
	landmarkCount: 3,
	veryHighItems: [],
	workshops: [
		{
			rank: 3,
			queue: [],
		},
		{
			rank: 3,
			queue: [],
		},
		{
			rank: 3,
			queue: [],
		},
	],
};

export const configSlice = createSlice({
	name: "config",
	initialState: initialState,
	reducers: {
		setPopularityRow(state, action: PayloadAction<number>) {
			state.popularityRow = action.payload;
		},
		setGroove(state, action: PayloadAction<number>) {
			state.groove = action.payload;
		},
		setLandmarkCount(state, action: PayloadAction<number>) {
			state.landmarkCount = action.payload;
		},
		setActiveWorkshop(state, action: PayloadAction<number>) {
			state.activeWorkshop = action.payload;
		},
		setWorkshopRank(state, action: PayloadAction<{ workshop: number; rank: number }>) {
			state.workshops[action.payload.workshop].rank = action.payload.rank;
		},
		setVeryHighItem(state, action: PayloadAction<{ index: number; id: number }>) {
			state.veryHighItems[action.payload.index] = action.payload.id;
			state.veryHighItems = state.veryHighItems.filter((i) => i != null && i !== 0);
		},
		clearQueue(state, action: PayloadAction<number>) {
			state.workshops[action.payload].queue = [];
		},
		removeFromQueue(state, action: PayloadAction<number>) {
			const queue = state.workshops[action.payload].queue;
			queue.splice(queue.length - 1, 1);
		},
		addToQueue(state, action: PayloadAction<{ workshop: number; item: MJICraftworksObject }>) {
			state.workshops[action.payload.workshop].queue.push(action.payload.item);
		},
	},
});
