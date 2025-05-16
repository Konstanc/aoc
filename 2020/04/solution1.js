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
    let passports = input
        .split('\r\n\r\n')
        .map(sp => sp.split('\r\n')
            .map(sl => sl.split(' '))
        )
        .map(p => p.flat())
        .map(p => p.map(kv => kv.split(':')))
        .map(sp => {
            let p = {};
            sp.forEach(el => {
                p[el[0]] = el[1];
            });
            return p;
        });
    return passports;
}

// let fields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid', 'cid'];
let fields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

function isValid(passport) {
    return fields.every(field => passport[field]);
}

function solve(input) {
    let passports = prepare(input);
    let count = passports.reduce((c, passport) => isValid(passport) ? c + 1 : c, 0)
    console.log(count);
}
