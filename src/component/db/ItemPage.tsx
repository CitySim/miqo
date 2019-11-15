import * as React from "react";
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { makeStyles, createStyles, Theme, AppBar, Toolbar, Typography, Card, Avatar, List, ListItem, ListItemAvatar, ListItemText, IconButton, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { Add, ExpandMore } from "@material-ui/icons";

import { miqoDb, XivAPi } from "../../lib";
import { AddToListDialog } from "../list";
import { lodestoneMap } from "../../loadstone";

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
		},
		heading: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightRegular,
		},
	}),
);

const xivApi = new XivAPi();
export function ItemPage() {
	const { id } = useParams();
	const classes = useStyles();

	const [ listAddOpen, setListAddOpen ] = React.useState(false);
	const [ item, setItem ] = useState();
	const [ recipe, setRecipe ] = useState();

	const lodestoneItem = React.useMemo(() =>
		lodestoneMap.find(i => i.i === parseInt(id || ""))
	, [ id ]);

	React.useEffect(() => {
		if (id == null) return;

		miqoDb.getItemById(parseInt(id)).then(item => {
			setItem(item)
			console.log("item", item)
			if (item.GameContentLinks && item.GameContentLinks.Recipe && item.GameContentLinks.Recipe.ItemResult) {
				miqoDb.getRecipeById(item.GameContentLinks.Recipe.ItemResult[0]).then(recipe => {
					setRecipe(recipe)
					console.log("recipe", recipe)
				});
			}
		});

		return () => {
			setItem(null);
			setRecipe(null);
		}
	}, [ id ])

	let iconUrl: string | undefined;
	if (lodestoneItem) {
		iconUrl = `https://img.finalfantasyxiv.com/lds/pc/global/images/itemicon/${lodestoneItem.n}.png`;
	} else if (item) {
		iconUrl = xivApi.host + item.Icon;
	}

	let links = [{
		label: "Garland",
		url: `http://garlandtools.org/db/#item/${id}`,
	}];
	if (lodestoneItem) {
		links.push({
			label: "Lodestone",
			url: `https://eu.finalfantasyxiv.com/lodestone/playguide/db/item/${lodestoneItem.l}/`,
		});
	}

	return <div className={classes.root}>
		<AppBar color="default">
			<Toolbar>
				<Typography className={classes.title} variant="h6" noWrap>
					{item ? item.Name : <Skeleton width="60%"/>}
				</Typography>
				<IconButton onClick={() => setListAddOpen(true)}>
					<Add/>
				</IconButton>
			</Toolbar>
		</AppBar>

		<AddToListDialog open={listAddOpen} onClose={() => setListAddOpen(false)}/>

		<Card className={classes.card}>
			{iconUrl ? (
				<Avatar style={{ width: 128, height: 128 }} variant="square" src={iconUrl}/>
			) : (
				<Avatar style={{ width: 128, height: 128 }} variant="square"/>
			)}

			{links.map(link => <React.Fragment key={link.url}>
				<a href={link.url} target="_blank">{link.label}</a><br/>
			</React.Fragment>)}

			CanBeHq: {item ? item.CanBeHq : ""}<br/>
			IsAdvancedMeldingPermitted: {item ? item.IsAdvancedMeldingPermitted : ""}<br/>
			IsCollectable: {item ? item.IsCollectable : ""}<br/>
			IsCrestWorthy: {item ? item.IsCrestWorthy : ""}<br/>
			IsDyeable: {item ? item.IsDyeable : ""}<br/>
			IsEquippable: {item ? item.IsEquippable : ""}<br/>
			IsIndisposable: {item ? item.IsIndisposable : ""}<br/>
			IsPvP: {item ? item.IsPvP : ""}<br/>
			IsUnique: {item ? item.IsUnique : ""}<br/>
			IsUntradable: {item ? item.IsUntradable : ""}<br/>
		</Card>

		{recipe ?
			<ExpansionPanel>
				<ExpansionPanelSummary expandIcon={<ExpandMore/>}>
					<Typography className={classes.heading}>{recipe.ClassJob.Name} ({recipe.ClassJob.Abbreviation})</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					AmountResult: {recipe.AmountResult}<br/>
					<List>
						{[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ].map(i => {
							if (recipe["AmountIngredient" + i]) {
								return <ListItem key={i} button component={Link} to={"/db/item/" + recipe["ItemIngredient" + i].ID}>
									<ListItemAvatar>
										<Avatar variant="square" src={xivApi.host + recipe["ItemIngredient" + i].Icon}/>
									</ListItemAvatar>
									<ListItemText>
										{recipe["AmountIngredient" + i]} {recipe["ItemIngredient" + i].Name}
									</ListItemText>
								</ListItem>;
							} else {
								return false;
							}
						})}
					</List>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		: false}
	</div>;
}
