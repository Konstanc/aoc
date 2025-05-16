const { runInNewContext } = require('vm');

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

function sail(actions, startWP, startPosition) {
    let curWP = [...startWP];
    let curPosition = [...startPosition];
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
                let a = action.value / 180;
                if (action.action == 'R') {
                    a = 0 - a;
                }
                a = (a + 4) % 2;                
                console.log(action.value, a);
                let newCurWP = [0, 0];
                switch (a) {
                    case 0.5:
                        newCurWP = [-curWP[1], curWP[0]];
                        break;
                    case 1:
                        newCurWP = [-curWP[0], -curWP[1]];
                        break;
                    case 1.5:
                        newCurWP = [curWP[1], -curWP[0]];
                        break;
                    case 0:
                    default:
                        newCurWP = curWP;
                        break;
                }
                curWP = newCurWP;
                break;
            case 'F':
                curPosition[0] = curPosition[0] + action.value * curWP[0];
                curPosition[1] = curPosition[1] + action.value * curWP[1];
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
    // 26060 low
    // 31780 low
    // 176305 high
}
