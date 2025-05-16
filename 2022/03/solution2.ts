declare var require: any
const fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});

function prepare(input: string) {
    let packs = input
        .split('\n');
    let res: string[][] = [];
    for (let i = 0; i < packs.length; i += 3) {
        res.push(packs.slice(i, i + 3));
    }
    return res;
}

function findRepeats(packs: ReturnType<typeof prepare>) {
    let res: string[] = [];
    res = packs.map(pack =>
        pack[0].split('').find(letter => pack[1].indexOf(letter) >= 0 && pack[2].indexOf(letter) >= 0)
    );
    return res;
}

function calcRes(letters: string[]) {
    let res = letters.reduce((acc, letter) => {
        let code = letter.charCodeAt(0);
        return acc + (code >= 97 ? code - 96 : code - 65 + 27);
    }
        , 0);
    return res;
}


function solve(input: string) {
    let packs = prepare(input);
    let letters = findRepeats(packs);
    let res = calcRes(letters);


    console.log(res);
}
