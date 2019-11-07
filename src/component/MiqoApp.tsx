import * as React from "react";
import { HashRouter as Router, Switch, Route, Link, Redirect, useLocation } from "react-router-dom";
import { CssBaseline, BottomNavigation, BottomNavigationAction, makeStyles, Theme, createStyles, Typography } from "@material-ui/core";
import { Folder, Search } from "@material-ui/icons";
import { ThemeProvider } from "@material-ui/core/styles";

import * as Database from "./db";
import * as List from "./list";
import { darkTheme } from "./darkTheme";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		content: {
			// leave space for bottom navigation
			paddingBottom: 56,
		},
		bottomNavigation: {
			position: "fixed",
			left: 0,
			right: 0,
			bottom: 0,
		},
	}),
);

export function MiqoApp() {
	const classes = useStyles();

	return <ThemeProvider theme={darkTheme}>
		<Router>
			<CssBaseline/>
			<div className={classes.content}>
				<Switch>
					<Route exact path="/">
						<Redirect to="/db"/>
					</Route>
					<Route exact path="/db"><Database.HomePage/></Route>
					<Route exact path="/db/search"><Database.SearchPage/></Route>
					<Route exact path="/db/item/:id"><Database.ItemPage/></Route>
					<Route exact path="/list"><List.ListPage/></Route>
					<Route exact path="/list/:id"><List.ListDetailPage/></Route>
					<Route path="*">
						<Typography variant="h2">Not Found</Typography>
					</Route>
				</Switch>
			</div>

			<Navigation/>
		</Router>
	</ThemeProvider>;
}

function Navigation() {
	const classes = useStyles();
	const location = useLocation();

	let value = "";
	if (location.pathname === "/db/search") {
		value = "search";
	} else if (location.pathname.startsWith("/db")) {
		value = "db";
	} else if (location.pathname.startsWith("/list")) {
		value = "list";
	}

	return <BottomNavigation showLabels className={classes.bottomNavigation} value={value}>
		<BottomNavigationAction value="db" component={Link} to={"/db"} label="DB" icon={<Folder/>} />
		<BottomNavigationAction value="search" component={Link} to={"/db/search"} label="Search" icon={<Search/>} />
		<BottomNavigationAction value="list" component={Link} to={"/list"} label="Lists" icon={<Folder/>} />
	</BottomNavigation>;
}
