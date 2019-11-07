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

export function HomePage() {
	const classes = useStyles();

	return <div className={classes.root}>
		<AppBar color="default">
			<Toolbar>
				<Typography className={classes.title} variant="h6" noWrap>
					Database
				</Typography>
			</Toolbar>
		</AppBar>

		<List>
			<ListItem button component={Link} to={"/db/search?type=item"}>
				<ListItemText primary="Items"/>
			</ListItem>
		</List>
	</div>;
}
