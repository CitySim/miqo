import React from "react";
import { Config } from "./Config";
import { elevationColor } from "./lib";
import { Workshop } from "./Workshop";

export const AppRoot: React.FC = function AppRoot() {
	const [config, setConfig] = React.useState(false);

	return (
		<>
			<div
				style={{
					width: "100%",
					backgroundColor: elevationColor(4),
					padding: "16px 32px",
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

			{config ? <Config /> : <Workshop />}
		</>
	);
};
