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

function possible(alg: string, ing: string, solution: { [key: string]: string; }, foods: Food[]) {
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

function countIngs(list: string[],foods:Food[]) {
    let res = 0;
    foods.forEach(food => { 
        list.forEach(ing => { 
            if (food.ings.includes(ing)) {
                res++;
            }
        })
    });
    return res;
}

function solve(input: string) {
    let foods = prepare(input);
    let freeIngs = getFreeIngs(foods);
    let res = countIngs(freeIngs, foods);
    console.log(res);
}

