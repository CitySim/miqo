import * as React from "react";
import { XivAPi, ISearchResult } from "../../xivapi/XivAPi";
import { List, ListItem, Avatar, ListItemAvatar, ListItemText, TextField, BottomNavigation } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

interface SearchPageState {
	term: string;
	search?: ISearchResult;
}

export class SearchPage extends React.Component<{}, SearchPageState> {
	xivApi = new XivAPi();

	constructor(props: {}) {
		super(props);
		this.state = {
			term: "magicked bed",
			search: undefined,
		};
	}

	componentDidMount() {
		this.search();
	}

	render() {
		return <>
			<TextField
				label="Search"
				margin="normal"
				variant="filled"
				value={this.state.term}
				onChange={this.onSearch.bind(this)}
			/>

			<List>
				{this.state.search && this.state.search.Results.map(result =>
					<ListItem key={result.Url} button component={Link} to={"/db" + result.Url}>
						<ListItemAvatar>
							<Avatar src={this.xivApi.host + result.Icon}/>
						</ListItemAvatar>
						<ListItemText primary={result.Name} secondary={result.UrlType}/>
					</ListItem>
				)}
			</List>
		</>;
	}

	onSearch(event: React.ChangeEvent<HTMLInputElement>): void {
		this.setState({
			term: event.target.value,
		});

		this.search();
	}

	private search() {
		this.xivApi.search(this.state.term).then((result) => {
			this.setState({
				search: result,
			});
		});
	}
}
