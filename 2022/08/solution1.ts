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
    let res = input
        .split('\n')
        .map(line => line
            .split('')
            .map(t => parseInt(t)));
    return res;
}

function calcTrees(trees: ReturnType<typeof prepare>) {
    let visible:boolean[][] = [];
    for (let i = 0; i < trees.length; i++) {       
        visible[i] = new Array(trees[0].length).fill(false);
    }
    ['x','']
}


function solve(input: string) {
    let trees = prepare(input);
    let res = calcTrees(trees);

    console.log(res);
}
