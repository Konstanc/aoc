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
    /* let data = input.trim()
        .split('\n').filter(line => line != '')
        .map(s => s.trim())
        .map(s => {
            let ss = s.split(' ');
            let c = ss[1].split(',')
                .map(ss =>
                    ss.substring(2)
                        .split('..')
                        .map(sss => parseInt(sss))
                );
            return {
                on: ss[0] == 'on' ? true : false,
                cub: c
            }

        });*/
    let hall = Array(11).fill('');
    let rooms = {};
    rooms[2] = ['C', 'B'];
    rooms[4] = ['A', 'A'];
    rooms[6] = ['B', 'D'];
    rooms[8] = ['D', 'C'];

    let target = {
        'A': 2,
        'B': 4,
        'C': 6,
        'D': 8,
    };

    return { hall, rooms, target, roomKeys: [2, 4, 6, 8] };
}

function calcRes(data: ReturnType<typeof prepare>) {
    let res = 0;
    let board = data;
    res = getMinToFinish(board, {});
    return res;
}

let bIndex = {};
function getMinToFinish(board: ReturnType<typeof prepare>, alreadySeen) {
    let ind = getBoardIndex(board)
    if (bIndex[ind]) {
        return bIndex[ind];
    }
    if (alreadySeen[ind]) {
        return Number.MAX_VALUE;
    }
    alreadySeen[ind] = true;
    let res = Number.MAX_VALUE;
    if (isBoardReady(board)) {
        res = 0;
    } else {
        let moved = false;
        for (let i = 0; i < board.hall.length; i++) {
            if (board.hall[i]) {
                let mh = moveFromHall(i, board);
                if (mh) {
                    moved = true;
                    res = Math.min(
                        res,
                        mh.res + getMinToFinish(mh.newBoard, alreadySeen),
                    );
                }
            }
        }
        for (let i = 0; i < board.roomKeys.length; i++) {
            let ri = board.roomKeys[i];
            let mr = moveFromRoom(ri, board);
            if (mr) {
                moved = true;
                let mrCost = Math.min(...mr.map(r => {
                    return r.res + getMinToFinish(r.newBoard, alreadySeen);
                }));
                res = Math.min(res, mrCost);
            }
        }
        if (!moved) {
            res = Number.MAX_VALUE;
        }
    }
    delete alreadySeen[ind];
    bIndex[ind] = res;
    return res;
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
    if (!newBoard.rooms[pos][1]) {
        newBoard.rooms[pos][1] = char;
        res += cost * 2;
    } else {
        newBoard.rooms[pos][0] = char;
        res += cost * 1;
    }
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
    if (board.rooms[pos][0]) {
        char = board.rooms[pos][0];
        startBoard.rooms[pos][0] = '';
        rCost = 1;
    } else {
        char = board.rooms[pos][1];
        startBoard.rooms[pos][1] = '';
        rCost = 2;
    }
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
        for (let j = 0; j < 2; j++) {
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
            .map((r: any) => r.join(''))
            .join(',')
    ].join('_');
}


function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);

}
