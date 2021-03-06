import * as React from "react";
import { XivAPi, XivApiSearchResult } from "../../lib";
import { List, ListItem, Avatar, ListItemAvatar, ListItemText, TextField, AppBar, Toolbar, Typography, makeStyles, Theme, createStyles, IconButton, Dialog, Divider, Button, Slide } from "@material-ui/core";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FilterList, Close } from "@material-ui/icons";
import { TransitionProps } from "@material-ui/core/transitions";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			paddingTop: 56,
		},
		title: {
			flexGrow: 1,
		},
		searchInput: {
			borderRadius: 0,
			width: "100%",
		}
	}),
);

function useQuery() {
	return new URLSearchParams(useLocation().search);
}

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export function SearchPage() {
	const classes = useStyles();
	const history = useHistory();
	const query = useQuery();
	const xivApi = new XivAPi();

	const term = query.get("term") || "";
	const [ search, setSearch ] = useState<XivApiSearchResult>();
	const [ open, setOpen ] = useState(false);

	useEffect(() => {
		xivApi.search({
			indexes: [ "item" ],
			string: term,
		}).then((result) => {
			setSearch(result);
		});
	}, [ term ])

	return <div className={classes.root}>
		<AppBar color="default">
			<Toolbar>
				<Typography className={classes.title} variant="h6" noWrap>
					Search
				</Typography>
				<IconButton onClick={() => setOpen(true)}>
					<FilterList/>
				</IconButton>
			</Toolbar>
		</AppBar>

		<TextField
			autoFocus
			label="Term"
			variant="filled"
			className={classes.searchInput}
			value={term}
			onChange={(e) => {
				let newTerm = e.target.value;
				history.replace(`/db/search?term=${newTerm}`);
			}}
		/>

		<Dialog fullScreen open={open} onClose={() => setOpen(false)} TransitionComponent={Transition}>
			<AppBar position="relative">
				<Toolbar>
					<IconButton edge="start" color="inherit" onClick={() => setOpen(false)} aria-label="close">
						<Close/>
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						Filter
					</Typography>
					<Button autoFocus color="inherit" onClick={() => setOpen(false)}>
						save
					</Button>
				</Toolbar>
			</AppBar>
			<List>
				<ListItem button>
					<ListItemText primary="Nothing here" secondary="empty" />
				</ListItem>
				<Divider/>
				<ListItem button>
					<ListItemText primary="Nothing here" secondary="empty" />
				</ListItem>
			</List>
		</Dialog>

		<List>
			{search && search.Results.map(result =>
				<ListItem key={result.Url} button component={Link} to={"/db" + result.Url}>
					<ListItemAvatar>
						<Avatar variant="square" src={xivApi.host + result.Icon}/>
					</ListItemAvatar>
					<ListItemText primary={result.Name} secondary={result.UrlType}/>
				</ListItem>
			)}
		</List>
	</div>;
}
