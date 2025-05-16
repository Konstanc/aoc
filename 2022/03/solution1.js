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
        .map(line => [
        line.substring(0, line.length / 2),
        line.substring(line.length / 2)
    ]);
    return res;
}
function findRepeats(packs) {
    let res = [];
    res = packs.map(pack => pack[0].split('').find(letter => pack[1].indexOf(letter) >= 0));
    return res;
}
function calcRes(letters) {
    let res = letters.reduce((acc, letter) => {
        let code = letter.charCodeAt(0);
        return acc + (code >= 97 ? code - 96 : code - 65 + 27);
    }, 0);
    return res;
}
function solve(input) {
    let packs = prepare(input);
    let letters = findRepeats(packs);
    let res = calcRes(letters);
    console.log(res);
}
//# sourceMappingURL=solution1.js.map