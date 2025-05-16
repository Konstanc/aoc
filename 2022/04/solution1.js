const fs = require('fs');
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});
function prepare(input) {
    let res = input
        .split('\n')
        .map(line => line.split(',')
        .map(range => range.split('-')
        .map(val => parseInt(val))));
    return res;
}
function rangeIncludes(top, bottom) {
    return top[0] <= bottom[0] && top[1] >= bottom[1];
}
function rangeAnyIncludes(a, b) {
    return rangeIncludes(a, b) || rangeIncludes(b, a);
}
function calcIncludes(rangePairs) {
    let res = 0;
    rangePairs.forEach(pair => {
        if (rangeAnyIncludes(pair[0], pair[1])) {
            res++;
        }
    });
    return res;
}
function solve(input) {
    let rangePairs = prepare(input);
    let res = calcIncludes(rangePairs);
    console.log(res);
}
//# sourceMappingURL=solution1.js.map