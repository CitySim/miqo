import * as React from "react";
import { AppBar, Toolbar, Typography, makeStyles, Theme, createStyles, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "@material-ui/lab";
import { XivAPi, miqoDb } from "../../lib";

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

const content = [
	{ type: "item", id: 27227 },
	{ type: "item", id: 27228 },
	{ type: "item", id: 27229 },
	{ type: "item", id: 27230 },
	{ type: "item", id: 28477 },
	{ type: "item", id: 28478 },
	{ type: "item", id: 28479 },
	{ type: "item", id: 28480 },
	{ type: "item", id: 28481 },
];

interface Ingredient {
	amount: number;
	item: any;
}

function getIngredients(recipe: any): Ingredient[] {
	let result = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ].map(i => ({
		amount: recipe["AmountIngredient" + i],
		item: recipe["ItemIngredient" + i],
	}));

	return result.filter(i => i.amount > 0);
}

const xivApi = new XivAPi();

export function ListDetailPage() {
	const classes = useStyles();
	let [ items, setItems ] = useState<{ [id: string]: any }>({});
	let [ recipes, setRecipes ] = useState<any>({});
	let [ ingredients, setIngredients ] = useState<Ingredient[]>([]);

	useEffect(() => {
		async function loadItem(id: number): Promise<any> {
			let item = await miqoDb.getItemById(id);
			items = Object.assign(items, { [item.ID]: item });
			setItems(items);
			return item;
		}

		async function loadRecipe(item: any): Promise<any> {
			if (item.GameContentLinks && item.GameContentLinks.Recipe && item.GameContentLinks.Recipe.ItemResult) {
				let recipeId = item.GameContentLinks.Recipe.ItemResult[0];
				let recipe = await miqoDb.getRecipeById(recipeId);
				recipes = Object.assign(recipes, { [recipe.ID]: recipe });
				setRecipes(recipes);
				return recipe;
			} else {
				return undefined;
			}
		}

		async function loadIngredients(ingredient: Ingredient) {
			let { item } = ingredient;
			let recipe = await loadRecipe(item);
			// console.log("> " + item.Name, recipe)
			if (recipe == null) return;

			let newIngredients = getIngredients(recipe);
			for (let newIngredient of newIngredients) {
				newIngredient.item = await loadItem(newIngredient.item.ID as number);
				let oldOne = ingredients.find(i => i.item.ID === newIngredient.item.ID);
				if (oldOne) {
					// console.log("add: " + (ingredient.amount * newIngredient.amount) + " " + newIngredient.item.Name)
					oldOne.amount += ingredient.amount * newIngredient.amount;
				} else {
					// console.log("new: " + (ingredient.amount * newIngredient.amount) + " " + newIngredient.item.Name)
					ingredients.push({
						amount: ingredient.amount * newIngredient.amount,
						item: newIngredient.item
					});
				}
				await loadIngredients(newIngredient);
			}
			ingredients = Array.from(ingredients);
			setIngredients(ingredients);
		}

		async function load() {
			for (let entry of content) {
				let item = await loadItem(entry.id);
				if (item.ID) {
					items = Object.assign(items, { [item.ID]: item });
					setItems(items);

					await loadIngredients({
						amount: 1,
						item: item,
					});
					// console.log("-------------------------------------------")
				}
			}

		};

		load();
	}, [ content ]);

	return <div className={classes.root}>
		<AppBar color="default">
			<Toolbar>
				<Typography className={classes.title} variant="h6" noWrap>
					dummy list
				</Typography>
			</Toolbar>
		</AppBar>

		<List>
			{content.map(entry => {
				let item = items[entry.id];

				return <ListItem key={entry.id} button component={Link} to={"/db/item/" + entry.id}>
					<ListItemAvatar>
						{item ? (
							<Avatar variant="square" src={xivApi.host + item.Icon}/>
						) : (
							<Avatar variant="square"/>
						)}
					</ListItemAvatar>
					<ListItemText>
						{item ? item.Name : <Skeleton width="60%"/>}
					</ListItemText>
				</ListItem>;
			})}
		</List>


		<List>
			{ingredients.map(ingredient => {
				return <ListItem key={ingredient.item.ID} button component={Link} to={"/db/item/" + ingredient.item.ID}>
					<ListItemAvatar>
						<Avatar variant="square" src={xivApi.host + ingredient.item.Icon}/>
					</ListItemAvatar>
					<ListItemText>
						{ingredient.amount} {ingredient.item.Name}
					</ListItemText>
				</ListItem>;
			})}
		</List>
	</div>;
}
