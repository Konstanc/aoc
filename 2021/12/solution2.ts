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
    let data = input
        .split('\n').filter(line => line != '')
        .map(s => s.trim())
        .map(s => s.split('-')
            .map(s => {
                return {
                    name: s,
                    big: s == s.toUpperCase()
                }
            })
        );
    return data;
}

function calcRes(data: ReturnType<typeof prepare>) {
    let pathIndex = {};
    for (let i = 0; i < data.length; i++) {
        addToIndex(data[i][0], data[i][1], pathIndex);
        addToIndex(data[i][1], data[i][0], pathIndex);
    }
    let curPath = ['start'];
    let res = findPaths(curPath, [], '', pathIndex);
    return res.length;
}

function findPaths(curPath: string[], smallVisited: string[], twice, pathIndex) {
    if (curPath[curPath.length - 1] == 'end') {
        return [curPath];
    }
    let res: string[][] = [];
    let paths = pathIndex[curPath[curPath.length - 1]];
    let tos = Object.keys(paths);
    for (let i = 0; i < tos.length; i++) {
        let fromTo = paths[tos[i]];
        let canVisit = true;
        if (fromTo.to.name == 'start') canVisit = false;
        let newTwice = twice;
        if (!fromTo.to.big && smallVisited.indexOf(fromTo.to.name) > -1) {
            if (twice || twice == fromTo.to.name) {
                canVisit = false
            } else {
                newTwice = fromTo.to.name;
            }
        };
        if (canVisit) {
            let pp = curPath.slice();
            pp.push(fromTo.to.name);
            let newSW = smallVisited.slice();
            if (!fromTo.to.big) {
                newSW.push(fromTo.to.name);
            }
            let foundPaths = findPaths(pp, newSW, newTwice, pathIndex);
            foundPaths.forEach(p => res.push(p));
        }
    }
    return res;
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
