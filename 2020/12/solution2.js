fs = require('fs')
// let fileName = 'input.txt';
let fileName = 'example.txt';
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

function sail(actions,  startWP, startPosition) {
    let curWP = [...startWP];
    let curPosition = [...startPosition];
    let wpDiff;
    actions.forEach(action => {
        switch (action.action) {
            case 'N':
                curWP[1] = curWP[1] + action.value;
                break;
            case 'S':
                curWP[1] = curWP[1] - action.value;
                break;
            case 'W':
                curWP[0] = curWP[0] - action.value;
                break;
            case 'E':
                curWP[0] = curWP[0] + action.value;
                break;
            case 'L':
            case 'R':
                wpDiff = [curWP[0] - curPosition[0], curWP[1] - curPosition[1]];
                let a = (Math.PI / 2) * (action.value / 180) % 2;
                if (action.action == 'L') {
                    a = 0 - a;
                }
                let newDiff = [
                    wpDiff[0] * Math.cos(a) - wpDiff[1] * Math.sin(a),
                    wpDiff[0] * Math.sin(a) + wpDiff[1] * Math.cos(a),
                ]
                curWP = [
                    Math.round(curPosition[0] + wpDiff[0]),
                    Math.round(curPosition[1] + wpDiff[1]),
                ]
                break;
            case 'F':
                wpDiff = [curWP[0] - curPosition[0], curWP[1] - curPosition[1]];
                curPosition[0] = curPosition[0] + action.value * wpDiff[0];
                curPosition[1] = curPosition[1] + action.value * wpDiff[1];
                break;
            default:
                console.log('alarm');
                break;
        }
        // console.log(curDir);

    });
    return { position: curPosition };
}

function solve(input) {
    let actions = prepare(input);
    let curWP = [10, 1];
    let curPosition = [0, 0];
    let res = (sail(actions, curWP, curPosition));
    console.log(res);
    console.log(Math.abs(res.position[0]) + Math.abs(res.position[1]));
    // 578, 1780 = 2058, 2358
}
