const { group } = require('console');

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
    let rules = input
        .split('\r\n')
        .map(line => line.split('.')[0])
        .map(line => line.split(' bags contain '))
        .map(([parent, children]) => ({
            parent,
            children: children
                .split(', ')
                .filter(s => s != 'no other bags')
                .map(s => s.split(' bag')[0])
                .map(s => {
                    let parts = s.split(' ');
                    let count = parseInt(parts[0]);
                    let color = parts.slice(1).join(' ');
                    return { count, color };
                })
        }));
    return rules;
}

function formIndex(rules) {
    let index = {};
    rules.forEach(rule => rule.children
        .forEach(({ count, color }) => {
            let entry = index[color] || { color, parents: {} };
            index[color] = entry;
            entry.parents[rule.parent] = true;
        }));
    return index;
}

function countParents(color, index, checked = {}) {
    if (checked[color]) return 0;
    checked[color] = true;
    let res = 1;
    if (index[color]) {
        res += Object.keys(index[color].parents).reduce((total, pColor) => {
            return total + countParents(pColor, index, checked)
        }, 0);
    }
    return res;
}

let myColor = 'shiny gold';

function solve(input) {
    let rules = prepare(input);
    let index = formIndex(rules);

    let res = countParents(myColor, index) - 1;

    console.log(res);
}
