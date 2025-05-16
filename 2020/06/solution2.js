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
        let allAnswers = group[0];
        for (let i = 1; i < group.length; i++){
            let answers = group[i];
            allAnswers = allAnswers
                .filter(answer => answers.indexOf(answer) >= 0);
        }
        return total + allAnswers.length;
    }, 0);
    console.log(count);
}
