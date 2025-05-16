const { group } = require('console');

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
    rules.forEach(rule => {
        index[rule.parent] = rule.children;
    })
    return index;
}

function countChildren(color, index) {
    if (index[color]) {
        return index[color].reduce((total, bag) => {
            return total + bag.count + bag.count * countChildren(bag.color, index);
        }, 0);
    }
    return 0;
}

let myColor = 'shiny gold';

function solve(input) {
    let rules = prepare(input);
    let index = formIndex(rules);

    let res = countChildren(myColor, index);

    console.log(res);
}
