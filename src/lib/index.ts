import { getPop, MJIItemPouch, store, WorkshopConfig } from "../redux";
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
	startingGroove: number;
	finalGroove: number;
	value: number;

	hours: WorkshopCalculationHour[];
	workshops: Array<{
		value: number;
		queue: ItemCalculation[];
	}>;
	items: Array<{
		item: MJICraftworksObject;
		amount: number;
		value: number;
	}>;
	material: Array<{
		item: MJIItemPouch;
		amount: number;
	}>;
}

export interface WorkshopCalculationHour {
	startingGroove: number;
	finalGroove: number;
	calculations: Array<ItemCalculation | undefined>;
}

export function calculate(workshops: WorkshopConfig[]): WorkshopCalculation {
	// build object of what items are crafted at what time
	const itemByHour = new Map<number, MJICraftworksObject[]>();
	for (let index = 0; index < workshops.length; index++) {
		let hour = 0;
		const workshop = workshops[index];

		workshop.queue.forEach((item) => {
			let itemList = itemByHour.get(hour);
			if (itemList == null) {
				itemList = [];
				itemByHour.set(hour, itemList);
			}

			itemList[index] = item;
			hour += item.CraftingTime;
		});
	}

	const result: WorkshopCalculation = {
		startingGroove: 0,
		finalGroove: 0,
		value: 0,

		workshops: workshops.map((workshop) => {
			return {
				value: 0,
				queue: [],
			};
		}),
		items: [],
		material: [],
		hours: [],
	};

	const state = store.getState();
	let groove = state.config.groove;
	const maxGroove = 5 + state.config.landmarkCount * 10;

	// run calculation
	for (let hour = 0; hour < 24; hour++) {
		const items = itemByHour.get(hour) ?? [];

		result.hours[hour] = {
			startingGroove: groove,
			finalGroove: 0,
			calculations: items.map((item, workshop) => {
				if (item == null) return undefined;

				const workshopResult = result.workshops[workshop];
				const previousItem = workshopResult.queue[workshopResult.queue.length - 1];

				const calculation = calculateItemValue({
					workshop: workshop,
					groove: groove,
					previousItem: previousItem?.item,
					item: item,
				});

				result.value += calculation.valueTotal;
				workshopResult.value += calculation.valueTotal;
				workshopResult.queue.push(calculation);

				let itemResult = result.items.find((i) => i.item.ID === item.ID);
				if (itemResult == null) {
					itemResult = {
						item: item,
						amount: 0,
						value: 0,
					};
					result.items.push(itemResult);
				}

				itemResult.amount += calculation.amount;
				itemResult.value += calculation.valueTotal;

				if (calculation.efficiencyBonus) groove = Math.min(groove + 1, maxGroove);
				return calculation;
			}),
		};

		result.hours[hour].finalGroove = groove;
	}

	result.finalGroove = groove;

	result.items.forEach((itemResult) => {
		function add(amount: number, item: MJIItemPouch): void {
			let material = result.material.find((i) => i.item.ID === item.ID);
			if (material == null) {
				material = { item, amount: 0 };
				result.material.push(material);
			}
			material.amount += amount;
		}

		if (itemResult.item.Amount0 > 0 && itemResult.item.Material0 != null)
			add(itemResult.item.Amount0, itemResult.item.Material0);
		if (itemResult.item.Amount1 > 0 && itemResult.item.Material1 != null)
			add(itemResult.item.Amount1, itemResult.item.Material1);
		if (itemResult.item.Amount2 > 0 && itemResult.item.Material2 != null)
			add(itemResult.item.Amount2, itemResult.item.Material2);
		if (itemResult.item.Amount3 > 0 && itemResult.item.Material3 != null)
			add(itemResult.item.Amount3, itemResult.item.Material3);
	});

	return result;
}

export interface ItemCalculation {
	item: MJICraftworksObject;

	groove: number;
	popularity: number;
	efficiencyBonus: boolean;

	amount: number;
	value: number;
	valueTotal: number;
}

export function calculateItemValue(params: {
	workshop: number;
	item: MJICraftworksObject;
	previousItem?: MJICraftworksObject;
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
	// you would probably want to use `item.ResultAmount` for the amount, but that columns seems unused and contains wrong data
	const amount = efficiencyBonus ? 2 : 1;
	const value = Math.floor(popularityMod * supplyMod * Math.floor(item.Value * workshopRankMod * (1 + groove / 100)));

	return {
		item: item,

		groove: groove,
		efficiencyBonus: efficiencyBonus,
		popularity: popularity,

		amount: amount,
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
