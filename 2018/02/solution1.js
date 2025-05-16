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
    let ids = input
        .split('\n');
    return ids;
}
function calcChecksum(ids) {
    let twos = 0;
    let threes = 0;
    for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const letters = {};
        id.split('').forEach((letter) => {
            if (letters[letter]) {
                letters[letter]++;
            }
            else {
                letters[letter] = 1;
            }
        });
        if (Object.values(letters).some(count => count == 2))
            twos++;
        if (Object.values(letters).some(count => count == 3))
            threes++;
    }
    return twos * threes;
}
function solve(input) {
    let ids = prepare(input);
    let res = calcChecksum(ids);
    console.log(res);
}
//# sourceMappingURL=solution1.js.map