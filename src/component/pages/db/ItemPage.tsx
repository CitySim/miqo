import * as React from "react";
import { XivAPi, ISearchResult } from "../../../xivapi/XivAPi";
import { makeStyles, createStyles, Theme, AppBar, Toolbar, IconButton, Typography, InputBase, CircularProgress } from "@material-ui/core";
import { fade } from "@material-ui/core/styles";
import { Menu, Search } from "@material-ui/icons";
import { useParams } from "react-router-dom";
import { IItem } from "../../../xivapi/Item";
import { useState } from "react";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		title: {
			flexGrow: 1,
			display: 'none',
			[theme.breakpoints.up('sm')]: {
				display: 'block',
			},
		},
		search: {
			position: 'relative',
			borderRadius: theme.shape.borderRadius,
			backgroundColor: fade(theme.palette.common.white, 0.15),
			'&:hover': {
				backgroundColor: fade(theme.palette.common.white, 0.25),
			},
			marginLeft: 0,
			width: '100%',
			[theme.breakpoints.up('sm')]: {
				marginLeft: theme.spacing(1),
				width: 'auto',
			},
		},
		searchIcon: {
			width: theme.spacing(7),
			height: '100%',
			position: 'absolute',
			pointerEvents: 'none',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		inputRoot: {
			color: 'inherit',
		},
		inputInput: {
			padding: theme.spacing(1, 1, 1, 7),
			transition: theme.transitions.create('width'),
			width: '100%',
			[theme.breakpoints.up('sm')]: {
				width: 120,
				'&:focus': {
				width: 200,
				},
			},
		},
	}),
);

interface ItemPageState {
	loading: boolean;
	item?: IItem;
}

export function ItemPage() {
	const xivApi = new XivAPi();
	const { id } = useParams();
	const classes = useStyles();
	const [ state, setState ] = useState({
		loading: false,
	} as ItemPageState);

	if (id && !state.loading) {
		setState({ loading: true })
		xivApi.item(parseInt(id)).then(item => {
			setState({ loading: true, item })
		})
	}

	return <div className={classes.root}>
		<AppBar position="static">
			<Toolbar>
				<IconButton
					edge="start"
					className={classes.menuButton}
					color="inherit"
					aria-label="open drawer"
				>
					<Menu/>
				</IconButton>
				<Typography className={classes.title} variant="h6" noWrap>
					{state.item ? (
						state.item.Name
					) : (
						<Skeleton width="60%" />
					)}
				</Typography>
				<div className={classes.search}>
					<div className={classes.searchIcon}>
						<Search/>
					</div>
					<InputBase
						placeholder="Search…"
						classes={{
							root: classes.inputRoot,
							input: classes.inputInput,
						}}
						inputProps={{ 'aria-label': 'search' }}
					/>
				</div>
			</Toolbar>
		</AppBar>
	</div>;
}
