const fs = require('fs');
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});
function prepare(input) {
    let foods = input
        .split('\r\n')
        .map(line => {
        let parts = line.split(' (contains ');
        let ings = parts[0].split(' ');
        let algs = parts[1].substr(0, parts[1].length - 1).split(', ');
        return { ings, algs };
    });
    return foods;
}
/* function getFreeIngs(foods: Food[]) {
    let algList: string[] = [];
    foods.forEach(food => )
    let algIndex = {};
    let allIngs = {}
    let firstFood = foods[0];
    firstFood.algs.forEach(alg => {
        algIndex[alg] = {};
        firstFood.ings.forEach(ing => {
            allIngs[ing] = true;
            algIndex[alg][ing] = true;
        });
    });
    for (let i = 1; i < foods.length; i++) {
        let food = foods[i];
        food.algs.forEach(alg => {
            let oldIndex = algIndex[alg];
            if (!oldIndex) {
                oldIndex = {};
            }
            let newIndex = {};
            food.ings.forEach(ing => {
                allIngs[ing] = true;
                if (ing in oldIndex) {
                    newIndex[ing] = true;
                }
            });
            algIndex[alg] = newIndex;
        });
    }
    Object.values(algIndex).forEach(ingIndex => {
        Object.keys(ingIndex).forEach(ing => {
            if (ing in allIngs) {
                delete allIngs[ing];
            }
        });
    });
    return Object.keys(allIngs);
}*/
function possible(alg, ing, solution, foods) {
    let newFoods = foods.map(({ ings, algs }) => ({ ings: ings.slice(), algs: algs.slice() }));
    for (let i = 0; i < newFoods.length; i++) {
        let food = newFoods[i];
        let algIndex = food.algs.indexOf(alg);
        if (algIndex >= 0) {
            let ingIndex = food.ings.indexOf(ing);
            if (ingIndex < 0) {
                return false;
            }
            food.algs.splice(ingIndex, 1);
            food.ings.splice(ingIndex, 1);
        }
    }
    return true;
}
function getFreeIngs(foods) {
    let possibleAlgyIngs = {};
    let allIngs = {};
    foods.forEach(food => {
        food.ings.forEach(ing => {
            allIngs[ing] = true;
            let isAlgy = food.algs.some(alg => {
                let solution = { [alg]: ing };
                return possible(alg, ing, solution, foods);
            });
            if (isAlgy) {
                possibleAlgyIngs[ing] = true;
            }
        });
    });
    let freeIngs = Object.keys(allIngs)
        .filter(ing => !possibleAlgyIngs[ing]);
    return freeIngs;
}
function countIngs(list, foods) {
    let res = 0;
    foods.forEach(food => {
        list.forEach(ing => {
            if (food.ings.includes(ing)) {
                res++;
            }
        });
    });
    return res;
}
function solve(input) {
    let foods = prepare(input);
    let freeIngs = getFreeIngs(foods);
    let res = countIngs(freeIngs, foods);
    console.log(res);
}
//# sourceMappingURL=solution1.js.map