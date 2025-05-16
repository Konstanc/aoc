fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example1.txt';
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

function solve(input) {
    let numbers = prepare(input);    
    numbers.sort((a, b) => a - b);
    let dif1 = 0;
    let dif3 = 0;
    let curJ = 0;
    for (let i = 0; i < numbers.length; i++){
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
    console.log(dif1, dif3, curJ);
}
