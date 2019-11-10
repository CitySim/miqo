import { openDB, IDBPDatabase } from "idb";
import { XivAPi } from "./XivAPi";

export class MiqoDb {
	private xivApi: XivAPi;
	private idb: Promise<IDBPDatabase>;

	constructor() {
		this.xivApi = new XivAPi();
		this.idb = openDB("miqo", 2, {
			upgrade: (db, oldVersion, newVersion, transaction) => {
				if (oldVersion === 1) {
					db.deleteObjectStore("item");
					db.deleteObjectStore("recipe");
				}

				db.createObjectStore("item", {
					keyPath: "ID",
					autoIncrement: false,
				});
				db.createObjectStore("recipe", {
					keyPath: "ID",
					autoIncrement: false,
				});
			}
		});
	}

	public async getInfo() {
		let idb = await this.idb;

		return {
			size: {
				item: await idb.count("item"),
				recipe: await idb.count("recipe"),
			}
		}
	}

	public async getRecipeById(id: number): Promise<any> { return this.getContentById("recipe", id); }
	public async getRecipeByIds(ids: number[]): Promise<any[]> { return this.getContentByIds("recipe", ids); }
	public async getItemById(id: number): Promise<any> { return this.getContentById("item", id); }
	public async getItemByIds(ids: number[]): Promise<any[]> { return this.getContentByIds("item", ids); }

	private async getContentById(type: string, id: number): Promise<any> {
		let idb = await this.idb;

		let stored = await idb.get(type, id)
		if (stored == null) {
			stored = await this.xivApi.contentById(type, id);
			idb.put(type, stored);
		}
		return stored;
	}

	private async getContentByIds(type: string, ids: number[]): Promise<any[]> {
		let idb = await this.idb;
		let result = [];

		for (let id of ids) {
			let stored = await idb.get(type, id)
			if (stored == null) {
				stored = await this.xivApi.contentById(type, id);
				idb.put(type, stored);
			}
			result.push(stored);
		}

		return result;
	}
}

export const miqoDb = new MiqoDb();
