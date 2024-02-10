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

const items = [];

function GenerateRandomGear(itemCount) {
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
    console.log("hi")
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

GenerateRandomGear(4);
sortItemsBySlot(items, gearMap);
const bestSet = bruteForceSolution(weights);
console.log(bestSet);
printItemSetTotalStats(bestSet, weights);


