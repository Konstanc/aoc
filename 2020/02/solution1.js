fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});

function countLetters(pwd, letter) {
    return pwd
        .split('')
        .reduce((count, cur) => cur == letter ? count + 1 : count, 0);
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
            limit: { min: parseInt(limit[0]), max: parseInt(limit[1])},
            letter, pwd
        }));
    let res = ar
        .reduce((count, { limit, letter, pwd }) => {
            let letters = countLetters(pwd, letter);
            if (letters >= limit.min && letters <= limit.max) {
                return count + 1;
            }
            return count;
        }, 0);
    console.log(res);
}
