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
    let d = input
        .split('\n').filter(line => line != '')
        .map(s => s.trim());
    let temp = d[0].split('');
    let rules = d.slice(1)
        .map(s => {
            let ss = s.split(' -> ');
            return {
                in: ss[0].split(''),
                out: ss[1]
            }
        }
        );
    return { temp, rules };
}

function calcRes(data: ReturnType<typeof prepare>) {
    let line = prepareLine(data.temp);
    let ruleIndex = {};
    for (let i = 0; i < data.rules.length; i++) {
        ruleIndex[data.rules[i].in.join('')] = data.rules[i].out;
    }

    for (let i = 0; i < 10; i++) {
        step(line, ruleIndex);
    }
    let lm = leastMost(line);
    return lm.m - lm.l;
}

function leastMost(line: {
    prev: any;
    next: any;
    val: string;
}) {
    let cur = line;
    let count = {};
    while (cur) {
        if (!count[cur.val]) {
            count[cur.val] = 1;
        } else {
            count[cur.val] = count[cur.val] + 1;
        }
        cur = cur.next;
    }
    let sorted = Object.keys(count)
        .sort((a, b) => count[a] - count[b]);
    return {
        l: count[sorted[0]],
        m: count[sorted[sorted.length - 1]],
    }
}

function step(line: {
    prev: any;
    next: any;
    val: string;
}, ruleIndex) {
    let cur = line;
    while (cur) {
        if (cur.next) {
            let next = cur.next;
            let insVal = ruleIndex[cur.val + next.val];
            if (insVal) {
                let ins = {
                    prev: cur,
                    next: next,
                    val: insVal
                }
                cur.next = ins;
                next.prev = ins;
            }
            cur = next;
        } else {
            cur = null;
        }
    }
}

function prepareLine(temp: string[]) {
    let start = {
        prev: null,
        next: null,
        val: temp[0]
    }
    let cur = start;
    for (let i = 1; i < temp.length; i++) {
        let next = {
            prev: cur,
            next: null,
            val: temp[i]
        }
        cur.next = next;
        cur = next;
    }
    return start;
}

function addToIndex(from: {
    name: string;
    big: boolean;
}, to: {
    name: string;
    big: boolean;
}, index) {
    if (!index[from.name]) {
        index[from.name] = {};
    }
    index[from.name][to.name] = { from, to }
};



function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);

}
