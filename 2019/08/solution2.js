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
    var image = layers[layers.length - 1];
    for (var i = layers.length - 2; i >= 0; i--) {
        var layer = layers[i];
        for (var j = 0; j < layer.length; j++) {
            if (layer[j] != 2) {
                image[j] = layer[j];
            }
        }
    }
    var res = '';
    for (var row = 0; row < height; row++) {
        res += image
            .slice(row * width, row * width + width)
            .map(function (p) { return p == 1 ? '*' : ' '; })
            .join('');
        res += '\r\n';
    }
    console.log(res);
}
//# sourceMappingURL=solution2.js.map