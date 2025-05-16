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
    let d = input.trim()
        .split('\n\n').filter(line => line != '')
        .map(s => s.trim());

    return {
        algo: d[0].split(''),
        image: d[1].split('\n').map(s => s.split(''))
    };
}

function calcRes(data: ReturnType<typeof prepare>) {
    let res = 0;

    let left = 0;
    let right = data.image.length;
    let image = data.image;
    let def = '.';
    printImage(left, right, def, image);
    for (let i = 0; i < 2; i++) {
        left -= 3;
        right += 3;
        image = enchImage(left, right, def, image, data.algo);
        printImage(left, right, def, image);
        def = getPixel(0, 0, def, [], data.algo);
    }
    for (let i = left; i < right; i++) {
        for (let j = left; j < right; j++) {
            if (image[i] && image[i][j] == '#') {
                res++;
            }
        }
    }


    return res;
}

function enchImage(left: number, right: number, def: string, image: any, algo: string[]) {
    let res: any = {};
    for (let i = left; i < right; i++) {
        if (!res[i]) {
            res[i] = {};
        }
        for (let j = left; j < right; j++) {
            res[i][j] = getPixel(i, j, def, image, algo);
        }
    }
    return res;
}

function getPixel(y: number, x: number, def: string, image: any, algo: string[]) {
    let ind: string[] = [];
    for (let i = y - 1; i < y + 2; i++) {
        for (let j = x - 1; j < x + 2; j++) {
            if (image[i] && image[i][j]) {
                ind.push(image[i][j]);

            } else {
                ind.push(def);
            }
        }
    }
    let pInd = parseInt(ind
        .map(s => (s == '.' ? '0' : '1'))
        .join(''), 2);
    return algo[pInd];
}

function printImage(left: number, right: number, def: string, image: any) {
    return;
    console.log('---------------------------------------');
    for (let i = left; i < right; i++) {
        let line = '';
        for (let j = left; j < right; j++) {
            if (image[i] && image[i][j]) {
                line = line + image[i][j];
            } else {
                line = line + def;
            }
        }
        console.log(line)
    }
}

function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
    // 5707

}
