import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const getPopularity = createSelector(
	(s: RootState) => s.config.popularityRow,
	(s: RootState) => s.xiv.MJICraftWorksPopularity,
	(popularity, MJICraftWorksPopularity) => {
		return MJICraftWorksPopularity[popularity];
	}
);
