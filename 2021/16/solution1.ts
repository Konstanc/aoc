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
    let data = input.trim()
        .split('').filter(line => line != '')
        .map(s => s.trim())
        .map(s => parseInt(s, 16))
        .map(d => {
            let ss = d.toString(2);
            while (ss.length < 4) {
                ss = '0' + ss;
            }
            return ss.split('')
                .map(ss => parseInt(ss))
        }
        );
    return data.flat().join('');
}

function calcRes(data: ReturnType<typeof prepare>) {
    let res = 0;
    let cur = 0;

    let homePacket = {
        type: 'home',
        packets: [],
        end: data.length,
    }
    let outPacket: any = homePacket;
    while (cur < data.length - 6) {
        if (outPacket.end && cur < outPacket.end - 6) {
            let v = parseInt(data.slice(cur, cur + 3), 2);
            res += v;
            let t = parseInt(data.slice(cur + 3, cur + 6), 2);
            cur = cur + 6;
            let curPacket: any = {
                version: v,
                parent: outPacket,
                packets: [],
            };

            if (t == 4) { //value
                curPacket.isValue = true;
                let sVal = '';
                while (data[cur] == '1') {
                    sVal = sVal + data.slice(cur + 1, cur + 5);
                    cur += 5;
                }
                sVal = sVal + data.slice(cur + 1, cur + 5)
                cur += 5;
                let val = parseInt(sVal, 2);
                curPacket.val = val;
            } else {
                curPacket.isOperator = true;
                let lt = data[cur];
                cur++;
                if (lt == '0') {
                    let totalLen = parseInt(data.slice(cur, cur + 15), 2);
                    cur += 15;
                    curPacket.end = cur + totalLen;
                } else {
                    let spCount = parseInt(data.slice(cur, cur + 11), 2);
                    cur += 11;
                    curPacket.packetCount = spCount;
                }
            }
            outPacket.packets.push(curPacket);
            if (outPacket.packetCount && outPacket.packets.length >= outPacket.packetCount) {
                outPacket = outPacket.parent;
            }
        } else {
            if (outPacket.end) {
                cur = outPacket.end;
            }
            outPacket = outPacket.parent;
        }
    }
    return res;
}

function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);

}
