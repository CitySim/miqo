import * as React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { SearchPage } from "./pages/SearchPage";
import { ItemPage } from "./pages/db/ItemPage";
import { CssBaseline } from "@material-ui/core";

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
		</Router>;
	}
}
