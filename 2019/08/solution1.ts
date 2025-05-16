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
    let indexes = layers.map((layer, lIndex) => ({
        index: lIndex,
        count: layer.reduce((acc, pixel) => (pixel == 0 ? acc + 1 : acc), 0)
    }));
    indexes.sort((a, b) => a.count - b.count);
    //indexes.filter(ind => ind.count > 0);
    let theLayer = layers[indexes[0].index];
    let ones = theLayer.reduce((acc, pixel) => (pixel == 1 ? acc + 1 : acc), 0);
    let twos = theLayer.reduce((acc, pixel) => (pixel == 2 ? acc + 1 : acc), 0);

    console.log(ones * twos);
}
