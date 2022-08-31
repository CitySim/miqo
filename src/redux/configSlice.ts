import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
    activeWorkshop?: number;
    //popularity: number;
    veryHighItems: number[];
    workshops: Array<{
        rank: number;
        queue: any[];
    }>;
}

const initialState: CounterState = {
    //popularity: 0,
    veryHighItems: [ 4, 7, 12 ],
    workshops: [{
        rank: 3,
        queue: [],
    }, {
        rank: 3,
        queue: [],
    }, {
        rank: 3,
        queue: [],
    }]
}

export const configSlice = createSlice({
    name: "config",
    initialState: initialState,
    reducers: {
        setActiveWorkshop(state, action: PayloadAction<number>) {
            state.activeWorkshop = action.payload;
        },
        setVeryHighItem(state, action: PayloadAction<{ index: number; id: number; }>) {
            state.veryHighItems[action.payload.index] = action.payload.id;
        },
        clearQueue(state, action: PayloadAction<number>) {
            state.workshops[action.payload].queue = [];
        },
        removeFromQueue(state, action: PayloadAction<number>) {
            const queue = state.workshops[action.payload].queue
            queue.splice(queue.length - 1, 1)
        },
        addToQueue(state, action: PayloadAction<{ workshop: number; item: any; }>) {
            state.workshops[action.payload.workshop].queue.push(action.payload.item)
        },
    },
})
