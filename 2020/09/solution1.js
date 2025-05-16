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

/* function findSum(prevs, val) {
    for (let i = 0; i < prevs.length; i++) {
        let sums = prevs.sums;
        for (let j = 0; j < sums.length; j++) {
            if (sums[j] == val) return true;
        }
    }
    return false;
}*/

function findSum(prevs, val) {
    for (let i = 0; i < prevs.length; i++) {
        for (let j = i + 1; j < prevs.length; j++) {
            if ((prevs[i] + prevs[j]) == val) {
                return true;
            }
        }
    }
    return false;
}


let startIndex = 25;
let checkLength = 25;
function solve(input) {
    let numbers = prepare(input);
    let prevs = [];
    for (let i = 0; i < numbers.length; i++){
        curNumber = numbers[i];
        if (i > startIndex) {
            if (!findSum(prevs, curNumber)) {
                console.log(i, curNumber, findSum(prevs, curNumber));
            }
        }
        /* let newSums = [];
        for (let j = Math.max(0, i - checkLength); j < i; j++){
            newSums.push(prevs[j].number + curNumber);
        }
        prevs.push({ number: curNumber, sums: newSums });
        */
        prevs.push(curNumber);
        if (prevs.length > checkLength) {
            prevs.shift();
        }
    }
}
