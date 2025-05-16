declare var require: any
const fs = require('fs')
// let fileName = 'input.txt';
let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});

function prepare(input: string) {
    let setup = input
        .split('')
        .map(c => parseInt(c))
    return setup;
}

const totalCups = 1000000;
// const totalCups = 9;

type Chunk = {
    prev: Chunk,
    next: Chunk,
    cups: number[]
}

function rotateTo(index: number, cups: number[]) {
    let l = cups.length;
    index = index % l;
    let newCups = cups.slice(index);
    newCups.push(...cups.slice(0, index));
    return newCups;
}

function findDestChunkIndex(toFind: number, chunk: Chunk, ignored: number[]) {
    while (true) {
        if (ignored.indexOf(toFind) >= 0) {
            toFind--;
        } else if (toFind < 1) {
            toFind = totalCups;
        } else {
            return searchInChunks(toFind, chunk);
        }
    }
}
function searchInChunks(toFind: number, chunk: Chunk) {
    while (true) {
        let index = chunk.cups.indexOf(toFind);
        if (index >= 0) {
            return { index, chunk };
        } else {
            chunk = chunk.prev;
        }
    }
}


function play(chunk: Chunk, moves: number) {
    let cur = 0;
    for (let i = 0; i < moves; i++) {
        if (cur >= chunk.cups.length) {
            chunk = chunk.next;
            cur = 0;
        }
        if (i == 7) {
            let a = '';
        }
        let curCup = chunk.cups[cur];
        let picked = dSplice3(chunk, cur + 1);
        let pci = findDestChunkIndex(curCup - 1, chunk, picked);
        dInsert(picked, pci.chunk, pci.index + 1);
        if (i % 100000 == 0) {
            console.log(i);
        }
        cur++;
    }
    return chunk;
}
function dSplice3(chunk: Chunk, index: number) {
    let cups: number[] = [];
    let prevChunk = chunk;
    while (cups.length < 3) {
        let curL = cups.length;
        let prevCups = chunk.cups.slice(0, index);
        cups.push(...chunk.cups.slice(index, index + 3 - curL));
        let nextCups = chunk.cups.slice(index + 3 - curL);
        let nextChunk = chunk.next;
        if (nextCups.length) {
            nextChunk = {
                next: chunk.next,
                prev: chunk,
                cups: nextCups
            }
            chunk.next.prev = nextChunk;
        }
        if (prevCups.length) {
            chunk.cups = prevCups;
            chunk.next = nextChunk;
        } else {
            chunk.prev.next = nextChunk;
            nextChunk.prev = chunk.prev;
        }
        chunk = nextChunk;
        index = 0;

    }
    return cups;
}

function dInsert(cups: number[], chunk: Chunk, index: number) {
    if (index >= chunk.cups.length) {
        let newChunk = {
            next: chunk.next,
            prev: chunk,
            cups
        }
        chunk.next.prev = newChunk;
        chunk.next = newChunk;
    } else {
        let prevCups = chunk.cups.slice(0, index);
        let nextCups = chunk.cups.slice(index);
        chunk.cups = prevCups;
        let newChunk = {
            next: chunk,
            prev: chunk,
            cups
        }
        let nextChunk = {
            next: chunk.next,
            prev: newChunk,
            cups: nextCups
        }
        newChunk.next = nextChunk;
        chunk.next.prev = nextChunk;
        chunk.next = newChunk;
    }
}

/* function toCArr(chunk: Chunk) {
    let startChunk = chunk;
    let res = [];
    do {
        res.push(chunk.cups);
        chunk = chunk.next;
    } while (chunk != startChunk);
    return res.map(c => '[' + c.join(', ') + ']').join(',');
}

function toCArrBack(chunk: Chunk) {
    let startChunk = chunk;
    let res = [];
    do {
        res.push(chunk.cups);
        chunk = chunk.prev;
    } while (chunk != startChunk);
    return res.reverse().map(c => '[' + c.join(', ') + ']').join(',');
}*/

function toArr(chunk: Chunk) {
    let startChunk = chunk;
    let res = [];
    do {
        res.push(...chunk.cups);
        chunk = chunk.next;
    } while (chunk != startChunk);
    return res;
}

function prepareCups(cups: number[]) {
    let chunk: any = { cups };
    chunk.next = chunk;
    chunk.prev = chunk;
    return [<Chunk>chunk];
}

function solve(input: string) {
    let moves = 10000000;
    let cups = prepare(input);
    for (let i = cups.length; i < totalCups; i++) {
        cups[i] = i + 1;
    }
    let chunks = prepareCups(cups);
    let chunk = play(chunks[0], moves);
    let ar = toArr(chunk);

    /*let magic = getIndex(1);
    let a = afterAr[magic + 1];
    let b = afterAr[magic + 2]
    console.log(a, b);
    let after = play(0, cups, 100);*/
    console.log('yo');
}