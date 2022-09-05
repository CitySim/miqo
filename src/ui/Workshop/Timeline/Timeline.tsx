import { WorkshopCalculation } from "../../../lib";
import { TimelineItem } from "./TImelineItem";

export interface TimelineProps {
	/**
	 * Which workshop, 0-2
	 */
	index: number;
	workshopCalculation: WorkshopCalculation;
	elevation: number;
}

export const Timeline: React.FC<TimelineProps> = function Timeline(props) {
	const workshop = props.index;
	const hours = props.workshopCalculation.hours;

	let offset = new Date(Date.UTC(2022, 8, 1, 8)).getHours();

	return (
		<table style={{ width: "100%" }}>
			<tbody>
				<tr>
					<td></td>
					<td></td>
				</tr>
				{Array(24)
					.fill(1)
					.map((_, hour) => {
						const timeDisplay = offset + hour >= 24 ? `${offset + hour - 24}:00` : `${offset + hour}:00`;
						const calculation = hours[hour].calculations[workshop];

						return (
							<tr key={hour}>
								<td style={{ height: 27, width: 45, textAlign: "right" }}>{timeDisplay}</td>
								{calculation != null ? (
									<td rowSpan={calculation.item.CraftingTime} style={{ height: 27 * calculation.item.CraftingTime }}>
										<TimelineItem calculation={calculation} workshop={workshop} elevation={props.elevation} />
									</td>
								) : (
									""
								)}
							</tr>
						);
					})}
			</tbody>
		</table>
	);
};
