import * as React from "react";
import { List, ListItem, ListItemText, AppBar, Toolbar, Typography, makeStyles, Theme, createStyles } from "@material-ui/core";
import { Link } from "react-router-dom";

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

export function ListPage() {
	const classes = useStyles();

	return <div className={classes.root}>
		<AppBar color="default">
			<Toolbar>
				<Typography className={classes.title} variant="h6" noWrap>
					Lists
				</Typography>
			</Toolbar>
		</AppBar>

		<List>
			<ListItem button component={Link} to={"/list/1"}>
				<ListItemText primary="dummy list"/>
			</ListItem>
		</List>
	</div>;
}
