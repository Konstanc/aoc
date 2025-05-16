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

function prepare(input: string) {
    let setup = input
        .split('')
        .map(c => parseInt(c))
    return setup;
}

function rotateTo(index: number, cups: number[]) {
    let l = cups.length;
    index = index % l;
    let newCups = cups.slice(index);
    newCups.push(...cups.slice(0, index));
    return newCups;
}

function findDestIndex(toFind: number, cups: number[]) {
    let min = Math.min(...cups);
    while (true) {
        let index = cups.indexOf(toFind);
        if (index >= 0) return index;
        toFind--;
        if (toFind < min) {
            toFind = Math.max(...cups);
        }
    }
}


function play(cur: number, cups: number[], moves: number) {
    let l = cups.length;
    for (let i = 0; i < moves; i++) {
        let curCup = cups[0];
        cups = rotateTo(cur + 1, cups);
        let picked = cups.splice(0, 3);
        let placeIndex = findDestIndex(curCup - 1, cups);
        cups.splice(placeIndex + 1, 0, ...picked);
        cur = 0;
    }
    return cups;
}


function solve(input: string) {
    let cups = prepare(input);
    let after = play(0, cups, 100);
    console.log(after.join(''));
}

