import * as React from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import { SearchPage } from "./pages/SearchPage";
import { ItemPage } from "./pages/db/ItemPage";
import { CssBaseline, BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import { Folder, Search } from "@material-ui/icons";

export class MiqoApp extends React.Component {
	constructor(props: {}) {
		super(props);
	}

	render() {
		return <Router>
			<CssBaseline/>
			<Switch>
				<Route exact path="/">
					Home
				</Route>
				<Route path="/search">
					<SearchPage/>
				</Route>
				<Route path="/db/Item/:id">
					<ItemPage/>
				</Route>
				<Route path="*">
					404
				</Route>
			</Switch>
			<BottomNavigation showLabels>
				<BottomNavigationAction component={Link} to={"/search"} label="Search" icon={<Search/>} />
				<BottomNavigationAction component={Link} to={"/db"} label="DB" icon={<Folder/>} />
			</BottomNavigation>
		</Router>;
	}
}
