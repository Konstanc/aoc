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
    let d = input.split('\n\n').filter(line => line != '');
    let data = {
        dots: d[0].split('\n').filter(line => line != '')
            .map(s => s.split(',').map(s => parseInt(s))),
        folds: d[1].split('\n').filter(line => line != '')
            .map(s => {
                let ss = s.split('fold along ')[1].split('=');
                return {
                    line: ss[0],
                    val: parseInt(ss[1])
                };
            })
    };
    return data;
}

function calcRes(data: ReturnType<typeof prepare>) {
    let paper: boolean[][] = [];
    let sx = 0;
    let sy = 0;
    for (let i = 0; i < data.dots.length; i++) {
        let dot = data.dots[i];
        sx = Math.max(dot[0], sx);
        sy = Math.max(dot[1], sy);
        if (!paper[dot[1]]) {
            paper[dot[1]] = [];
        }
        paper[dot[1]][dot[0]] = true;
    }

    sx++;
    sy++;
    let res = { paper, sx, sy };
    for (let i = 0; i < data.folds.length; i++) {
        let f = data.folds[i];
        res = fold(res.paper, f, res.sx, res.sy);
    }

    plot(res.paper, res.sx, res.sy);
    return 0;
}

function fold(paper: boolean[][], fold: {
    line: string;
    val: number;
},
    sx: number, sy: number) {
    let transform = (x: number, y: number) => {
        if (fold.line == 'x') {
            x = fold.val - (x - fold.val);
        } else {
            y = fold.val - (y - fold.val);
        }
        return { x, y };
    }
    let startX = fold.line == 'x' ? fold.val + 1 : 0;
    let startY = fold.line == 'y' ? fold.val + 1 : 0;
    for (let y = startY; y < sy; y++) {
        if (y == 14) {
            let a = '';
        }
        for (let x = startX; x < sx; x++) {
            let xy = transform(x, y);
            if (!paper[xy.y]) paper[xy.y] = [];
            if ((paper[y] && paper[y][x])
                || paper[xy.y][xy.x]) {
                paper[xy.y][xy.x] = true;
            }
        }
    }

    if (fold.line == 'y') {
        sy = fold.val;
    } else {
        sx = fold.val;
    }
    return { paper, sx, sy };
}

function plot(paper: boolean[][],
    sx: number, sy: number) {
    let res = 0;
    for (let y = 0; y < sy; y++) {
        let s = '';
        for (let x = 0; x < sx; x++) {
            if (paper[y] && paper[y][x]) {
                s += '#';
            } else {
                s += '.';
            }
        }
        console.log(s);
    }
    return res;
};



function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
}
