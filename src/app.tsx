import React from "react";
import ReactDOM from "react-dom/client";
import { AppRoot } from "./ui/AppRoot";
import { Provider } from "react-redux";
import { store } from "./redux";
import { xivSlice } from "./redux/xivSlice";

const root = ReactDOM.createRoot(document.getElementById("app-root"));
root.render(<Provider store={store}><AppRoot/></Provider>);

fetch("https://xivapi.com/MJICraftworksObject?columns=*")
    .then(res => res.json())
    .then(res => store.dispatch(xivSlice.actions.setMJICraftworksObject(res.Results)));
