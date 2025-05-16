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
    return input
        .split('\r\n')
        .map(line => line.split(' = '))
        .map(parts => {
            if (parts[0] == 'mask') {
                let setMask = BigInt('0b' + parts[1]
                    .split('')
                    .map(bit => bit == '1' ? 1 : 0)
                    .join(''));
                let varMask = [];
                for (let i = 0; i < parts[1].length; i++) {
                    let bit = parts[1][parts[1].length - 1 - i];
                    if (bit == 'X') {
                        varMask.push(i);
                    }
                }
                return { setMask, varMask };
            } else {
                return {
                    address: BigInt(parts[0].substring(4, parts[0].length - 1)),
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
        if ('setMask' in line) {
            curMask = line;
        } else {
            let val = line.value;
            let curAddress = line.address | curMask.setMask;
            for (let j = 0; j < curMask.varMask.length; j++) {
                curAddress &= ~(BigInt(1) << BigInt(curMask.varMask[j]));
            }
            for (let i = 0; i < Math.pow(2, curMask.varMask.length); i++) {
                let addrMask = BigInt(0);
                for (let j = 0; j < curMask.varMask.length; j++) {
                    if ((i & (1 << j)) != 0) {
                        addrMask |= (BigInt(1) << BigInt(curMask.varMask[j]));
                    }
                }
                let address = (curAddress | addrMask).toString(16);
                memory[address] = val;
            }
        }
    });
    let res = Object.values(memory)
        .reduce((total, value) => total + value, BigInt(0))
    console.log(res);
    // 3164430338148 too low
}
