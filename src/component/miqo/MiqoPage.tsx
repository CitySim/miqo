import * as React from "react";
import { useEffect, useState } from "react";
import { miqoDb } from "../../lib";

export function MiqoPage() {
	let [ storage, setStorage ] = useState({ quota: 0, usage: 0 })
	useEffect(() => {
		navigator.storage.estimate().then(storage => {
			setStorage({
				quota: storage.quota || -1,
				usage: storage.usage || -1,
			})
		});
	}, [])

	let [ dbInfo, setDbInfo ] = useState({ size: { item: -1, recipe: -1 } })
	useEffect(() => {
		miqoDb.getInfo().then(info => {
			setDbInfo(info)
		});
	}, [])

	function formatBytes(value: number): string {
		let current = value;
		let units = [ "byte", "KiB", "MiB", "GiB", "TiB" ];
		for (let i = 0; i < units.length; i++) {
			if (Math.abs(current) < 1024) {
				return Math.round(current * 100) / 100 + " " + units[i];
			} else {
				current /= 1024;
			}
		}
		return Math.round(current * 100) / 100 + " " + units.slice(-1)[0];
	}

	return <>
		Using {formatBytes(storage.usage)} out of {formatBytes(storage.quota)} bytes.<br/>
		cache:<br/>
		<ul>
			<li>item: {dbInfo.size.item}</li>
			<li>recipe: {dbInfo.size.recipe}</li>
		</ul>
	</>
}
