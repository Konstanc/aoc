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
    return input;
}

function calcRes(stream: ReturnType<typeof prepare>) {
    let buffer = stream.slice(0, 13).split('');
    buffer.unshift('');
    for (let i = 13; i < stream.length; i++) {
        let letter = stream.charAt(i);
        buffer.shift();
        buffer.push(letter);
        let found = false;
        for (let j = 13; j >= 0 && !found; j--) {
            let index = buffer.indexOf(buffer[j]);
            if (index > -1 && index < j) {
                found = true;
            }
        }
        if (!found) return i + 1;
    }
}


function solve(input: string) {
    let stream = prepare(input);
    let res = calcRes(stream);

    console.log(res);
}
