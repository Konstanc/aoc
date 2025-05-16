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
function playHash(setup) {
    return setup.map(cards => cards.join(',')).join(';');
}
let playIndex = {};
function play(setup) {
    let hash = playHash(setup);
    if (hash in playIndex) {
        return playIndex[hash];
    }
    setup = setup.map(s => s.slice());
    let anIndex = [{}, {}];
    while (setup[0].length > 0 && setup[1].length > 0) {
        let i0 = setup[0].join(',');
        let i1 = setup[1].join(',');
        if (i0 in anIndex[0] || i1 in anIndex[1]) {
            let res = { win: true, setup };
            playIndex[hash] = res;
            return res;
        }
        else {
            anIndex[0][i0] = true;
            anIndex[1][i1] = true;
            let win;
            let c0 = setup[0].shift();
            let c1 = setup[1].shift();
            if (setup[0].length >= c0 && setup[1].length >= c1) {
                let subSetup = [
                    setup[0].slice(0, c0),
                    setup[1].slice(0, c1),
                ];
                let r = play(subSetup);
                win = r.win;
            }
            else {
                win = c0 > c1;
            }
            if (win) {
                setup[0].push(c0, c1);
            }
            else {
                setup[1].push(c1, c0);
            }
        }
    }
    let res = { win: setup[0] > setup[1], setup };
    playIndex[hash] = res;
    return res;
}
function solve(input) {
    let setup = prepare(input);
    let result = play(setup);
    let winCards = result.win ?
        result.setup[0] :
        result.setup[1];
    let score = winCards
        .reverse()
        .reduce((total, c, index) => {
        return total + c * (index + 1);
    }, 0);
    console.log(score);
}
//# sourceMappingURL=solution2.js.map