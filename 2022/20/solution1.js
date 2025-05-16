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
    let lines = input
        .split('\r\n');
    return lines.map(parseFloat);
}
class ListEl {
    constructor(val) {
        this.val = val;
    }
}
function toList(numbers) {
    let firstEl, lastEl, zeroEl, prevEl;
    const ordered = [];
    for (let i = 0; i < numbers.length; i++) {
        const el = new ListEl(numbers[i]);
        if (i == 0)
            firstEl = el;
        if (i == numbers.length - 1)
            lastEl = el;
        if (el.val == 0)
            zeroEl = el;
        if (prevEl) {
            prevEl.next = el;
            el.prev = prevEl;
        }
        ordered.push(el);
        prevEl = el;
    }
    firstEl.prev = lastEl;
    lastEl.next = firstEl;
    return { ordered, zeroEl };
}
function move(el) {
    // console.log(listToString(el));
    if (el.val > 0) {
        for (let i = 0; i < Math.abs(el.val); i++) {
            const next = el.next;
            const prev = el.prev;
            el.next = next.next;
            el.prev = next;
            next.prev = prev;
            next.next.prev = el;
            next.next = el;
            prev.next = next;
            // console.log(listToString(el));
        }
    }
    else {
        for (let i = 0; i < Math.abs(el.val); i++) {
            const next = el.next;
            const prev = el.prev;
            el.prev = prev.prev;
            el.next = prev;
            prev.next = next;
            prev.prev.next = el;
            prev.prev = el;
            next.prev = prev;
            // console.log(listToString(el));
        }
    }
}
function mix(numbers) {
    const { ordered, zeroEl } = toList(numbers);
    ordered.forEach(el => {
        move(el);
        // console.log('-----');
    });
    return zeroEl;
}
function valAt(zeroEl, n, length) {
    n = n % length;
    let el = zeroEl;
    for (let i = 0; i < Math.abs(n); i++) {
        el = n > 0 ? el.next : el.prev;
    }
    return el.val;
}
function listToString(zeroEl) {
    let res = [];
    let el = zeroEl;
    do {
        res.push(el.val);
        el = el.next;
    } while (el != zeroEl);
    return res.join(', ');
}
function solve(input) {
    let numbers = prepare(input);
    let zeroEl = mix(numbers);
    const nums = [
        valAt(zeroEl, 1000, numbers.length),
        valAt(zeroEl, 2000, numbers.length),
        valAt(zeroEl, 3000, numbers.length),
    ];
    console.log(nums.reduce((acc, n) => acc + n, 0));
}
//# sourceMappingURL=solution1.js.map