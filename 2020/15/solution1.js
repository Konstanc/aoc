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
    let index = {};
    let nums = input
        .split(',');
    let l = nums.length;
    nums = nums.map((s, i) => {
        let n = parseInt(s);
        if (i < l - 1) {
            index[n] = i + 1;
        }
        return n;
    });

    return { nums, index };
}


function solve(input) {
    let { nums, index } = prepare(input);
    let i = nums.length + 1;
    let lastNumber = nums[nums.length - 1];
    while (i < 2020 + 1) {
        let lastNumber = nums[i - 2];
        let nextNumber;
        if (index[lastNumber]) {
            nextNumber = i - 1 - index[lastNumber];
        } else {
            nextNumber = 0;
        }
        index[lastNumber] = i - 1;
        nums[i - 1] = nextNumber;
        i++;
    }
    console.log(nums[nums.length - 1]);
}
