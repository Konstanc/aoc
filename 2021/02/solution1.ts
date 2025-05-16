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
    let moves = input
        .split('\n')
        .map(line => {
            let l = line.split(' ');
            return { dir: l[0], l: parseInt(l[1]) };
        });
    return moves;
}

function calcMove(moves: {
    dir: string;
    l: any;
}[]) {
    let d = 0;
    let pos = 0;
    for (let i = 0; i < moves.length; i++) {
        let m = moves[i];
        switch (m.dir) {
            case 'forward':
                pos += m.l;
                break;
            case 'down':
                d += m.l;
                break;
            case 'up':
                d -= m.l;
                break;
            default:
                break;
        }
    }
    return d * pos;
}


function solve(input: string) {
    let moves = prepare(input);
    let res = calcMove(moves);

    console.log(res);
}
