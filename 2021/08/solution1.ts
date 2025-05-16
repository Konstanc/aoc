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
        .split('\n').filter(line => line != '')
        .map(s => s.split(' | ')
            .map(ss => ss.split(' ').filter(line => line != '')
                .map(ss => ss.split('')
                )
            ));
    return data;
}

const voc = {
    1: 2,
    4: 4,
    7: 3,
    8: 7
}

const iVoc = {
    2: 1,
    4: 4,
    3: 7,
    7: 8
}

function calcRes(data: ReturnType<typeof prepare>) {
    let res = 0;
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i][1].length; j++) {
            if (iVoc[data[i][1][j].length]) {
                res++;
            }
        }
    }
    return res;
}


function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
}
