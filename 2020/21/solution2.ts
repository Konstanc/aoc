declare var require: any
const fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});

type Food = {
    ings: string[];
    algs: string[];
};

function prepare(input: string) {
    let foods = input
        .split('\r\n')
        .map(line => {
            let parts = line.split(' (contains ');
            let ings = parts[0].split(' ');
            let algs = parts[1].substr(0, parts[1].length - 1).split(', ');
            return { ings, algs };
        })
    return foods;
}

function possibleForSearch(alg: string, ing: string, solution: { [key: string]: string; }, foods: Food[]) {
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

function getFreeIngs(foods: Food[]) {
    let possibleAlgyIngs = {};
    let allIngs = {};
    foods.forEach(food => {
        food.ings.forEach(ing => {
            allIngs[ing] = true;
            let isAlgy = food.algs.some(alg => {
                let solution = { [alg]: ing };
                return possibleForSearch(alg, ing, solution, foods);
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

function purgeFreeIngs(freeIngs: string[], sFoods: Food[]) {
    let foods = sFoods.map(({ ings, algs }) => ({ ings: ings.slice(), algs: algs.slice() }));
    foods.forEach(food => {
        food.ings = food.ings.filter(ing => !freeIngs.includes(ing));
    });
    return foods;
}

function possibleSearch(alg: string, ing: string, foods: Food[]) {
    let newFoods = foods.map(({ ings, algs }) => ({ ings: ings.slice(), algs: algs.slice() }));
    for (let i = 0; i < newFoods.length; i++) {
        let food = newFoods[i];
        let algIndex = food.algs.indexOf(alg);
        let ingIndex = food.ings.indexOf(ing);
        if (algIndex >= 0) {
            food.algs.splice(algIndex, 1);
            if (ingIndex < 0) {
                return false;
            }
        }
        if (ingIndex >= 0) {
            food.ings.splice(ingIndex, 1);
        }
    }
    return newFoods.filter(food => food.algs.length > 0);
}

function getSolution(curSolution: { ing: string, alg: string }[], foods: Food[]) {
    if (foods.length == 0) {
        return curSolution;
    }
    let food = foods[0];
    for (let j = 0; j < food.algs.length; j++) {
        let alg = food.algs[j]
        for (let k = 0; k < food.ings.length; k++) {
            let ing = food.ings[k];
            let ps = possibleSearch(alg, ing, foods);
            if (ps) {
                let nextSolution = curSolution.slice();
                nextSolution.push({ ing, alg });
                let solution = getSolution(nextSolution, ps);
                if (solution) {
                    return solution;
                }
            }
        }
    }
    return false;
}

function solve(input: string) {
    let foods = prepare(input);
    let freeIngs = getFreeIngs(foods);
    let dFood = purgeFreeIngs(freeIngs, foods);
    let solution = getSolution([],
        dFood.sort((a, b) => a.algs.length - b.algs.length));
    let res = solution.sort((a, b) => {
        if (a.alg < b.alg) { return -1; }
        if (a.alg > b.alg) { return 1; }
        return 0;
    })
        .map(({ ing }) => ing)
        .join(',');
    console.log(res);
}

