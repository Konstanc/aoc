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
    let bags = [];
    let curBag = [];
    bags.push(curBag);
    input
        .split('\n')
        .forEach(line => {
        let lineVal = parseInt(line);
        if (isNaN(lineVal)) {
            curBag = [];
            bags.push(curBag);
        }
        else {
            curBag.push(lineVal);
        }
    });
    return bags;
}
function calcTopElf(bags) {
    let res = bags.reduce((prev, cur) => {
        let curBagCapacity = cur.reduce((sPrev, sCur) => sPrev + sCur, 0);
        return Math.max(curBagCapacity, prev);
    }, 0);
    return res;
}
function solve(input) {
    let bags = prepare(input);
    let res = calcTopElf(bags);
    console.log(res);
}
//# sourceMappingURL=solution1.js.map