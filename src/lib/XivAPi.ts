export interface XivApiSearchResult {
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

interface XivApiSearchOptions {
	indexes?: string[];
	string?: string;
	stringAlgo?: string;
	stringColumn?: string;
	sortField?: string;
	sortOrder?: string;
	page?: number;
	limit?: number;
	filters?: string;
}

export class XivAPi {
	public host = "https://xivapi.com";

	async search(options: XivApiSearchOptions): Promise<XivApiSearchResult> {
		let query = new URLSearchParams();
		if (options.indexes) query.append("indexes", options.indexes.join());
		if (options.string) query.append("string", options.string);
		if (options.stringAlgo) query.append("string_algo", options.stringAlgo);
		if (options.stringColumn) query.append("string_column", options.stringColumn);
		if (options.page) query.append("page", options.page.toString());
		if (options.sortField) query.append("sort_field", options.sortField);
		if (options.sortOrder) query.append("sort_order", options.sortOrder);
		if (options.limit) query.append("limit", options.limit.toString());

		let req = await fetch(`${this.host}/search?${query.toString()}`, { mode: "cors" });
		return await req.json();
	}

	// async searchAdvanced(query: any): Promise<XivApiSearchResult> {}

	async content(type: string, options: { limit: number; ids: any[] }): Promise<any> {
		let query = new URLSearchParams();
		if (options.limit) query.append("limit", options.limit.toString());
		if (options.ids) query.append("ids", options.ids.join());

		let req = await fetch(`${this.host}/${type}?${query.toString()}`, { mode: "cors" });
		return await req.json();
	}

	async contentById(type: string, id: number): Promise<any> {
		let req = await fetch(`${this.host}/${type}/${id}`, { mode: "cors" });
		return await req.json();
	}

	async servers(): Promise<string[]> {
		let req = await fetch(`${this.host}/servers`, { mode: "cors" });
		return await req.json();
	}

	async dataCenters(): Promise<{ [dc: string]: string[] }> {
		let req = await fetch(`${this.host}/servers`, { mode: "cors" });
		return await req.json();
	}
}
