fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example1.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});

function prepare(input) {
    let lines = input.split('\r\n');
    let earliest = parseInt(lines[0]);
    let buses = lines[1]
        .split(',')
        .map(s => s == 'x' ? -1 : parseInt(s))
        .map((bus, index) => ({ index, bus }));
    return { earliest: earliest, buses };
}


function solve(input) {
    let { earliest, buses } = prepare(input);
    buses = buses
        .filter(bus => bus.bus >= 0);
    let found = false;
    let cur = buses[0].bus;
    let curStep = buses[0].bus;
    let curIndex = 1;   // a bus checked now
    let solutions = [];

    while (!found) {
        let fits = (cur + buses[curIndex].index) % buses[curIndex].bus == 0;
        if (fits) {
            if (curIndex == buses.length - 1) {
                found = true;
            } else {
                solutions.push(cur)
                if (solutions.length == 2) {
                    curStep = solutions[1] - solutions[0];
                    solutions = [];
                    curIndex++;
                } else {
                    cur += curStep;
                }
            }
        } else {
            cur += curStep;
        }
    }
    console.log(cur);
}
