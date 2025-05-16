const fs = require('fs');
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, input) {
    if (err) {
        return console.log(err);
    }
    solve(input);
});
function prepare(input) {
    let data = input
        .split('\n').filter(line => line != '')
        .map(line => {
        let d = line.split('');
        return d;
    });
    return data;
}
function calcRes(data) {
    let ox = data.map(d => d);
    let co2 = data.map(d => d);
    let cur = 0;
    while (ox.length > 1) {
        let ones = [];
        let zeros = [];
        for (let i = 0; i < ox[0].length; i++) {
            ones[i] = 0;
            zeros[i] = 0;
        }
        for (let i = 0; i < ox.length; i++) {
            let d = ox[i];
            for (let j = 0; j < d.length; j++) {
                let c = d[j];
                if (c == '1') {
                    ones[j]++;
                }
                else {
                    zeros[j]++;
                }
            }
        }
        let val = ones[cur] >= zeros[cur] ? '1' : '0';
        ox = ox.filter(d => d[cur] === val);
        cur++;
        // cur = cur % ox[0].length;
        if (cur > ox[0].length) {
            console.log('oops');
        }
    }
    cur = 0;
    while (co2.length > 1) {
        let ones = [];
        let zeros = [];
        for (let i = 0; i < co2[0].length; i++) {
            ones[i] = 0;
            zeros[i] = 0;
        }
        for (let i = 0; i < co2.length; i++) {
            let d = co2[i];
            for (let j = 0; j < d.length; j++) {
                let c = d[j];
                if (c == '1') {
                    ones[j]++;
                }
                else {
                    zeros[j]++;
                }
            }
        }
        let val = ones[cur] < zeros[cur] ? '1' : '0';
        co2 = co2.filter(d => d[cur] === val);
        cur++;
        // cur = cur % co2[0].length;
        if (cur > co2[0].length) {
            console.log('oops');
        }
    }
    return parseInt(ox[0].join(''), 2) * parseInt(co2[0].join(''), 2);
}
function solve(input) {
    let data = prepare(input);
    let res = calcRes(data);
    console.log(res);
    // 3950891
}
//# sourceMappingURL=solution2.js.map