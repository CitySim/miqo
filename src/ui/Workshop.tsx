import React from "react";
import styled from "styled-components";
import { calculateItemValue } from "../lib";
import { configSlice, useAppDispatch, useAppSelector } from "../redux";

const WorkshopContainer = styled.div`
    border: 1px solid black;
    margin: 5px;
    float: left;
    width: 300px;
`;

interface WorkshopProps {
    /**
     * Which workshop, 0-2
     */
    index: number;
}

export const Workshop: React.FC<WorkshopProps> = function Workshop(props) {
    const config = useAppSelector(s => s.config)
    const dispatch = useAppDispatch()

    const workshop = props.index;
    let totalValue = 0;

    let offset = new Date(Date.UTC(2022, 8, 1, 8)).getHours();
    const queue = config.workshops[workshop].queue;

    const itemByHour = {};
    let itemByHourOffset = 0;
    queue.forEach(item => {
        itemByHour[itemByHourOffset] = item;
        itemByHourOffset += item.CraftingTime;
    })

    let previousItem;

    return <WorkshopContainer
        onClick={() => {
            dispatch(configSlice.actions.setActiveWorkshop(workshop));
        }}
        style={{
            background: config.activeWorkshop === workshop ? "lightgray" : undefined,
        }}
    >
        Workshop {workshop + 1}

        Rank
        <select
            value={config.workshops[workshop].rank}
        >
            <option value="0"></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>

        <table>
            <tbody>
                {Array(24).fill(1).map((_, hour) => {
                    const timeDisplay = (offset + hour) >= 24 ? `${offset + hour - 24}:00` : `${offset + hour}:00`
                    const item = itemByHour[hour];

                    let value = 0;
                    let efficiencyBonus = false;
                    if (item != null) {
                        [ value, efficiencyBonus ] = calculateItemValue({ workshop, item, previousItem })
                        totalValue += value;
                    }

                    const isLast = queue[queue.length - 1] === item

                    if (item != null) previousItem = item;

                    return <tr>
                        <td>{timeDisplay}</td>
                        {item != null ? (
                            <td rowSpan={item.CraftingTime} style={{ border: "1px solid black" }}>
                                <img src={`https://xivapi.com/${item.Item.IconHD}`} style={{ height: "1em" }}/>
                                {item.Item.Name}
                                {isLast ? (
                                    <button onClick={() => dispatch(configSlice.actions.removeFromQueue(workshop))}>
                                        x
                                    </button>
                                ) : ""}
                                <br/>
                                {item.Theme0?.Name ?? ""}{item.Theme1 != null ? " / " : ""}{item.Theme1?.Name ?? ""}<br/>
                                {efficiencyBonus ? "Efficiency Bonus!" : "No Bonus!"}<br/>
                                Value {value}
                            </td>
                        ) : ""}
                    </tr>
                })}
            </tbody>
        </table>

        Total Value: {totalValue}
        <button onClick={() => dispatch(configSlice.actions.clearQueue(workshop))}>clear</button>
    </WorkshopContainer>
}
