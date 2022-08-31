import React from "react";
import { AddItem } from "./AddItem";
import { Config } from "./Config";
import { Workshop } from "./Workshop";

export const AppRoot: React.FC = function AppRoot() {
    return <div style={{ display: "flex", flexFlow: "column", height: "100vh" }}>
        <div style={{ display: "flex", flexFlow: "row" }}>
            <Workshop index={0}/>
            <Workshop index={1}/>
            <Workshop index={2}/>
            <Config/>
        </div>
        <AddItem/>
    </div>
}