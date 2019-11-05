export interface IItem {
	Description: string;
	Icon: string;
	ItemActionTarget: "ItemAction";
	ItemActionTargetID: number;
	Name: string;
	Recipes: {
		ClassJobID: number,
		ID: number,
		Level: number
	}[];
}
