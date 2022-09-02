import styled from "styled-components";
import { MJIItemPouch } from "../redux";

const materialGranary = [
	27, // Island Alyssum
	28, // Raw Island Garnet
	29, // Island Spruce Log
	30, // Island Hammerhead
	31, // Island Silver Ore
];

const Label = styled.span`
	background-color: #646464;
	color: white;
	border-radius: 5px;
	padding: 1px 4px;
`;

export const Material: React.FC<{ item: MJIItemPouch }> = function (props) {
	const { item } = props;

	return (
		<>
			<img src={`https://xivapi.com/${item.Item.Icon}`} style={{ height: "1em" }} />
			&nbsp;
			{materialGranary.includes(item.ID) ? <Label>G</Label> : null}
			{item?.Category.ID === 4 ? <Label>P</Label> : null}
			{item?.Category.ID === 5 ? <Label>L</Label> : null}
			&nbsp;
			{item.Item.Name ?? null}
		</>
	);
};
