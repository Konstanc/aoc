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

    let remLine = getRemLine(line);
    let countIndex = {};
    let counts = grow(line, ruleIndex, countIndex, 40);

    let lm = leastMost(counts);
    return lm.m - lm.l;
}

function grow(line: {
    prev: any;
    next: any;
    val: string;
    counts: any;
}, ruleIndex, countIndex, steps) {
    let cur = line;
    let totalCounts = {};
    while (cur) {
        let next = cur.next;
        totalCounts = mergeCounts(totalCounts,
            getInsCount(cur, ruleIndex, countIndex, steps));
        cur = next;

    }
    return totalCounts;
}

function getInsCount(cur: {
    prev: any;
    next: any;
    val: string;
    counts: any;
}, ruleIndex, countIndex, steps) {
    if (steps < 1) {
        return cur.counts;
    }
    let res = {};
    let next = cur.next;
    if (!next) return cur.counts;
    let ci = countIndex[cur.val + next.val + steps];
    if (ci) {
        return ci;
    } else {
        let insVal = ruleIndex[cur.val + next.val];
        if (insVal) {
            let ins = {
                prev: cur,
                next: next,
                val: insVal,
                counts: { [insVal]: 1 }
            }
            cur.next = ins;
            next.prev = ins;
            res = mergeCounts(
                getInsCount(cur, ruleIndex, countIndex, steps - 1),
                getInsCount(ins, ruleIndex, countIndex, steps - 1),
            );
        }
    }
    countIndex[cur.val + next.val + steps] = res;
    return res;
}

function mergeCounts(c1, c2) {
    let res = {};
    Object.keys(c1).forEach(c1Key => {
        res[c1Key] = c1[c1Key];
    });
    Object.keys(c2).forEach(c2Key => {
        if (res[c2Key]) {
            res[c2Key] = res[c2Key] + c2[c2Key];
        } else {
            res[c2Key] = c2[c2Key];
        }
    });
    return res;
}

function leastMost(count) {
    let sorted = Object.keys(count)
        .sort((a, b) => count[a] - count[b]);
    return {
        l: count[sorted[0]],
        m: count[sorted[sorted.length - 1]],
    }
}

function getRemLine(line) {
    let cur = line;
    let remLine = [];
    while (cur) {
        remLine.push(cur);
        cur = cur.next;
    }
    return remLine;
}

function prepareLine(temp: string[]) {
    let start = {
        prev: null,
        next: null,
        val: temp[0],
        counts: { [temp[0]]: 1 }
    }
    let cur = start;
    for (let i = 1; i < temp.length; i++) {
        let next = {
            prev: cur,
            next: null,
            val: temp[i],
            counts: { [temp[i]]: 1 }
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
