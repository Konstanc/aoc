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
        .map(line => line.split(',')
            .map(range => range.split('-')
                .map(val => parseInt(val))
            )
        );
    return res;
}


function rangeOverlaps(top: number[], bottom: number[]) {
    return top[0] <= bottom[0] && top[1] >= bottom[0];
}

function rangeAnyOverlaps(a: number[], b: number[]) {
    return rangeOverlaps(a, b) || rangeOverlaps(b, a);
}


function calcIncludes(rangePairs: ReturnType<typeof prepare>) {
    let res = 0;
    rangePairs.forEach(pair =>{
        if(rangeAnyOverlaps(pair[0], pair[1])){
            res++;
        }
    })
    return res;
}


function solve(input: string) {
    let rangePairs = prepare(input);
    let res = calcIncludes(rangePairs);

    console.log(res);
}
