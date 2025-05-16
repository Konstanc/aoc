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
    if (!fields.every(field => passport[field])) return false;
    if (passport.byr.length != 4) return false;
    if (parseInt(passport.byr) < 1920) return false;
    if (parseInt(passport.byr) > 2020) return false;

    if (passport.iyr.length != 4) return false;
    if (parseInt(passport.iyr) < 2010) return false;
    if (parseInt(passport.iyr) > 2020) return false;

    if (passport.eyr.length != 4) return false;
    if (parseInt(passport.eyr) < 2020) return false;
    if (parseInt(passport.eyr) > 2030) return false;

    let hgtUnit = passport.hgt.substring(passport.hgt.length - 2);
    let hgt = parseInt(passport.hgt.substring(0, passport.hgt.length - 2));
    if (hgtUnit != 'cm' && hgtUnit != 'in') return false;
    if (hgtUnit == 'cm') {
        if (hgt < 150) return false;
        if (hgt > 193) return false;
    }
    if (hgtUnit == 'in') {
        if (hgt < 59) return false;
        if (hgt > 76) return false;
    }
    if (passport.hcl[0] != '#') return false;
    let hcl = passport.hcl.substring(1);
    if (hcl.length != 6) return false;
    let regHcl = /^[a-z0-9]+$/;
    if (!regHcl.test(hcl)) return false;

    if (!['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].some(t => t == passport.ecl)) return false;

    if (passport.pid.length != 9) return false;
    let regPid = /^[0-9]+$/;
    if (!regPid.test(passport.pid)) return false;

    return true;
}

function solve(input) {
    let passports = prepare(input);
    let count = passports.reduce((c, passport) => isValid(passport) ? c + 1 : c, 0)
    console.log(count);

}


