fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});

function checkValid(pwd, letter, first, second) {
    let count = 0;
    if (pwd[first - 1] == letter) count++;
    if (pwd[second - 1] == letter) count++;
    return count == 1;
}

function solve(input) {
    let ar = input.split('\r\n')
        .map(s => s.split(' '))
        .map(([sr, sl, pwd]) => ({
            limit: sr.split('-'),
            letter: sl[0],
            pwd
        }))
        .map(({ limit, letter, pwd }) => ({
            first: parseInt(limit[0]),
            second: parseInt(limit[1]),
            letter, pwd
        }));
    let res = ar
        .reduce((count, { first, second, letter, pwd }) => {
            let valid = checkValid(pwd, letter, first, second);
            if (valid) {
                return count + 1;
            }
            return count;
        }, 0);
    console.log(res);
}

// 649
