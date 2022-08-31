import React from "react";
import { useAppSelector } from "../redux";

export interface ItemSelectProps {
	value: number;
	onChange: (value: number) => void;
}

export const ItemSelect: React.FC<ItemSelectProps> = function ItemSelect(props) {
	const MJICraftworksObject = useAppSelector((s) => s.xiv.MJICraftworksObject);
	const items = MJICraftworksObject.filter((i) => i.Item != null);

	return (
		<select
			value={props.value}
			onChange={(e) => {
				props.onChange(parseInt(e.target.value));
			}}
		>
			<option value="0"></option>
			{items.map((item) => (
				<option value={item.ID}>{item.Item.Name}</option>
			))}
		</select>
	);
};
