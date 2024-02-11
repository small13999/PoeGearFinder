const WEIGHT = 0;
const THRESHOLD = 1;
 
function randRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
 
function getRandomSubset(n, set) {
    ret = [];
    while (ret.length < n) {
        randElem = set[randRange(0, set.length)]
        if (!ret.includes(randElem)) {
            ret.push(randElem);
        }
    }
    return ret;
}
 
const itemSlots = ["Helmet", "Weapon", "Shield", "Amulet", "Ring", "Armor", "Boots", "Gloves", "Belt"];
const modTypes = ["Dex", "Str", "Int", "Health", "Suppress", "Damage", "Lightning Res", "Fire Res", "Cold Res", "Chaos Res"]
const modRangeMin = [20, 20, 20, 30, 4, 10, 15, 15, 15, 10];
const modRangeMax = [55, 55, 55, 100, 14, 40, 45, 45, 45, 35];
 
function GenerateRandomGear(itemCount, items) {
    for (let i = 0; i < itemCount; i++) {
 
    itemSlots.forEach((slot) => {
        const item = {};
        item["Slot"] = slot;
        const modCount = randRange(2, 7);
        const mods = getRandomSubset(modCount, modTypes);
        mods.forEach((mod) => {
            const modInd = modTypes.indexOf(mod);
            item[mod] = randRange(modRangeMin[modInd], modRangeMax[modInd] + 1);
        });
        items.push(item);
    });
 
    }
}
 
const weights = {
    "Dex": {
        value: 155,
        type: THRESHOLD
    },
    "Str": {
        value: 155,
        type: THRESHOLD
    },
    "Int": {
        value: 100,
        type: THRESHOLD
    },
    "Suppress": {
        value: 40,
        type: THRESHOLD
    },
    "Health": {
        value: 1.0,
        type: WEIGHT
    },
    "Damage": {
        value: 0.7,
        type: WEIGHT
    },
    "Fire Res": {
        value: 50,
        type: THRESHOLD
    },
    "Cold Res": {
        value: 50,
        type: THRESHOLD
    },
    "Lightning Res": {
        value: 50,
        type: THRESHOLD
    },
}
 
function getItemsWeightSum(items, weights, cutoff) {
    items.forEach(item => {
        let sum = 0;
        for (const property in weights) {
            if (!item[property]) {
                continue;
            }
            const modInd = modTypes.indexOf(property);
            if (weights[property].type === THRESHOLD) {
                //sum += parseInt(item[property]) / parseInt(modRangeMax[modInd]);
            } else {
                sum += parseInt(item[property]) / parseInt(modRangeMax[modInd]) * parseInt(weights[property].value);
            }
        }
        item["WeightSum"] = sum;
    })
 
    const maxWeightSum = Math.max(...items.map(o => o.WeightSum));
    const ret = [];
    items.forEach(item => {
        if (item["WeightSum"] > maxWeightSum * cutoff) {
            ret.push(item);
        }
    });
 
    return ret;
}
 
// total == true: both threshold and weight types, false: only weight 
function getItemWeight(item, weights, total) {
    let sum = 0;
    if (total) { // both threshold and weight type
        for (const property in item) {
            const modInd = modTypes.indexOf(property);
            if (!weights[property]) continue;
            if (weights[property].type === THRESHOLD) {
                if (!total) continue;
 
                sum += parseInt(item[property]) / parseInt(modRangeMax[modInd]);
            } else {
                sum += parseInt(item[property]) / parseInt(modRangeMax[modInd]) * parseInt(weights[property].value);
            }
        }
    }
 
    return sum;
}
 
const helmets = [], amulets = [], rings = [], weapons = [], shields = [], boots = [], belts = [], gloves = [], armors = [];
const gearMap = new Map();
gearMap.set("Helmet", helmets);
gearMap.set("Amulet", amulets);
gearMap.set("Ring", rings);
gearMap.set("Weapon", weapons);
gearMap.set("Shield", shields);
gearMap.set("Boots", boots);
gearMap.set("Belt", belts);
gearMap.set("Gloves", gloves);
gearMap.set("Armor", armors);
 
function sortItemsBySlot(items, gearMap) {
    items.forEach(item => {
        gearMap.get(item["Slot"]).push(item);
    })
}
 
function initSlotSets(gearMap) {
    let keysIterator = gearMap.keys();
    for (let key of keysIterator) {
        gearMap.get(key).length = 0;
    }
}
 
function checkItemSetForThresholds(set, weights) {
    for (const property in weights) {
        if (weights[property].type != THRESHOLD) continue;
 
        const sum = set.reduce((acc, item) => {
            return acc + (item[property] || 0);
        }, 0);
        if (sum < weights[property].value) return false;
    }
 
    return true;
}
 
function getItemSetWeightSum(set, weights) {
    let totalSum = 0;
    for (const property in weights) {
        if (weights[property].type != WEIGHT) continue;
 
        const modInd = modTypes.indexOf(property);
        const sum = set.reduce((acc, item) => {
            return acc + (parseInt(item[property] || 0) / parseInt(modRangeMax[modInd]) * parseInt(weights[property].value));
        }, 0);
 
 
        totalSum += sum;
    }
 
    return totalSum;
}
 
function bruteForceSolution(weights) {
    let maxWeight = 0;
    let bestSet = [];
    helmets.forEach(item1 => {
        amulets.forEach(item2 => {
            rings.forEach(item3 => {
                rings.forEach(item4 => {
                    if (item3 == item4) return;
                    weapons.forEach(item5 => {
                        shields.forEach(item6 => {
                            boots.forEach(item7 => {
                                gloves.forEach(item8 => {
                                    belts.forEach(item9 => {
                                        armors.forEach(item10 => {
                                            const itemSet = [item1, item2, item3, item4, item5, item6, item7, item8, item9, item10];
                                            if (!checkItemSetForThresholds(itemSet, weights)) return;
 
                                            const weight = getItemSetWeightSum(itemSet, weights);
                                            if (weight > maxWeight) {
                                                maxWeight = weight;
                                                bestSet = [];
                                                itemSet.forEach(item => bestSet.push(item));
                                            }
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
 
    return bestSet;
}
 
function printItemSetTotalStats(set, weights) {
    for (const property in weights) {
        const modInd = modTypes.indexOf(property);
        const sum = set.reduce((acc, item) => {
            return acc + (parseInt(item[property] || 0));
        }, 0);
        if (weights[property].type === THRESHOLD) {
            console.log(property, " requirement: ", weights[property].value, ", got: ", sum);
        } else {
            console.log("Total ", property, ": ", sum);
        }
    }
}
 
function initSlotsAndWeightsArr(slots, weights, arr) {
    slots.forEach(slot => {
        arr[slot] = [];
        for (const property in weights) {
            if (weights[property].type === THRESHOLD) {
                arr[slot][property] = [];
            }
        }
        arr[slot]["Weight"] = [];
        arr[slot]["TotalWeight"] = [];
    })
}
 
function sortItemsBySlotAndStats(items, weights, arr) {
    const weightStats = [];
    for (const property in weights) { // sort by every mod
        if (weights[property].type === WEIGHT) {
            weightStats.push(property);
            continue;
        }
 
        itemSlots.forEach(slot => {
            const slotItems = gearMap.get(slot);
            slotItems.forEach(item => {
                arr[slot][property].push(item);
            });
            arr[slot][property].sort((a, b) => (b[property] || 0) - (a[property] || 0));
        })
    }
 
    itemSlots.forEach(slot => { // sort by item weight and total weight per slot
        const slotItems = gearMap.get(slot);
        slotItems.forEach(item => {
            arr[slot]["Weight"].push(item);
            arr[slot]["TotalWeight"].push(item);
        })
        arr[slot]["Weight"].sort((a, b) => getItemWeight(b, weights, false) - getItemWeight(a, weights, false));
        arr[slot]["TotalWeight"].sort((a, b) => getItemWeight(b, weights, true) - getItemWeight(a, weights, true));
    });
}
 
function findGoodItemSet(sortedItems, weights) {
    const bestSet = [];
    // start with the highest total weight items
    for (const slot in sortedItems) {
        bestSet.push(sortedItems[slot]["TotalWeight"][0]);
    }
    return bestSet;
}
 
function testAlgorithms(algorithms, weights, itemCount, rounds) {
    console.log("------------------------------");
    console.log("   Start of algorithms test");
    console.log("------------------------------");
    algorithms.forEach(fn => {
        console.log("Testing algorithm: ", fn.name);
        let optimalTotalWeight = 0;
        let bestTotalWeight = 0;
        let bestIsOptimal = 0;
        let optimalMsRuntime = 0;
        let bestMsRuntime = 0;
        let invalidSets = 0;
        let noSolutions = 0;
        for (let i = 0; i < rounds; i++) {
            const items = [];
            GenerateRandomGear(itemCount, items);
 
            initSlotSets(gearMap);
            sortItemsBySlot(items, gearMap);
 
            const itemsSortedByStats = [];
            initSlotsAndWeightsArr(itemSlots, weights, itemsSortedByStats);
            sortItemsBySlotAndStats(items, weights, itemsSortedByStats);
 
            const timeBefore1 = new Date();
            const optimalSet = bruteForceSolution(weights);
            if (optimalSet == []) {
                noSolutions++;
                continue;
            }
            const timeAfter1 = new Date();
 
            const timeBefore2 = new Date();
            const bestSet = fn(itemsSortedByStats, weights);
            const valid = checkItemSetForThresholds(bestSet, weights);
            if (!valid) {
                invalidSets++;
                continue;
            }
            const timeAfter2 = new Date();
            optimalMsRuntime += timeAfter1.getTime() - timeBefore1.getTime();
            bestMsRuntime += timeAfter2.getTime() - timeBefore2.getTime();
 
            const optimalWeight = getItemSetWeightSum(optimalSet, weights);
            const bestWeight = getItemSetWeightSum(bestSet, weights);
            optimalTotalWeight += optimalWeight;
            bestTotalWeight += bestWeight;
            if (optimalWeight == bestWeight) bestIsOptimal++;
        }
 
        console.log("Test results:");
        const solvableRounds = rounds - noSolutions;
        if (solvableRounds == 0) {
            console.log("All ", rounds, " rounds were unsolvable");
            return;
        }
        const validRounds = solvableRounds - invalidSets;
        if (validRounds == 0) {
            console.log("No valid sets were found in", solvableRounds, "solvable rounds");
            return;
        }
        console.log("Number of solvable rounds: ", solvableRounds, "/", rounds);
        console.log("Found valid sets: ", validRounds, "/", solvableRounds);
        console.log("Found the best set: ", bestIsOptimal, "/", solvableRounds);
        console.log("");
        console.log("Average optimal set weight: 100");
        console.log("Average optimal set runtime: ", optimalMsRuntime / validRounds, " ms");
        console.log("");
        console.log("Average found set weight: ", bestTotalWeight / optimalTotalWeight * 100);
        console.log("Average found set runtime: ", bestMsRuntime / validRounds, " ms");
        console.log("-------------------------------------------");
    })
}
 
//const items = [];
//GenerateRandomGear(4, items);
//sortItemsBySlot(items, gearMap);
 
//const itemsSortedByStats = []; //3d array, arr[slot][stat] = sorted list of items of that slot and stat
//initSlotsAndWeightsArr(itemSlots, weights, itemsSortedByStats);
//sortItemsBySlotAndStats(items, weights, itemsSortedByStats);
//console.log(itemsSortedByStats);
 
//findGoodItemSet(itemsSortedByStats, weights);
 
//const bestSet = bruteForceSolution(weights);
//console.log(bestSet);
//printItemSetTotalStats(bestSet, weights);
 
const algorithms = [findGoodItemSet];
 
testAlgorithms(algorithms, weights, 4, 10);
