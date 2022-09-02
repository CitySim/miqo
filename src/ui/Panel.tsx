import styled from "styled-components";

const background = 7;
export function elevationColor(elevation: number, alpha?: number): string {
	const b = background + elevation * 4;
	const a = alpha == null ? "" : ` / ${alpha}`;
	return `hsl(0deg 0% ${b}%${a})`;
}

export const Panel = styled.div<{ elevation: number }>`
	display: flex;
	flex-flow: column nowrap;

	background-color: ${(p) => elevationColor(p.elevation)};
	border-radius: 4px;
	box-shadow: 2px 2px 8px ${(p) => elevationColor(p.elevation + 1, 0.5)};
	border: 1px solid ${(p) => elevationColor(p.elevation + 1)};
	padding: 8px;

	transition: background-color 0.3s;
`;

export const PanelHeader = styled.div<{ elevation: number }>`
	border-bottom: 1px solid ${(p) => elevationColor(p.elevation + 1)};
	padding-bottom: 2px;
	margin-top: -2px;
`;

export const PanelBody = styled.div<{ elevation: number }>`
	flex: 1;
	padding: 4px 0;
`;

export const PanelFooter = styled.div<{ elevation: number }>`
	border-top: 1px solid ${(p) => elevationColor(p.elevation + 1)};
	padding-top: 2px;
	margin-bottom: -2px;
`;
