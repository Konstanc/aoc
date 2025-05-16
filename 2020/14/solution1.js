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
    return input
        .split('\r\n')
        .map(line => line.split(' = '))
        .map(parts => {
            if (parts[0] == 'mask') {
                let clearMask = BigInt('0b' + parts[1]
                    .split('')
                    .map(bit => bit == '0' ? 1 : 0)
                    .join(''));
                let setMask = BigInt('0b' + parts[1]
                    .split('')
                    .map(bit => bit == '1' ? 1 : 0)
                    .join(''));
                return { clearMask, setMask };
            } else {
                return {
                    address: parseInt(parts[0].substring(4, parts[0].length - 1)),
                    value: BigInt(parts[1])
                }
            }
        });
}


function solve(input) {
    let program = prepare(input);
    let memory = {};
    let curMask;
    program.forEach(line => {
        if ('clearMask' in line) {
            curMask = line;
        } else {
            let val = line.value;
            val |= curMask.setMask;
            val &= ~curMask.clearMask;
            memory[line.address] = val;
        }
    });
    let res = Object.values(memory)
        .reduce((total, value) => total + value, BigInt(0))
    console.log(res);
}
