import { getPop, store, WorkshopConfig } from "../redux";
import { MJICraftworksObject } from "../redux";

export function findItems(workshop: number) {
	const state = store.getState();

	const workshopData = state.config.workshops[workshop];
	const lastItem = workshopData.queue[workshopData.queue.length - 1];
	let freeHours = 24 - workshopData.queue.reduce((sum, item) => sum + item.CraftingTime, 0);

	const goodItems: MJICraftworksObject[] = [];
	const badItems: MJICraftworksObject[] = [];

	state.xiv.MJICraftworksObject.forEach((item) => {
		if (item.Item == null) return;

		if (lastItem != null && hasEfficiencyBonus(item, lastItem) === false) {
			badItems.push(item);
			return;
		}
		if (freeHours < item.CraftingTime) {
			badItems.push(item);
			return;
		}

		goodItems.push(item);
	});

	return [goodItems, badItems];
}

export interface WorkshopCalculation {
	groove: number;
	value: number;
	workshops: Array<{
		workshop: WorkshopConfig;
		queue: ItemCalculation;
	}>;
}

export function calculate(workshops: WorkshopConfig[]): WorkshopCalculation {
	let groove = 0;

	return {
		groove: 0,
		value: 0,
		workshops: [],
	};
}

export interface ItemCalculation {
	item: MJICraftworksObject;

	groove: number;
	popularity: number;
	efficiencyBonus: boolean;

	value: number;
	valueTotal: number;
}

export function calculateItemValue(params: {
	workshop: number;
	item: MJICraftworksObject;
	previousItem: MJICraftworksObject;
	groove: number;
}): ItemCalculation {
	const { workshop, item, previousItem, groove } = params;

	const state = store.getState();
	const popularityMatrix = getPop(state);

	// efficiency bonus
	const efficiencyBonus = hasEfficiencyBonus(item, previousItem);

	// pop
	const popularity = popularityMatrix[item.ID];
	const popularityMod = state.xiv.MJICraftWorksPopularityType[popularity] / 100;

	// supply
	const supplyMod = state.xiv.MJICraftWorksSupplyDefine[2].factor / 100;

	// workshop rank
	const workshopRank = state.config.workshops[workshop].rank;
	const workshopRankMod = state.xiv.MJICraftWorksRankRatio[workshopRank] / 100;

	// calculate value and amount
	const amount = efficiencyBonus ? item.ResultAmount * 2 : item.ResultAmount;
	const value = Math.floor(popularityMod * supplyMod * Math.floor(item.Value * workshopRankMod * (1 + groove / 100)));

	return {
		item: item,

		groove: groove,
		efficiencyBonus: efficiencyBonus,
		popularity: popularity,

		value: value,
		valueTotal: amount * value,
	};
}

function hasEfficiencyBonus(item: MJICraftworksObject, previousItem?: MJICraftworksObject) {
	const activeTheme: number[] = [];
	if (previousItem != null && previousItem.Theme0TargetID !== 0) activeTheme.push(previousItem.Theme0TargetID);
	if (previousItem != null && previousItem.Theme1TargetID !== 0) activeTheme.push(previousItem.Theme1TargetID);

	return (
		// must be a different item
		item.ID !== previousItem?.ID &&
		// at least one theme must be the same
		(activeTheme.includes(item.Theme0TargetID) || activeTheme.includes(item.Theme1TargetID))
	);
}
