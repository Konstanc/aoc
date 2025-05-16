declare var require: any
const fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';

fs.readFile(fileName, 'utf8', function (err, input) {
    if (err) {
        return console.log(err);
    }
    solve(input);
});

function prepare(input: string) {
    let data = input
        .split(',').filter(line => line != '')
        .map(s => parseInt(s));
    return data;
}

function calcRes(data: ReturnType<typeof prepare>) {
    let ind: number[] = [];
    for (let j = 0; j < 9; j++) {
        ind.push(0);
    }
    for (let j = 0; j < data.length; j++) {
        ind[data[j]] = ind[data[j]] + 1;
    }
    for (let i = 0; i < 256; i++) {
        let newFishs = 0;
        let sixFishs = 0;
        for (let j = 0; j < ind.length; j++) {
            if (j == 0) {
                sixFishs = ind[j];
                newFishs = ind[j];
                ind[j] = 0;
            } else {
                ind[j - 1] = ind[j];
            }
        }

        ind[8] = newFishs;
        ind[6] = ind[6] + sixFishs;
    }
    return ind.reduce((acc, val) => acc + val, 0);
}


function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
}
