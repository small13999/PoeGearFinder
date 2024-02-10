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

const itemSlots = ["Helmet", "Weapon", "Shield", "Amulet", "Ring 1", "Armor", "Boots", "Gloves", "Belt", "Ring 2"];
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
        value: 150,
        type: THRESHOLD
    },
    "Str": {
        value: 150,
        type: THRESHOLD
    },
    "Int": {
        value: 100,
        type: THRESHOLD
    },
    "Suppress": {
        value: 100,
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
        value: 75,
        type: THRESHOLD
    },
    "Cold Res": {
        value: 75,
        type: THRESHOLD
    },
    "Lightning Res": {
        value: 75,
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
                sum += parseInt(item[property]) / parseInt(modRangeMax[modInd]);
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

GenerateRandomGear(100);
const bestItems = getItemsWeightSum(items, weights, 0.9);
console.log(bestItems);

