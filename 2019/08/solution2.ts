declare var require: any
const fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});


function prepare(input: string, width: number, height: number) {
    let pixels = input
        .split('')
        .map(p => parseInt(p));
    let lPixels = width * height;
    let layers: number[][] = [];
    for (let i = 0; i < pixels.length; i += lPixels) {
        layers.push(pixels.slice(i, i + lPixels));
    }
    return layers;
}


function solve(input: string) {
    let width = 25;
    let height = 6;
    let layers = prepare(input, width, height);

    let image = layers[layers.length - 1];
    for (let i = layers.length - 2; i >= 0; i--){
        let layer = layers[i];
        for (let j = 0; j < layer.length; j++) {
            if (layer[j] != 2) {
                image[j] = layer[j];
            }
        }
    }
    let res = '';
    for (let row = 0; row < height; row++){
        res += image
            .slice(row * width, row * width + width)
            .map(p => p == 1 ? '*' : ' ')
            .join('');
        res += '\r\n';
    }

    console.log(res);
}
