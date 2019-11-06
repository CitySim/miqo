import * as React from "react";
import { XivAPi } from "../../../xivapi/XivAPi";
import { makeStyles, createStyles, Theme, AppBar, Toolbar, Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";
import { IItem } from "../../../xivapi/Item";
import { useState } from "react";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		title: {
			flexGrow: 1,
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
	const [ state, setState ] = useState<ItemPageState>({
		loading: false,
	});

	React.useEffect(() => {
		if (state.item) {
			document.title = state.item.Name;
		}
	});

	if (id && !state.loading) {
		setState({ loading: true })
		xivApi.item(parseInt(id)).then(item => {
			setState({ loading: true, item })
		})
	}

	return <div>
		<AppBar color="default">
			<Toolbar>
				<Typography className={classes.title} variant="h6" noWrap>
					{state.item ? state.item.Name : <Skeleton width="60%"/>}
				</Typography>
			</Toolbar>
		</AppBar>
	</div>;
}
