fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});

/*
    find the two entries that sum to 2020
*/

function solve(data) {
    let ar = data.split('\r\n').map(s => parseInt(s));
    // console.log(ar);
    for (let i = 0; i < ar.length; i++){
        for (let j = i + 1; j < ar.length; j++) {
            if ((ar[i] + ar[j]) == 2020)
                console.log(ar[i] * ar[j]);
        }
    }
}
