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
    let setup = input
        .split('\r\n\r\n')
        .map(p => p
        .split('\r\n')
        .slice(1)
        .map(c => parseInt(c)));
    return setup;
}
function play(setup) {
    while (setup[0].length > 0 && setup[1].length > 0) {
        let c0 = setup[0].shift();
        let c1 = setup[1].shift();
        if (c0 > c1) {
            setup[0].push(c0, c1);
        }
        else {
            setup[1].push(c1, c0);
        }
    }
    return setup;
}
function solve(input) {
    let setup = prepare(input);
    let result = play(setup);
    let score = result.find(cards => cards.length > 0)
        .reverse()
        .reduce((total, c, index) => {
        return total + c * (index + 1);
    }, 0);
    console.log(score);
}
//# sourceMappingURL=solution1.js.map