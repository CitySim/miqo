import { IItem } from "./Item";

export interface ISearchResult {
	Pagination: {
		Page: number;
		PageNext: number;
		PagePrev: null,
		PageTotal: number;
		Results: number;
		ResultsPerPage: number;
		ResultsTotal: number;
	};
	Results: {
		ID: number;
		Icon: string;
		Name: string;
		Url: string;
		UrlType: string;
		_: string;
		_Score: number;
	}[];
}

export class XivAPi {
	host = "https://xivapi.com";

	async search(term: string): Promise<ISearchResult> {
		let req = await fetch(`${this.host}/search?string=${term}`, {
			method: "get",
		});
		return await req.json();
	}

	async item(id: number): Promise<IItem> {
		let req = await fetch(`${this.host}/item/${id}`, {
			method: "get",
		});
		return await req.json();
	}

	async recipe(id: number): Promise<IItem> {
		let req = await fetch(`${this.host}/recipe/${id}`, {
			method: "get",
		});
		return await req.json();
	}
}
