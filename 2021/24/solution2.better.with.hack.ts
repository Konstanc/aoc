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

const regIndex = {
    'w': 0,
    'x': 1,
    'y': 2,
    'z': 3,
};

function prepare(input: string) {
    let data = input.trim()
        .split('\n').filter(line => line != '')
        .map(s => s.trim())
        .map(s => {
            let ss = s.split(' ');
            let op = ss[0];
            let args = ss.slice(1).map(a => {
                if (regIndex[a] != undefined) {
                    return {
                        isReg: true,
                        isVal: false,
                        reg: regIndex[a],
                    }
                } else {
                    return {
                        isReg: false,
                        isVal: true,
                        val: parseInt(a),
                    }

                }
            });
            return { op, args }

        });
    return data;
}

function calcRes(data: ReturnType<typeof prepare>) {
    let inpI = 0;
    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        if (d.op == 'inp') {
            d.args.push({
                isReg: false,
                isVal: false,
                val: inpI,
            })
            inpI++;
        }
    }


    let res = execFrom(0, [0, 0, 0, 0], data, false, '').join('');

    return res;
}

let iExec = {};
function execFrom(i, prevRegs: number[], data: ReturnType<typeof prepare>, storeRes: boolean, curInp: string) {
    if (i >= data.length) {
        if (prevRegs[3] == 0) {
            return [];
        } else {
            return false;
        }
    }
    // dirty hack :(
    if (prevRegs[3] > 1000000) {
        return false;
    }
    let ind = [i, prevRegs.join(',')].join(';');
    if (iExec[ind] !== undefined) {
        return iExec[ind];
    }
    // let storeRes = false;
    let storeNext = false;
    const d = data[i];
    let regs = [...prevRegs];
    let resInd = d.args[0].reg;
    let arg0 = regs[d.args[0].reg];
    let arg1 = d.args[1].isReg ? regs[d.args[1].reg] : d.args[1].val;
    switch (d.op) {
        case 'inp':
            for (let j = 1; j <= 9; j++) {
                regs = [...prevRegs];
                regs[resInd] = j;
                let pRes = execFrom(i + 1, regs, data, true, curInp + j);
                if (pRes !== false) {
                    return [j, ...pRes];
                }
            }
            return false;
            break;
        case 'add':
            regs[resInd] = arg0 + arg1;
            break;
        case 'mul':
            regs[resInd] = arg0 * arg1;
            break;
        case 'div':
            regs[resInd] = Math.floor(arg0 / arg1);
            break;
        case 'mod':
            regs[resInd] = arg0 % arg1;
            storeNext = true;
            break;
        case 'eql':
            regs[resInd] = arg0 == arg1 ? 1 : 0;
            break;
        default:
            break;
    }
    let res = execFrom(i + 1, regs, data, storeNext, curInp);
    if (storeRes) {
        iExec[ind] = res;
    }
    return res;
}

function exec(inp: number[], data: ReturnType<typeof prepare>) {
    let regs = [0, 0, 0, 0];
    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        let resInd = d.args[0].reg;
        let arg0 = regs[d.args[0].reg];
        let arg1 = d.args[1].isReg ? regs[d.args[1].reg] : d.args[1].val;
        switch (d.op) {
            case 'inp':
                regs[resInd] = inp[arg1];
                break;
            case 'add':
                regs[resInd] = arg0 + arg1;
                break;
            case 'mul':
                regs[resInd] = arg0 * arg1;
                break;
            case 'div':
                regs[resInd] = Math.floor(arg0 / arg1);
                break;
            case 'mod':
                regs[resInd] = arg0 % arg1;
                break;
            case 'eql':
                regs[resInd] = arg0 == arg1 ? 1 : 0;
                break;
            default:
                break;
        }
    }
    return regs;
}

function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
    // 98998519596997

}
