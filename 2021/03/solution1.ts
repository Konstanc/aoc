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
        .map(line => {
            let d = line.split('');
            return d;
        });
    return data;
}

function calcRes(data: ReturnType<typeof prepare>) {
    let ones: number[] = [];
    let zeros: number[] = [];
    for (let i = 0; i < data[0].length; i++) {
        ones[i] = 0;
        zeros[i] = 0;
    }
    for (let i = 0; i < data.length; i++) {
        let d = data[i];
        for (let j = 0; j < d.length; j++) {
            let c = d[j];
            if (c == '1') {
                ones[j]++;
            } else {
                zeros[j]++;
            }
        }
    }
    let gamma = '';
    let eps = '';
    for (let i = 0; i < ones.length; i++) {
        if (ones[i] > zeros[i]) {
            gamma = gamma + '1';
            eps = eps + '0';
        } else {
            gamma = gamma + '0';
            eps = eps + '1';
        }
    }
    return parseInt(gamma, 2) * parseInt(eps, 2);
}


function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
}
