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
    let res = input
        .split('\n')
        .map(line => line.split(' '));
    return res;
}

function calcRounds(rounds: string[][]) {
    let res = 0;
    rounds.forEach(round => {
        switch (round[1]) {
            case 'X':   // Loose
                res += 0;
                switch (round[0]) {
                    case 'A': res += 3; break;  // Rock
                    case 'B': res += 1; break;  // Paper
                    case 'C': res += 2; break;  // Scissors
                }
                break;
                case 'Y':   // Draw
                res += 3;
                switch (round[0]) {
                    case 'A': res += 1; break;  // Rock
                    case 'B': res += 2; break;  // Paper
                    case 'C': res += 3; break;  // Scissors
                }
                break;
                case 'Z':   // Win
                res += 6;
                switch (round[0]) {
                    case 'A': res += 2; break;  // Rock
                    case 'B': res += 3; break;  // Paper
                    case 'C': res += 1; break;  // Scissors
                }
                break;
        }
    });
    return res;
}


function solve(input: string) {
    let rounds = prepare(input);
    let res = calcRounds(rounds);

    console.log(res);
}
