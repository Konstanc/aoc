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
    let data = input.trim()
        .split('\n').filter(line => line != '')
        .map(s => s.trim())
        .map(s => {
            let ss = s.split(' ');
            let c = ss[1].split(',')
                .map(ss =>
                    ss.substring(2)
                        .split('..')
                        .map(sss => parseInt(sss))
                );
            return {
                on: ss[0] == 'on' ? true : false,
                cub: c
            }

        });
    return data;
}

function calcRes(data: ReturnType<typeof prepare>) {
    let reactor = {};
    let lefts = [0, 0, 0];
    let rigths = [0, 0, 0];
    /* for (let i = 0; i < data.length; i++) {
        let step = data[i];
        for (let j = 0; j < 3; j++) {
            lefts[j] = Math.min(lefts[j], step.cub[j][0], step.cub[j][1]);
            rigths[j] = Math.max(lefts[j], step.cub[j][0], step.cub[j][1]);
        }
        for (let x = step.cub[0][0]; x <= step.cub[0][1]; x++) {
            if (!reactor[x]) {
                reactor[x] = {}
            }
            for (let y = step.cub[1][0]; y <= step.cub[1][1]; y++) {
                if (!reactor[x][y]) {
                    reactor[x][y] = {}
                }
                for (let z = step.cub[2][0]; z <= step.cub[2][1]; z++) {
                    reactor[x][y][z] = step.on;
                }
            }
        }
    }*/
    let res = 0;
    for (let x = -50; x <= 50; x++) {
        for (let y = -50; y <= 50; y++) {
            for (let z = -50; z <= 50; z++) {
                let found = false;
                let i = data.length-1;
                while (!found && i >= 0) {
                    let step = data[i];
                    if (x >= step.cub[0][0] && x <= step.cub[0][1] &&
                        y >= step.cub[1][0] && y <= step.cub[1][1] &&
                        z >= step.cub[2][0] && z <= step.cub[2][1]
                    ) {
                        found = true;
                        if (step.on) {
                            res++;
                        }
                    }
                    i--;
                }
            }
        }
    }

    return res;
}

function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);

}
