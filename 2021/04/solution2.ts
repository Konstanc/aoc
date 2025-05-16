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
    let t = input
        .split('\n\n').filter(line => line != '')

    let numbers = t[0].split(',')
        .map(n => parseInt(n));
    let cs = t.slice(1)
        .map(sc => ({ rows: sc.split('\n').filter(line => line != '') }))


    let cards = cs.map(c => {
        let rows = c.rows.map(r => r.split(' ').filter(s => s != '').map(v => parseInt(v)));
        let cols: number[][] = Array.from(rows[0], (v) => []);
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            for (let j = 0; j < row.length; j++) {
                cols[j].push(row[j]);
            }
        }
        return { rows, cols }
    });
    return { numbers, cards };
}

function calcRes(data: ReturnType<typeof prepare>) {
    for (let i = 0; i < data.numbers.length; i++) {
        let n = data.numbers[i];

        let j = 0;
        while (j < data.cards.length) {
            let win = false;
            if (playCheckCard(n, data.cards[j])) {
                if (data.cards.length == 1) {
                    return calcScore(data.cards[j]) * n;
                } else {
                    win = true;
                    data.cards.splice(j, 1);
                }
            }
            if (!win) j++;
        }
    }
    return 0;
}

function playCheckCard(n: number, card: {
    rows: number[][];
    cols: number[][];
}) {
    let win = false;
    for (let i = 0; i < card.rows.length; i++) {
        let row = card.rows[i];
        let ind = row.indexOf(n);
        if (ind >= 0) {
            row.splice(ind, 1);
        }
        if (card.rows[i].length == 0) {
            win = true;
        }
    }
    for (let i = 0; i < card.cols.length; i++) {
        let col = card.cols[i];
        let ind = col.indexOf(n);
        if (ind >= 0) {
            col.splice(ind, 1);
        }
        if (card.cols[i].length == 0) {
            win = true;
        }
    }
    return win;
}

function calcScore(card: {
    rows: number[][];
    cols: number[][];
}) {
    let res = 0;
    for (let i = 0; i < card.rows.length; i++) {
        let row = card.rows[i];
        res += row.reduce((acc, val) => acc + val, 0);
    }
    return res;
}

function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);
    // 3640
}
