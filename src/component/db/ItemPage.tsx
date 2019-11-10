import * as React from "react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { makeStyles, createStyles, Theme, AppBar, Toolbar, Typography, Card, Avatar, List, ListItem, ListItemAvatar, ListItemText, IconButton } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Add } from "@material-ui/icons";

import { miqoDb, XivAPi } from "../../lib";
import { AddToListDialog } from "../list";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			paddingTop: 56,
		},
		title: {
			flexGrow: 1,
		},
		card: {
			margin: theme.spacing(1),
			padding: theme.spacing(1),
		}
	}),
);

interface ItemPageState {
	item?: any;
	recipe?: any;
}

const xivApi = new XivAPi();
export function ItemPage() {
	const { id } = useParams();
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);
	const [ state, setState ] = useState<ItemPageState>({});

	React.useEffect(() => {
		if (state.item && state.item.Name) {
			document.title = state.item.Name;
		}
	});

	React.useEffect(() => {
		if (id == null) return;

		miqoDb.getItemById(parseInt(id)).then(item => {
			setState({ item })
			if (item.GameContentLinks && item.GameContentLinks.Recipe && item.GameContentLinks.Recipe.ItemResult) {
				miqoDb.getRecipeById(item.GameContentLinks.Recipe.ItemResult[0]).then(recipe => {
					setState({ item, recipe })
				});
			}
		});
	}, [ id ])

	return <div className={classes.root}>
		<AppBar color="default">
			<Toolbar>
				{state.item ? (
					<Avatar variant="square" src={xivApi.host + state.item.Icon}/>
				) : (
					<Avatar variant="square"/>
				)}
				<Typography className={classes.title} variant="h6" noWrap>
					{state.item ? state.item.Name : <Skeleton width="60%"/>}
				</Typography>
				<IconButton onClick={() => setOpen(true)}>
					<Add/>
				</IconButton>
			</Toolbar>
		</AppBar>

		<AddToListDialog open={open} onClose={() => setOpen(false)}/>

		<Card className={classes.card}>
			CanBeHq: {state.item ? state.item.CanBeHq : ""}<br/>
			IsAdvancedMeldingPermitted: {state.item ? state.item.IsAdvancedMeldingPermitted : ""}<br/>
			IsCollectable: {state.item ? state.item.IsCollectable : ""}<br/>
			IsCrestWorthy: {state.item ? state.item.IsCrestWorthy : ""}<br/>
			IsDyeable: {state.item ? state.item.IsDyeable : ""}<br/>
			IsEquippable: {state.item ? state.item.IsEquippable : ""}<br/>
			IsIndisposable: {state.item ? state.item.IsIndisposable : ""}<br/>
			IsPvP: {state.item ? state.item.IsPvP : ""}<br/>
			IsUnique: {state.item ? state.item.IsUnique : ""}<br/>
			IsUntradable: {state.item ? state.item.IsUntradable : ""}<br/>
		</Card>

		{state.recipe ? <Card className={classes.card}>
			{state.recipe.ClassJob.Name} ({state.recipe.ClassJob.Abbreviation})<br/>
			AmountResult: {state.recipe.AmountResult}<br/>

			<List>
				{[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ].map(i => {
					if (state.recipe["AmountIngredient" + i]) {
						return <ListItem key={i} button component={Link} to={"/db/item/" + state.recipe["ItemIngredient" + i].ID}>
							<ListItemAvatar>
								<Avatar variant="square" src={xivApi.host + state.recipe["ItemIngredient" + i].Icon}/>
							</ListItemAvatar>
							<ListItemText>
								{state.recipe["AmountIngredient" + i]} {state.recipe["ItemIngredient" + i].Name}
							</ListItemText>
						</ListItem>;
					} else {
						return false;
					}
				})}
			</List>
		</Card> : ""}
	</div>;
}
