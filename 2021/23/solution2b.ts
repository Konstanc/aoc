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
    let hall = Array(11).fill('');
    let rooms = {};
    /* rooms[2] = ['C', 'B'];
    rooms[4] = ['A', 'A'];
    rooms[6] = ['B', 'D'];
    rooms[8] = ['D', 'C'];*/

    // input
    rooms[2] = ['C', 'D', 'D', 'B'];
    rooms[4] = ['A', 'C', 'B', 'A'];
    rooms[6] = ['B', 'B', 'A', 'D'];
    rooms[8] = ['D', 'A', 'C', 'C'];

    // example
    rooms[2] = ['B', 'D', 'D', 'A'];
    rooms[4] = ['C', 'C', 'B', 'D'];
    rooms[6] = ['B', 'B', 'A', 'C'];
    rooms[8] = ['D', 'A', 'C', 'A'];

    let target = {
        'A': 2,
        'B': 4,
        'C': 6,
        'D': 8,
    };

    return { hall, rooms, target, roomKeys: [2, 4, 6, 8] };
}

function calcRes(data: ReturnType<typeof prepare>) {
    let res: any;
    let board = data;
    res = getMinToFinish(board, {});
    let trace = res.trace;
    let lastStep = 0;
    let total = 0;
    while (trace) {
        let nextRes = (trace.nextTrace && trace.nextTrace.res) || 0;
        let step = trace.res - nextRes;
        total += lastStep;
        console.log(lastStep, '     ', total);
        let b = indToBoard(trace.ind);
        printBoard(b);
        console.log('----------------');

        lastStep = step;
        trace = trace.nextTrace;
    }
    return res.res;
}

let bIndex = {};
function getMinToFinish(board: ReturnType<typeof prepare>, alreadySeen) {
    let ind = getBoardIndex(board)
    if (bIndex[ind]) {
        return bIndex[ind];
    }
    if (alreadySeen[ind]) {
        return { res: Number.MAX_VALUE };
    }
    alreadySeen[ind] = true;
    let res = Number.MAX_VALUE;
    let nextTrace;
    if (isBoardReady(board)) {
        res = 0;
    } else {
        let moved = false;
        for (let i = 0; i < board.hall.length; i++) {
            if (board.hall[i]) {
                let mh = moveFromHall(i, board);
                if (mh) {
                    moved = true;
                    let nextRes = getMinToFinish(mh.newBoard, alreadySeen);
                    if (mh.res + nextRes.res < res) {
                        res = mh.res + nextRes.res;
                        nextTrace = nextRes.trace;
                    }

                }
            }
        }
        for (let i = 0; i < board.roomKeys.length; i++) {
            let ri = board.roomKeys[i];
            let mr = moveFromRoom(ri, board);
            if (mr && mr.length > 0) {
                moved = true;
                for (let j = 0; j < mr.length; j++) {
                    let nextRes = getMinToFinish(mr[j].newBoard, alreadySeen);
                    if (mr[j].res + nextRes.res < res) {
                        res = mr[j].res + nextRes.res;
                        nextTrace = nextRes.trace;
                    }
                }
            }
        }
        if (!moved) {
            res = Number.MAX_VALUE;
        }
    }
    delete alreadySeen[ind];
    let trace = {
        res,
        ind,
        nextTrace
    }
    let ret = {
        res,
        trace
    }
    bIndex[ind] = ret;
    return ret;
}

function copyBoard(board: ReturnType<typeof prepare>) {
    let rooms = {};
    for (let i = 0; i < board.roomKeys.length; i++) {
        let ri = board.roomKeys[i]
        rooms[ri] = [...board.rooms[ri]];
    }
    let newBoard = {
        hall: [...board.hall],
        rooms,
        roomKeys: board.roomKeys,
        target: board.target,
    }
    return newBoard;
}

let costs = {
    'A': 1,
    'B': 10,
    'C': 100,
    'D': 1000,
}
function moveFromHall(pos: number, board: ReturnType<typeof prepare>) {
    let char = board.hall[pos];
    let cost = costs[char];
    let targetRoomPos = board.target[char];
    if (board.rooms[targetRoomPos][0] != '') {
        return false;
    }
    if (board.rooms[targetRoomPos].some(c => (c != '' && c != char))) {
        return false;
    }
    let oldPos = pos;
    let res = 0;
    while (pos != targetRoomPos) {
        let dPos = pos < targetRoomPos ? 1 : -1;
        pos += dPos;
        if (board.hall[pos]) {
            return false;
        }
        res += cost;
    }
    let newBoard = copyBoard(board);
    newBoard.hall[oldPos] = '';
    let rPos = 0;
    res += cost;
    while (rPos < 4 - 1 && newBoard.rooms[pos][rPos + 1] == '') {
        rPos++;
        res += cost;
    }
    newBoard.rooms[pos][rPos] = char;
    return { res, newBoard };
}

function moveFromRoom(pos: number, board: ReturnType<typeof prepare>) {
    if (board.hall[pos]) {
        return false;
    }
    if (!board.rooms[pos].some(c => c != '')) {
        return false;
    }
    let char = '';
    let rCost = 0;
    let startBoard = copyBoard(board);
    let rPos = board.rooms[pos].findIndex(c => c != '');
    char = board.rooms[pos][rPos];
    if (board.target[char] == pos &&
        !board.rooms[pos].some(c => (c != '' && c != char))) {
        return false;
    }
    startBoard.rooms[pos][rPos] = '';
    rCost = rPos + 1;

    startBoard.hall[pos] = char;
    let cost = costs[char];
    let startCost = cost * rCost;
    let mh = moveFromHall(pos, startBoard);
    if (mh) {
        return [{
            res: startCost + mh.res,
            newBoard: mh.newBoard
        }];
    }

    startBoard.hall[pos] = '';
    let variants = [];
    for (let i = pos - 1; i >= 0; i--) {
        if (board.hall[i]) {
            i = -1;
        } else {
            let newBoard = copyBoard(startBoard);
            newBoard.hall[i] = char;
            variants.push({
                res: startCost + (pos - i) * cost,
                newBoard
            });
        }
    }
    for (let i = pos + 1; i < board.hall.length; i++) {
        if (board.hall[i]) {
            i = board.hall.length + 1;
        } else {
            let newBoard = copyBoard(startBoard);
            newBoard.hall[i] = char;
            variants.push({
                res: startCost + (i - pos) * cost,
                newBoard
            });
        }
    }
    return variants;
}

function isBoardReady(board: ReturnType<typeof prepare>) {
    for (let i = 0; i < board.roomKeys.length; i++) {
        let ri = board.roomKeys[i];
        for (let j = 0; j < board.rooms[ri].length; j++) {
            if (!board.rooms[ri][j]) {
                return false;
            }
            if (board.target[board.rooms[ri][j]] != ri) {
                return false;
            }
        }
    }
    return true;
}

function getBoardIndex(board: ReturnType<typeof prepare>) {
    return [
        board.hall.join(','),
        Object.values(board.rooms)
            .map((r: any) => r.join(','))
            .join(';')
    ].join('_');
}

function indToBoard(ind: string) {
    let sInd = ind.split('_');
    let hall = sInd[0].split(',');
    let rooms = {};
    let sR = sInd[1].split(';');
    for (let i = 0; i < sR.length; i++) {
        rooms[2 + i * 2] = sR[i].split(',');
    }
    return { hall, rooms };
}

function printBoard(board: any) {
    console.log('############')
    let line = '';
    for (let j = 0; j < board.hall.length; j++) {
        if (board.hall[j]) {
            line += board.hall[j]
        } else {
            line += ' ';
        }
    }
    //line += '|';
    let res = [line];
    console.log(line + '#');
    line = '';
    for (let j = 0; j < board.hall.length + 1; j++) {
        if (board.rooms[j]) {
            line = line + ' ';
        } else if (j >= 1 && j <= 9) {
            line = line + '#';
        } else {
            line = line + '#';
        }
    }
    console.log(line);
    for (let i = 0; i < 4; i++) {
        line = '';
        for (let j = 0; j < board.hall.length; j++) {
            if (board.rooms[j]) {
                line = line + (board.rooms[j][i] || ' ');
            } else if (j >= 1 && j <= 9) {
                line = line + '#';
            } else {
                line = line + ' ';
            }
        }
        //line += '|';
        res.push(line);
        console.log(line);
    }
    console.log(' #########');
    return res.join('|');
}

function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);

}
