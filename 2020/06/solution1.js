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
    let groups = input
        .split('\r\n\r\n')
        .map(gl => gl
            .split('\r\n')
            .map(line => line.split(''))
        );
    return groups;
}


function solve(input) {
    let groups = prepare(input);
    let count = groups.reduce((total, group) => {
        let groupCount = 0;
        let hash = {};
        group.forEach(person => person.forEach(answer => { 
            if (!hash[answer]) {
                groupCount++;
                hash[answer] = true;
            }
        }));
        return total + groupCount;
    }, 0);
    console.log(count);
}
