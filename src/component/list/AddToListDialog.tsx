import * as React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, ListItem, List, ListItemText, makeStyles, createStyles, Theme, Snackbar } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		snackbar: {
			[theme.breakpoints.down('xs')]: {
				bottom: 64,
			},
		},
	})
);

export interface AddToListDialogProps {
	open: boolean;
	onClose: () => void;
}

export function AddToListDialog(props: AddToListDialogProps) {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);

	return <>
		<Dialog scroll="paper" fullWidth open={props.open} onClose={props.onClose}>
			<DialogTitle>Add To List</DialogTitle>
			<DialogContent dividers style={{ padding: 0 }}>
				<List disablePadding>
					<ListItem button onClick={() => {
						setOpen(true);
						props.onClose();
					}}><ListItemText primary="dummy list"/></ListItem>
				</List>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.onClose} color="primary">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>

		<Snackbar
			open={open}
			className={classes.snackbar}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			autoHideDuration={6000}
			onClose={() => setOpen(false)}
			message={<span id="message-id">added to "dummy list"</span>}
			action={[
				<Button key="open" color="secondary" size="small" onClick={() => setOpen(false)} component={Link} to="/list/1">
					OPEN
				</Button>,
				<Button key="undo" color="secondary" size="small" onClick={() => setOpen(false)}>
					UNDO
				</Button>,
			]}
		/>
	</>;
}
