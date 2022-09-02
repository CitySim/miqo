import React from "react";
import { AddItem } from "./AddItem";
import { Config } from "./Config";
import { elevationColor } from "./Panel";
import { Workshop } from "./Workshop";

export const AppRoot: React.FC = function AppRoot() {
	const [config, setConfig] = React.useState(false);

	return (
		<>
			<div
				style={{
					width: "calc(100% + 32px)",
					backgroundColor: elevationColor(4),
					padding: "16px 32px",
					margin: "-16px -16px 16px -16px",
					zIndex: 999,
				}}
			>
				Miqo
				<button
					onClick={() => {
						setConfig(!config);
					}}
					style={{ float: "right" }}
				>
					Config & Info
				</button>
			</div>

			{config ? (
				<Config />
			) : (
				<div style={{ display: "flex", flexFlow: "column" }}>
					<Workshop />
					<AddItem />
				</div>
			)}
		</>
	);
};
