const BACKGROUND_LIGHTNESS = 7;
export function elevationColor(elevation: number, alpha?: number): string {
	const b = BACKGROUND_LIGHTNESS + elevation * 4;
	const a = alpha == null ? "" : ` / ${alpha}`;
	return `hsl(0deg 0% ${b}%${a})`;
}
