import * as React from "react";
import { XivAPi } from "../../../xivapi/XivAPi";
import { makeStyles, createStyles, Theme, AppBar, Toolbar, Typography, Card, Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { useParams, Link } from "react-router-dom";
import { IItem } from "../../../xivapi/Item";
import { useState } from "react";
import { Skeleton } from "@material-ui/lab";

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
	item?: IItem;
	recipe?: any;
}

export function ItemPage() {
	const xivApi = new XivAPi();
	const { id } = useParams();
	const classes = useStyles();
	const [ state, setState ] = useState<ItemPageState>({});

	React.useEffect(() => {
		if (state.item && state.item.Name) {
			document.title = state.item.Name;
		}
	});

	React.useEffect(() => {
		if (id) {
			xivApi.item(parseInt(id)).then(item => {
				setState({ item })
				if (item.GameContentLinks && item.GameContentLinks.Recipe && item.GameContentLinks.Recipe.ItemResult) {
					xivApi.recipe(item.GameContentLinks.Recipe.ItemResult[0]).then(recipe => {
						setState({ item, recipe })
					});
				}
			})
		}
	}, [ id ])

	return <div className={classes.root}>
		<AppBar color="default">
			<Toolbar>
				{state.item ? (
					<Avatar variant="rounded" src={xivApi.host + state.item.Icon}/>
				) : (
					<Avatar variant="rounded"/>
				)}
				<Typography className={classes.title} variant="h6" noWrap>
					{state.item ? state.item.Name : <Skeleton width="60%"/>}
				</Typography>
			</Toolbar>
		</AppBar>

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
								<Avatar variant="rounded" src={xivApi.host + state.recipe["ItemIngredient" + i].Icon}/>
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
