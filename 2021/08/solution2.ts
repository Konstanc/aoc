declare var require: any
const fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';

fs.readFile(fileName, 'utf8', function (err, input) {
    if (err) {
        return console.log(err);
    }
    solve(input);
});

function prepare(input: string) {
    let data = input
        .split('\n').filter(line => line != '')
        .map(s => s.split(' | ')
            .map(ss => ss.split(' ').filter(line => line != '')
                .map(ss => ss.split('').sort()
                )
            ));
    return data;
}

const iVoc = {
    2: 1,
    4: 4,
    3: 7,
    7: 8
}

const voc = {
    0: 'abcefg',    //6
    1: 'cf',        //2
    2: 'acdeg',     //5
    3: 'acdfg',     //5
    4: 'bcdf',      //4
    5: 'abdfg',     //5
    6: 'abdefg',    //6
    7: 'acf',       //3
    8: 'abcdefg',   //7
    9: 'abcdfg',    //6
}

const allLetters = 'abcdefg';

function nSegMap(segMap, digit: string, value: number) {
    let shouldBe = voc[value];
}

const allKDs = getAllKDs();
function deduce(d: string[][][]) {

    let knownDigits = {};
    let letters = 'abcdefg';

    let allDigits = d[0].concat(d[1]).map(s => s.join(''))
    for (let i = 0; i < allKDs.length; i++) {
        let ms = makeSense(allKDs[i], allDigits);
        if (ms) {
            return ms;
        }
    }
    return false;
}

function getAllKDs() {
    let letters = allLetters;
    let keys = getRestKeys(letters, '');
    let res = keys.map(key => {
        let kd = {};
        Object.keys(voc).forEach(vKey => {
            let digit = voc[vKey].split('')
                .map(c =>
                    key[allLetters.indexOf(c)]
                )
                .sort()
                .join('');
            kd[digit] = vKey;
        })
        return kd;
    })
    return res;
}
function getRestKeys(letters: string, curKey: string) {
    if (!letters.length) {
        return [curKey];
    }
    let res = [];
    for (let i = 0; i < letters.length; i++) {
        let restLetters = letters.split('')
        let l = restLetters.splice(i, 1);

        res = res.concat(getRestKeys(restLetters.join(''), curKey + l,));
    }
    return res;
}

function makeSense(knownDigits, allDigits: string[]) {
    let i = 0;
    while (i < allDigits.length) {
        let digit = allDigits[i];
        if (!knownDigits[digit]) {
            return false;
        }
        i++;
    }
    return knownDigits;;
}

function calcRes(data: ReturnType<typeof prepare>) {
    let res = 0;
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        let kd = deduce(d);
        if (!kd) {
            console.log('alarm');
        }
        let val = data[i][1].map(s => kd[s.join('')].toString()).join('');
        res += parseInt(val);

    }
    return res;
}

function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
}
