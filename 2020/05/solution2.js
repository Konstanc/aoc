fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});

function prepare(input) {
    let seats = input
        .split('\r\n')
        .map(seat => parseInt(seat
            .split('')
            .map(char => {
                switch (char) {
                    case 'B':
                    case 'R':
                        return '1';
                        break;
                    default:
                        return '0';
                }
            })
            .join(''),
            2)
        );
    return seats;
}


function solve(input) {
    let seats = prepare(input);
    seats.sort((a, b) => a - b);
    console.log(seats);
    for (let i = Math.min(...seats) + 1; i < Math.max(...seats) - 1; i++){
        if (seats.indexOf(i) == -1)
            console.log(i);
    }
}
