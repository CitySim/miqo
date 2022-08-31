import { configureStore } from "@reduxjs/toolkit";
import { configSlice } from "./configSlice";
import { xivSlice } from "./xivSlice";

export const store = configureStore({
	reducer: {
		config: configSlice.reducer,
		xiv: xivSlice.reducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
