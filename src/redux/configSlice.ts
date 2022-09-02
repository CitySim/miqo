import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MJICraftworksObject } from "./xivSlice";

export interface CounterState {
	activeWorkshop?: number;
	groove: number;
	landmarkCount: number;
	//popularity: number;
	veryHighItems: number[];
	workshops: WorkshopConfig[];
}

export interface WorkshopConfig {
	rank: number;
	queue: MJICraftworksObject[];
}

const initialState: CounterState = {
	//popularity: 83,
	groove: 0,
	landmarkCount: 3,
	veryHighItems: [4, 7, 12],
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
