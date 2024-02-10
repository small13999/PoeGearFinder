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

GenerateRandomGear(10);
console.log(items);

