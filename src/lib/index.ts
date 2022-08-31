import { getPop, store } from "../redux";

export function findItems(workshop) {
	const state = store.getState();

	const activeThemes: number[] = [];
	let freeHours = 24;

	const workshopData = state.config.workshops[workshop];
	if (workshopData.queue.length > 0) {
		const lastItem = workshopData.queue[workshopData.queue.length - 1];
		if (lastItem.Theme0TargetID !== 0) activeThemes.push(lastItem.Theme0TargetID);
		if (lastItem.Theme1TargetID !== 0) activeThemes.push(lastItem.Theme1TargetID);

		freeHours = 24 - workshopData.queue.reduce((sum, item) => sum + item.CraftingTime, 0);
	}

	const goodItems: any[] = [];
	const badItems: any[] = [];

	state.xiv.MJICraftworksObject.forEach((item) => {
		if (item.Item == null) return;

		if (
			activeThemes.length > 0 &&
			(item.Theme0TargetID === 0 || activeThemes.includes(item.Theme0TargetID) === false) &&
			(item.Theme1TargetID === 0 || activeThemes.includes(item.Theme1TargetID) === false)
		) {
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

export function calculateItemValue({ workshop, item, previousItem }): [number, boolean] {
	const state = store.getState();
	const popularity = getPop(state);

	// efficiency bonus
	const hasEfficiencyBonus =
		item.ID !== previousItem?.ID &&
		(item.Theme0TargetID === previousItem?.Theme0TargetID ||
			item.Theme0TargetID === previousItem?.Theme1TargetID ||
			item.Theme1TargetID === previousItem?.Theme0TargetID ||
			item.Theme1TargetID === previousItem?.Theme1TargetID);
	const efficiencyBonus = hasEfficiencyBonus === true ? 2 : 1;
	// pop
	const pop = popularity[item.ID];
	const popularityMod = state.xiv.MJICraftWorksPopularityType[pop] / 100;
	// supply
	const supplyMod = state.xiv.MJICraftWorksSupplyDefine[2].factor / 100;
	// workshop rank
	const workshopRank = state.config.workshops[workshop].rank;
	const workshopRankMod = state.xiv.MJICraftWorksRankRatio[workshopRank] / 100;
	// groove
	const groove = 0;

	return [
		efficiencyBonus *
			Math.floor(popularityMod * supplyMod * Math.floor(item.Value * workshopRankMod * (1 + groove / 100))),
		hasEfficiencyBonus,
	];
}
