import { DataStore } from "./DataStore.js";

class App {
    constructor() {
        this.store = new DataStore()
        this.store.load().then(() => {
            this.render();
        });

        this.clearQueue = this.clearQueue.bind(this);
        this.removeFromQueue = this.removeFromQueue.bind(this);
        this.addToQueue = this.addToQueue.bind(this);
    }

    clearQueue(workshop) {
        this.store.config.workshops[workshop].queue = [];

        this.render();
    }

    removeFromQueue(workshop) {
        const queue = this.store.config.workshops[workshop].queue
        queue.splice(queue.length - 1, 1)
        
        this.render();
    }

    addToQueue(workshop, itemId) {
        const item = this.store.MJICraftworksObject.find(item => item.ID === itemId);
        if (item == null) return;
        this.store.config.workshops[workshop].queue.push(item)
        
        this.render();
    }

    render() {
        // render Workshops
        for (let i = 0; i < 3; i++) this.renderWorkshop(i)
        // render add item
        this.renderAddItem();
        // render Config
        this.renderConfig();
    }

    renderWorkshop(workshop) {
        const elWorkShop = document.getElementById(`workshop-${workshop}`)
        let totalValue = 0;

        function renderTable() {
            let offset = 10;
            let out = "";

            const queue = this.store.config.workshops[workshop].queue;
            const itemByHour = {};
            let itemByHourOffset = 0;
            queue.forEach(item => {
                itemByHour[itemByHourOffset] = item;
                itemByHourOffset += item.CraftingTime;
            })

            let previousItem;
            for (let hour = 0; hour < 24; hour++) {
                const timeDisplay = (offset + hour) >= 24 ? `${offset + hour - 24}:00` : `${offset + hour}:00`
                const item = itemByHour[hour];

                let value = 0;
                let efficiencyBonus = false;
                if (item != null) {
                    [ value, efficiencyBonus ] = this.calculateItemValue({ workshop, item, previousItem })
                    totalValue += value;
                }

                const isLast = queue[queue.length - 1] === item

                out += `
                    <tr>
                        <td>${timeDisplay}</td>
                        ${item != null? `
                            <td rowSPan="${item.CraftingTime}" style="border: 1px solid black;">
                                <img src="https://xivapi.com/${item.Item.IconHD}" style="height: 1em;"/>
                                ${item.Item.Name}
                                ${isLast ? `
                                    <button onClick="window.app.removeFromQueue(${workshop})">x</button>
                                ` : ""}
                                <br/>
                                ${item.Theme0?.Name ?? ""}${item.Theme1 != null ? " / " : ""}${item.Theme1?.Name ?? ""}<br/>
                                ${efficiencyBonus ? "Efficiency Bonus!" : "No Bonus!"}<br/>
                                Value ${value}
                            </td>
                        ` : ""}
                    </tr>
                `

                if (item != null) previousItem = item;
            }

            return `
                <table>
                    <tbody>
                        ${out}
                    </tbody>
                </table>

                Total Value: ${totalValue}
                <button onClick="window.app.clearQueue(${workshop})">clear</button>
            `;
        }

        elWorkShop.onclick = () => {
            document.querySelectorAll(".workshop").forEach(e => e.classList.remove("active"))
            elWorkShop.classList.add("active")

            this.addItemState = { workshop };
            this.render();
        }

        elWorkShop.innerHTML = `
            Workshop ${workshop + 1}
            Rank
            <select>
                <option value="0" ${this.store.config.workshops[0].rank === 0 ? "selected" : ""}></option>
                <option value="1" ${this.store.config.workshops[0].rank === 1 ? "selected" : ""}>1</option>
                <option value="2" ${this.store.config.workshops[0].rank === 2 ? "selected" : ""}>2</option>
                <option value="3" ${this.store.config.workshops[0].rank === 3 ? "selected" : ""}>3</option>
            </select>

            ${renderTable.bind(this)()}
        `;
    }

    renderAddItem() {
        const elAddItem = document.getElementById("add-item");
        if (this.addItemState == null) {
            elAddItem.innerHTML = "";
            return;
        }

        const workshop = this.addItemState.workshop;
        const queue = this.store.config.workshops[workshop].queue;
        const previousItem = queue[queue.length - 1]

        const [ goodItems ] = this.findItems(workshop);
        goodItems.sort((a, b) => {
            const [ valueA ] = this.calculateItemValue({ workshop, item: a, previousItem });
            const [ valueB ] = this.calculateItemValue({ workshop, item: b, previousItem });

            return (valueB / b.CraftingTime) - (valueA / a.CraftingTime);
        })

        const popName = {
            1: "Very High",
            2: "High",
            3: "Average",
            4: "Low",
        }

        elAddItem.innerHTML = `
            <table border="1">
                <thead>
                    <tr>
                    <th>Item</th>
                    <th>Theme</th>
                    <th>Theme</th>
                    <th>Efficiency</th>
                    <th>Time</th>
                    <th>Popularity</th>
                    <th>Base Value</th>
                    <th>Final Value</th>
                    <th>Value / Hour (v)</th>
                    </tr>
                </thead>
                <tbody>
                    ${goodItems.map(item => {
                        const [ value, efficiencyBonus ] = this.calculateItemValue({ workshop, item, previousItem });
                        const pop = this.store.MJICraftWorksPopularity[this.store.config.popularity][item.ID];

                        return `
                            <tr onClick="window.app.addToQueue(${workshop}, ${item.ID})">
                                <td>
                                    <img src="https://xivapi.com/${item.Item.IconHD}" style="height: 1em;"/>
                                    ${item.Item.Name}
                                </td>
                                <td>
                                    ${item.Theme0?.Name ?? ""}
                                </td>
                                <td>
                                    ${item.Theme1?.Name ?? ""}
                                </td>
                                <td>
                                    ${efficiencyBonus ? "yes" : "no"}
                                </td>
                                <td>
                                    ${item.CraftingTime}h
                                </td>
                                <td>
                                    ${popName[pop] ?? pop}
                                </td>
                                <td>
                                    ${item.Value}
                                </td>
                                <td>
                                    ${value}
                                </td>
                                <td>
                                    ${(value / item.CraftingTime).toFixed(2)}
                                </td>
                            </tr>
                        `
                    }).join("")}
                </tbody>
            </table>
        `;
    }
    
    renderConfig() {
        const elConfig = document.getElementById("config");

        function renderSelect(index) {
            const select = document.createElement("select")
            select.onchange = (e) => {
                this.store.config.veryHighItems[index] = parseInt(e.target.value);
                this.render()
            }

            select.innerHTML = `
                <option value="0"></option>
                ${this.store.MJICraftworksObject.filter(i => i.Item != null).map(item => {
                    return `
                        <option value="${item.ID}" ${this.store.config.veryHighItems[index] === item.ID ? "selected" : ""}>${item.Item.Name}</option>
                    `
                }).join("")}
            `

            return select;
        }

        elConfig.innerHTML = `
            Very High Items:<br/>
            Select several of your "Very High" popularity item until there is only one match left.
        `;

        elConfig.append(renderSelect.bind(this)(0));
        elConfig.append(renderSelect.bind(this)(1));
        elConfig.append(renderSelect.bind(this)(2));
        elConfig.append(renderSelect.bind(this)(3));
        elConfig.append(renderSelect.bind(this)(4));

        const matrixList = Object.entries(this.store.MJICraftWorksPopularity).filter(([ index, popMatrix ]) => {
            return this.store.config.veryHighItems.every(item => item === 0 || item == null || popMatrix[item] === 1)
        })
        console.log(matrixList)
        elConfig.append(`matches ${matrixList.length}`);

        const extraDiv = document.createElement("div")
        extraDiv.innerHTML = `
            <hr>
            <a href="https://github.com/CitySim/miqo" target="_blank">GitHub</a><br/>

            <ul>
                <li>this entire thing is a bit of a mess right now :)</li>
                <li>assumes you have a rank 10 island, and rank 3 workshops</li>
                <li>supply is entirely ignored currently</li>
                <li>groove is also missing at the moment</li>
                <li>thanks to this <a href="https://docs.google.com/spreadsheets/d/1e5dyaHSt5lj25l3nFWO5QcPmAJ2aAoPxCWj-iZnKxRk/edit#gid=1283864903" target="_blank">sheet</a> for the value formula</a>
            </ul>
        `
        elConfig.append(extraDiv)

        if (matrixList.length === 1) {
            const newPop = parseInt(matrixList[0]);
            if (this.store.config.popularity !== newPop) {
                this.store.config.popularity = parseInt(matrixList[0]);
                this.render();
            }
        }
    }

    findItems(workshop) {
        const activeThemes = [];
        let freeHours = 24;
        
        const workshopData = this.store.config.workshops[workshop];
        if (workshopData.queue.length > 0) {
            const lastItem = workshopData.queue[workshopData.queue.length - 1];
            if (lastItem.Theme0TargetID !== 0) activeThemes.push(lastItem.Theme0TargetID);
            if (lastItem.Theme1TargetID !== 0) activeThemes.push(lastItem.Theme1TargetID);

            freeHours = 24 - workshopData.queue.reduce((sum, item) => sum + item.CraftingTime, 0);
        }

        const goodItems = [];
        const badItems = [];

        this.store.MJICraftworksObject.forEach(item => {
            if (item.Item == null) return;

            // console.log(item.Item.Name, item.Theme0TargetID, item.Theme1TargetID, item.CraftingTime);

            if (
                activeThemes.length > 0
                && (item.Theme0TargetID === 0 || activeThemes.includes(item.Theme0TargetID) === false)
                && (item.Theme1TargetID === 0 || activeThemes.includes(item.Theme1TargetID) === false)
            ) {
                badItems.push(item);
                return
            }
            if (freeHours < item.CraftingTime) {
                badItems.push(item);
                return
            }
            
            goodItems.push(item);
        })

        return [ goodItems, badItems ]
    }

    calculateItemValue({ workshop, item, previousItem }) {
        // efficiency bonus
        const hasEfficiencyBonus = item.ID !== previousItem?.ID && (
            item.Theme0TargetID === previousItem?.Theme0TargetID || item.Theme0TargetID === previousItem?.Theme1TargetID
            || item.Theme1TargetID === previousItem?.Theme0TargetID || item.Theme1TargetID === previousItem?.Theme1TargetID
        )
        const efficiencyBonus = hasEfficiencyBonus === true ? 2 : 1;
        // pop
        const pop = this.store.MJICraftWorksPopularity[this.store.config.popularity][item.ID];
        const popularityMod = this.store.MJICraftWorksPopularityType[pop] / 100;
        // supply
        const supplyMod = this.store.MJICraftWorksSupplyDefine[2].factor / 100;
        // workshop rank
        const workshopRank = this.store.config.workshops[workshop].rank;
        const workshopRankMod = this.store.MJICraftWorksRankRatio[workshopRank] / 100;
        // groove
        const groove = 0;
        
        return [
            efficiencyBonus * Math.floor(popularityMod * supplyMod * Math.floor(item.Value * workshopRankMod * (1 + groove / 100))),
            hasEfficiencyBonus,
        ];
    }
}

window.app = new App();