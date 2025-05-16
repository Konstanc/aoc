const fs = require('fs');
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});
function prepare(input) {
    let ids = input
        .split('\n');
    return ids;
}
function findAlmostSame(ids) {
    let twos = 0;
    let threes = 0;
    for (let i = 0; i < ids.length; i++) {
        const id1 = ids[i];
        for (let j = i + 1; j < ids.length; j++) {
            const id2 = ids[j];
            let res = sameExceptOne(id1, id2);
            if (res)
                return res;
        }
    }
}
function sameExceptOne(id1, id2) {
    let diff = 0;
    let res = '';
    for (let i = 0; i < id1.length; i++) {
        if (id1[i] == id2[i]) {
            res = res + id1[i];
        }
        else {
            diff++;
        }
        if (diff > 1)
            return false;
    }
    return diff == 1 ? res : false;
}
function solve(input) {
    let ids = prepare(input);
    let res = findAlmostSame(ids);
    console.log(res);
    // ymdrcyapvwfloiuktanxzjsieb
}
//# sourceMappingURL=solution2.js.map