fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});

function prepare(input) {
    let numbers = [];
    let ar = input
        .split('\r\n')
        .map(s => parseInt(s));
    return ar;
}

let chains = [];
function calcVar(numbers, i, curV, maxJ) {
    let newCurV = numbers[i];    
    if (i >= numbers.length) return 0;
    if ((newCurV - curV) > 3) return 0;
    if (i == numbers.length - 1) {
        // chains.push(chain);
        return 1;   
    }
    // let newChain = Array.from(chain);
    // newChain.push(numbers[i]);    
    let res = 0;
    for (let j = 1; j <= 3; j++){
        res += calcVar(numbers, i + j, newCurV, maxJ);
    }
    return res;
}

function solve(input) {
    let numbers = prepare(input);
    numbers.sort((a, b) => a - b);
    let dif1 = 0;
    let dif3 = 0;
    let curJ = 0;
    for (let i = 0; i < numbers.length; i++) {
        let dif = numbers[i] - curJ;
        if (dif == 1) {
            dif1++;
        } else if (dif == 3) {
            dif3++;
        } else {
            console.log('wrong dif', dif);
        }
        curJ = numbers[i];
    }
    let maxJ = curJ;
    console.log(dif1, dif3, curJ);
    numbers.unshift(0);
    let res = calcVar(numbers, 0, 0, maxJ);
    console.log('res', res);
}
