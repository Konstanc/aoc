fs = require('fs')
// let fileName = 'input.txt';
let fileName = 'example1.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
    console.log('aha');
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

function run(program) {
    for (let i = 0; i < program.length; i++) {
        program[i].visited = false;
    }
    let acc = 0;
    let cur = 0;
    let success = false;
    while (true) {
        if (cur >= program.length) {
            success = true;
            break;
        }
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
    return { success, cur, acc };
}

function solve(input) {
    let program = prepare(input);
    for (let i = 0; i < program.length; i++) {
        if (program[i].command == 'acc') {
            continue;
        }
        let res;
        if (program[i].command == 'nop') {
            program[i].command = 'jmp';
            res = run(program);
            console.log('?', res);
            program[i].command = 'nop';
        }
        if (program[i].command == 'jmp') {
            program[i].command = 'nop';
            res = run(program);
            console.log('??',res);
            program[i].command = 'jmp';
        }
        console.log(res);
        console.log(i);
        if (res.success) {            
            console.log('!', res.acc);
            break;
        }
    }
}
