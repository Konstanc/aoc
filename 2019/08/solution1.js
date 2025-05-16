var fs = require('fs');
var fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});
function prepare(input, width, height) {
    var pixels = input
        .split('')
        .map(function (p) { return parseInt(p); });
    var lPixels = width * height;
    var layers = [];
    for (var i = 0; i < pixels.length; i += lPixels) {
        layers.push(pixels.slice(i, i + lPixels));
    }
    return layers;
}
function solve(input) {
    var width = 25;
    var height = 6;
    var layers = prepare(input, width, height);
    var indexes = layers.map(function (layer, lIndex) { return ({
        index: lIndex,
        count: layer.reduce(function (acc, pixel) { return (pixel == 0 ? acc + 1 : acc); }, 0)
    }); });
    indexes.sort(function (a, b) { return a.count - b.count; });
    //indexes.filter(ind => ind.count > 0);
    var theLayer = layers[indexes[0].index];
    var ones = theLayer.reduce(function (acc, pixel) { return (pixel == 1 ? acc + 1 : acc); }, 0);
    var twos = theLayer.reduce(function (acc, pixel) { return (pixel == 2 ? acc + 1 : acc); }, 0);
    console.log(ones * twos);
}
//# sourceMappingURL=solution1.js.map