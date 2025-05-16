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

let toFind = 1930745883;

let startIndex = 25;
let checkLength = 25;
function solve(input) {
    let numbers = prepare(input);
    let prevs = [];
    for (let i = startIndex; i < numbers.length; i++){
        curNumber = numbers[i];
        let curSum = curNumber;
        let curNumbers = [];
        curNumbers.push(curNumber);
        let j = i - 1;
        while (curSum < toFind && i >= 0) {
            curSum += numbers[j];
            curNumbers.push(numbers[j]);
            if (curSum === toFind) {
                let min = Math.min(...curNumbers);
                let max = Math.max(...curNumbers);
                console.log('YO', i, j);
                console.log(min, max);
                console.log(min + max);
            }
            j--;
        }
        prevs.push(curNumber);
        if (prevs.length > checkLength) {
            prevs.shift();
        }
    }
}
