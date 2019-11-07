import * as React from "react";
import { AppBar, Toolbar, Typography, makeStyles, Theme, createStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			paddingTop: 56,
		},
		title: {
			flexGrow: 1,
		},
	}),
);

export function ListDetailPage() {
	const classes = useStyles();

	return <div className={classes.root}>
		<AppBar color="default">
			<Toolbar>
				<Typography className={classes.title} variant="h6" noWrap>
					xxx
				</Typography>
			</Toolbar>
		</AppBar>
	</div>;
}
