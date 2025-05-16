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

function prepare(input: string) {
    let setup = input
        .split('')
        .map(c => parseInt(c))
    return setup;
}

const totalCups = 1000000;
// const totalCups = 9;
let chunkIndex: Chunk[];

type Chunk = {
    prev: Chunk,
    next: Chunk,
    // cups: number[]
    cup: number
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
            return searchInChunks(toFind);
        }
    }
}
function searchInChunks(toFind: number) {
    let res = chunkIndex[toFind];
    return res;
}

function play(chunk: Chunk, moves: number) {
    let cur = 0;
    for (let i = 0; i < moves; i++) {

        let curCup = chunk.cup;
        let picked = dSplice3(chunk);
        let found = findDestChunkIndex(curCup - 1, chunk, picked.map(c => c.cup));
        dInsert(picked, found);
        if (i % 100000 == 0) {
            console.log(i);
        }
        // console.log(i, toArr(chunk).join(', '));
        chunk = chunk.next;
    }
    return chunk;
}
function dSplice3(chunk: Chunk) {
    let cups: Chunk[] = [];
    let curChunk = chunk.next;
    while (cups.length < 3) {
        cups.push(curChunk);
        curChunk = curChunk.next
    }
    chunk.next = curChunk;
    curChunk.prev = chunk;
    return cups;
}

function dInsert(picked: Chunk[], startChunk: Chunk) {
    let lastChunk = startChunk.next;
    // Алиса, это - пудинг
    startChunk.next = picked[0];
    // Пудинг, это - Алиса
    picked[0].prev = startChunk;

    picked[2].next = lastChunk;
    lastChunk.prev = picked[2];
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
        res.push(chunk.cup);
        chunk = chunk.next;
    } while (chunk != startChunk);
    return res;
}

function prepareCups(cups: number[]) {
    chunkIndex = Array(totalCups + 1);
    let chunk: Chunk;
    let prevChunk: Chunk;
    let startChunk: Chunk;
    for (let i = 0; i < cups.length; i++) {

        chunk = <Chunk>{ cup: cups[i] };
        if (prevChunk) {
            prevChunk.next = chunk;
            chunk.prev = prevChunk;
        }
        if (i == 0) {
            startChunk = chunk;
        }
        chunkIndex[cups[i]] = chunk;
        prevChunk = chunk;
    }
    startChunk.prev = chunk;
    chunk.next = startChunk;
    return startChunk;
}

function solve(input: string) {
    let moves = 10000000;
    let cups = prepare(input);
    for (let i = cups.length; i < totalCups; i++) {
        cups[i] = i + 1;
    }
    let sChunk = prepareCups(cups);
    let chunk = play(sChunk, moves);
    let ar = toArr(chunk);

    let magic = searchInChunks(1);
    let a = magic.next.cup;
    let b = magic.next.next.cup;
    console.log(a, b);
    console.log('yo');
}