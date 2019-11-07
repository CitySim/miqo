import { createMuiTheme } from "@material-ui/core";

export const darkTheme = createMuiTheme({
	palette: {
		type: "dark",
		background: {
			default: "#121212",
			paper: "#121212",
		}
	},
	overrides: {
		MuiPaper: {
			elevation0: { background: "#121212" },
			elevation1: { background: "#1e1e1e" }, // 5%
			elevation2: { background: "#232323" }, // 7%
			elevation3: { background: "#252525" }, // 8%
			elevation4: { background: "#272727" }, // 9%
			elevation5: { background: "#272727" },
			elevation6: { background: "#2c2c2c" }, // 11%
			elevation7: { background: "#2c2c2c" },
			elevation8: { background: "#2f2f2f" }, // 12%
			elevation9: { background: "#2f2f2f" },
			elevation10: { background: "#2f2f2f" },
			elevation11: { background: "#2f2f2f" },
			elevation12: { background: "#333333" }, // 14%
			elevation13: { background: "#333333" },
			elevation14: { background: "#333333" },
			elevation15: { background: "#333333" },
			elevation16: { background: "#353535" }, // 15%
			elevation17: { background: "#353535" },
			elevation18: { background: "#353535" },
			elevation19: { background: "#353535" },
			elevation20: { background: "#353535" },
			elevation21: { background: "#353535" },
			elevation22: { background: "#353535" },
			elevation23: { background: "#353535" },
			elevation24: { background: "#383838" }, // 16%
		},
		MuiBottomNavigation: {
			root: {
				backgroundColor: "#2f2f2f",
			}
		}
	}
});
