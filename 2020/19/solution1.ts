declare var require: any
const fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});

function prepare(input: string) {
    let parts = input.split('\r\n\r\n');
    let baseRules: string[] = [];
    let rules: number[][][] = [];
    parts[0]
        .split('\r\n')
        .forEach(line => {
            let rs = line.split(': ');
            let index = parseInt(rs[0]);

            if (rs[1][0] == '"') {
                baseRules[index] = rs[1][1];
            } else {
                let values = rs[1]
                    .split(' | ')
                    .map(rl => rl
                        .split(' ')
                        .map(s => parseInt(s)));
                rules[index] = values;
            }
        })
    let lines = parts[1]
        .split('\r\n');
    return { baseRules, rules, lines };
}

function matchRuleList(s: string, ruleList: number[], baseRules: string[], rules: number[][][]) {
    if (ruleList.length == 1) {
        return match(s, ruleList[0], baseRules, rules);
    } else {
        for (let i = 0; i < s.length - 1; i++) {
            if (match(s.substring(0, i + 1), ruleList[0], baseRules, rules) &&
                matchRuleList(s.substring(i + 1), ruleList.slice(1), baseRules, rules)) {
                return true;
            }
        }
    }
    return false;
}

let matchIndex: { [key: string]: { res: boolean }[]; } = {};
function match(s: string, ruleIndex: number, baseRules: string[], rules: number[][][]) {
    if (!(s in matchIndex)) {
        matchIndex[s] = [];
    }
    let r = matchIndex[s][ruleIndex];
    if (r) {
        return r.res;
    } else {
        let res = match_(s, ruleIndex, baseRules, rules);
        matchIndex[s][ruleIndex] = { res };
        return res;
    }
}
function match_(s: string, ruleIndex: number, baseRules: string[], rules: number[][][]) {
    if (baseRules[ruleIndex] == s) return true;
    if (baseRules[ruleIndex]) return false;
    let rule = rules[ruleIndex];
    return rule.some(subRule => matchRuleList(s, subRule, baseRules, rules));
}


function solve(input: string) {
    let { baseRules, rules, lines } = prepare(input);
    console.log(lines.length, 'total');
    let ar = lines
        .map((line, index) => {
            let a = match(line, 0, baseRules, rules);
            console.log(index, line, a);
            return a;
        });

    let res = ar.reduce((count, val) => val ? count + val : count, 0);
    console.log(res);
}
