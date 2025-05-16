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
    let solve = input
        .split('\r\n')
        .map(s => ({
            action: s.substring(0, 1),
            value: parseInt(s.substring(1)),
        }));
    return solve;
}

function sail(actions, startDir, startPosition) {
    let curDir = (startDir + 4) % 2;
    let curPosition = [...startPosition];
    actions.forEach(action => {
        switch (action.action) {
            case 'N':
                curPosition[1] = curPosition[1] + action.value;
                break;
            case 'S':
                curPosition[1] = curPosition[1] - action.value;
                break;
            case 'W':
                curPosition[0] = curPosition[0] - action.value;
                break;
            case 'E':
                curPosition[0] = curPosition[0] + action.value;
                break;
            case 'L':
                curDir = (curDir - (action.value / 180) + 4) % 2;
                break;
            case 'R':
                curDir = (curDir + (action.value / 180) + 4) % 2;
                break;
            case 'F':
                switch (curDir) {
                    case 1.5:
                        curPosition[1] = curPosition[1] + action.value;
                        break;
                    case 0.5:
                        curPosition[1] = curPosition[1] - action.value;
                        break;
                    case 1:
                        curPosition[0] = curPosition[0] - action.value;
                        break;
                    case 0:
                    default:
                        curPosition[0] = curPosition[0] + action.value;
                        break;
                }
                break;
            default:
                console.log('alarm');
                break;
        }
        // console.log(curDir);

    });
    return { dir: curDir, position: curPosition };
}

function solve(input) {
    let actions = prepare(input);
    let curDir = 0;
    let curPosition = [0, 0];
    let res = (sail(actions, curDir, curPosition));
    console.log(res);
    console.log(Math.abs(res.position[0]) + Math.abs(res.position[1]));
    // 578, 1780 = 2058, 2358
}
