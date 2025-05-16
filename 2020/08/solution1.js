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
    let program = [];
    let ar = input
        .split('\r\n')
        .map(s => {
            let parts = s.split(" ");
            return {
                command: parts[0],
                arg: parseInt(parts[1]),
                visited: false
            };
        }
        );
    return ar;
}

function solve(input) {
    let program = prepare(input);
    console.log(program);
    let acc = 0;
    let cur = 0;
    while (true) {
        let { command, arg, visited } = program[cur];
        if (visited)
            break;
        program[cur].visited = true;
        if (command == 'jmp') {
            cur += arg;
        } else if (command == 'acc') {
            acc += arg;
            cur++;
        } else {
            cur++;
        }
    }
    console.log('acc', acc);
}
