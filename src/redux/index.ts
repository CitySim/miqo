import { createSelector } from "@reduxjs/toolkit";
import { RootState, store } from "./store";

export * from "./configSlice";
export * from "./store";
export * from "./hooks";

export const getPop = createSelector(
	(s: RootState) => s.config.veryHighItems,
	(s: RootState) => s.xiv.MJICraftWorksPopularity,
	(veryHighItems, MJICraftWorksPopularity) => {
		const matrixList = Object.entries(MJICraftWorksPopularity).filter(([index, popMatrix]) => {
			return veryHighItems.every((item) => item === 0 || item == null || popMatrix[item] === 1);
		});

		return matrixList[0][1];
	}
);
