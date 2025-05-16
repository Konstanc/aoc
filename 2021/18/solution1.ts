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
    // input = '[[[[[9,8],1],2],3],4]';
    /*input = `[1,1]
    [2,2]
    [3,3]
    [4,4]
    [5,5]
    [6,6]`;*/
    /*input = `
    [[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]
[[[5,[2,8]],4],[5,[[9,9],0]]]
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]]
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]]
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]]
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]]
[[[[5,4],[7,7]],8],[[8,3],8]]
[[9,3],[[9,9],[6,[4,9]]]]
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]]
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]]
    `;*/
    /*input = `[[[[4,3],4],4],[7,[[8,4],9]]]
    [1,1]`;*/
    let data = input.trim()
        .split('\n').filter(line => line != '')
        .map(s => s.trim())
        .map(s => s.split('')
            .map(s => {
                switch (s) {
                    case '[':
                        return { type: '[', val: '[' };
                        break;
                    case ']':
                        return { type: ']', val: ']' };
                        break;
                    case ',':
                        return { type: ',', val: ',' };
                        break;
                    default:
                        return { type: 'n', val: parseInt(s) };
                        break;
                }
            }));
    return data;
}

function calcRes(data: ReturnType<typeof prepare>) {
    let res = 0;

    let pairs = data.map(d => parsePair(d));
    let addedPairs = pairs.reduce((acc, val) => addPairs(acc, val));

    return magn(addedPairs);
}


function addPairs(p1, p2) {
    console.log('addPairs');
    let lastNum = findLastNum(p1);
    let firstNum = findFirstNum(p2);
    let pair = {
        pair: [p1, p2],
        parent: null,
    }
    p1.parent = pair;
    p2.parent = pair;
    lastNum.next = firstNum || null;
    firstNum.prev = lastNum || null;
    reducePair(pair);
    return pair;
}

function findFirstNum(pair) {
    if (pair.isValue) return pair;
    return findFirstNum(pair.pair[0]) || findFirstNum(pair.pair[1]);
}

function findLastNum(pair) {
    if (pair.isValue) return pair;
    return findLastNum(pair.pair[1]) || findLastNum(pair.pair[0]);
}

function reducePair(pair) {
    let reducing = true;
    while (reducing) {
        reducing = false;
        let expPair = pairToExplode(pair);
        if (expPair) {
            explode(expPair);
            reducing = true;
        } else {
            let splitPair = pairToSplit(pair);
            if (splitPair) {
                split(splitPair);
                reducing = true;
            }

        }
    }
    return pair;
}

function split(pair) {
    let value = pair.value;
    pair.isValue = false;
    pair.pair = [
        {
            isValue: true,
            value: Math.floor(value / 2),
            parent: pair

        },
        {
            isValue: true,
            value: Math.ceil(value / 2),
            parent: pair
        }
    ];
    pair.pair[0].next = pair.pair[1];
    pair.pair[1].prev = pair.pair[0];
    if (pair.prev) {
        pair.prev.next = pair.pair[0];
        pair.pair[0].prev = pair.prev;
    }
    if (pair.next) {
        pair.next.prev = pair.pair[1];
        pair.pair[1].next = pair.next;
    }
}

function explode(pair) {
    let newPair: any = {
        isValue: true,
        value: 0,
        parent: pair.parent
    }
    if (pair.parent.pair[0] == pair) {
        pair.parent.pair[0] = newPair;
    } else {
        pair.parent.pair[1] = newPair;
    }
    if (pair.pair[0].prev /*&& pair[0].isValue*/) {
        pair.pair[0].prev.value += pair.pair[0].value;
        newPair.prev = pair.pair[0].prev;
        pair.pair[0].prev.next = newPair;
    }
    if (pair.pair[1].next /*&& pair[1].isValue*/) {
        pair.pair[1].next.value += pair.pair[1].value;
        newPair.next = pair.pair[1].next;
        pair.pair[1].next.prev = newPair;
    }
}

function pairToSplit(pair) {
    if (pair.isValue && pair.value >= 10) {
        return pair;
    }
    if (!pair.isValue) {
        return pairToSplit(pair.pair[0]) ||
            pairToSplit(pair.pair[1])
    }
    return null;
}

function pairToExplode(pair, curDeep = 0) {
    if (curDeep == 4 && !pair.isValue) {
        return pair;
    }
    if (!pair.isValue) {
        return pairToExplode(pair.pair[0], curDeep + 1) ||
            pairToExplode(pair.pair[1], curDeep + 1)
    }
    return null;
}

function magn(pair) {
    if (pair.isValue) {
        return pair.value;
    }
    return 3 * magn(pair.pair[0]) + 2 * magn(pair.pair[1]);
}

function parsePair(line: ({
    type: string;
    val: string;
} | {
    type: string;
    val: number;
})[]) {
    let homePair = {
        pair: [],
        left: null,
        right: null,
        parent: null,
    }
    let outPair: any = homePair;
    let newPair: any;
    let lastVal: any;
    for (let i = 0; i < line.length; i++) {
        switch (line[i].type) {
            case '[':
                newPair = {
                    pair: [],
                    parent: outPair
                }
                outPair.pair.push(newPair);
                outPair = newPair;
                break;
            case 'n':
                newPair = {
                    isValue: true,
                    value: line[i].val,
                    parent: outPair
                }
                if (lastVal) {
                    newPair.prev = lastVal;
                    lastVal.next = newPair;
                }
                lastVal = newPair;
                outPair.pair.push(newPair);
                break;
            case ']':
                outPair = outPair.parent;
                break;
            default:
                break;
        }
    }
    return homePair.pair[0];
}

function solve(input: string) {
    let data = prepare(input);
    let res = calcRes(data);

    console.log(res);

}
