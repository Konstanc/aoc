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
    let pKeys = input
        .split('\r\n')
        .map(line => parseInt(line));
    return pKeys;
}
function getNextKey(startKey, subj, loops) {
    let key = startKey;
    for (let i = 0; i < loops; i++) {
        key *= subj;
        key = key % 20201227;
    }
    return key;
}
function findLoopSize(targetKey, subj) {
    let key = 1;
    let loop = 0;
    do {
        loop++;
        key = getNextKey(key, subj, 1);
    } while (key != targetKey);
    return loop;
}
function solve(input) {
    let pKeys = prepare(input);
    let loops = pKeys.map(key => findLoopSize(key, 7));
    let res = getNextKey(1, pKeys[0], loops[1]);
    console.log(res);
}
//# sourceMappingURL=solution1.js.map