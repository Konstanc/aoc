declare var require: any
const fs = require('fs')
const perf = require('perf_hooks').performance;
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
let cupTrees: Tree[] = []

function rotateToNext(cups: Tree) {
    let d: number[];
    //d = treeToAr(cups);
    let index = 0;
    let sRes = spliceAt(cups, 0);
    cups = sRes.newGlobal ? sRes.newGlobal : cups;
    let oneCup = sRes.res;
    //d = treeToAr(cups);
    putTo(cups, totalCups - 1, oneCup);
    return cups;
}

function findDestIndex(toFind: number, cups: Tree, ignored: number[]) {
    // let min = Math.min(...cups);
    while (true) {
        if (ignored.indexOf(toFind) >= 0) {
            toFind--;
        } else if (toFind < 1) {
            toFind = totalCups;
        } else {
            return getIndex(toFind);
        }
    }
}

function play(tree: Tree, moves: number) {
    let d: number[];
    let r1 = perf.now();
    for (let i = 0; i < moves; i++) {
        //d = treeToAr(tree);
        let curCup = atIndex(tree, 0);
        tree = rotateToNext(tree);
        //d = treeToAr(tree);
        let picked: Tree[] = [];
        for (let j = 0; j < 3; j++) {
            let sRes = spliceAt(tree, 0);
            tree = sRes.newGlobal ? sRes.newGlobal : tree;
            picked.push(sRes.res);
            //d = treeToAr(tree);
        }
        let placeIndex = findDestIndex(curCup.value - 1, tree, picked.map(cup => cup.value));
        for (let j = 2; j >= 0; j--) {
            putTo(tree, placeIndex + 1, picked[j])
            //d = treeToAr(tree);
        }
        // d = treeToAr(tree);
        if (i % 100000 == 0) {
            console.log(i);
        }
        if (deepestPut > 6000) {
            let t1 = perf.now();
            tree = balance(tree);
            let t2 = perf.now();
            console.log(i + ' tree ' + (t2 - t1) + ' ms');
            let r2 = perf.now();
            console.log(i + ' reg ' + (r2 - r1) + ' ms');
            r1 = perf.now();
            deepestPut = 0;
        }
        // d = treeToAr(tree);
        // console.log(i, d.join(', '));
    }
    return tree;
}

type Tree = {
    startShift: number;
    value?: number;
    head?: Tree;
    tail?: Tree;
    parent?: Tree
}

function toTree(cups: number[], parent?: Tree) {
    let res: Tree;
    if (cups.length == 1) {
        res = { value: cups[0], parent, startShift: 0 };
        cupTrees[cups[0]] = res;
    } else {
        let tailIndex = Math.ceil(cups.length / 2);
        res = { startShift: 0, parent };
        res.head = toTree(cups.slice(0, tailIndex), res);
        res.tail = toTree(cups.slice(tailIndex), res);
        res.tail.startShift = tailIndex;
    }
    return res;
}

function balance(tree: Tree) {
    cupTrees = [];
    return toTree(treeToAr(tree))
}

function spliceAt(tree: Tree, atIndex: number): { newGlobal?: Tree, res: Tree } {
    let d;
    // d = treeToAr(tree);
    if (tree.value) {
        let parent = tree.parent;
        let grand = parent.parent;
        //let g = treeToAr(grand);
        //let p = treeToAr(parent);
        let brother = tree == parent.head
            ? parent.tail
            : parent.head;
        if (!grand) {
            parent = brother;
            delete parent.parent;
            parent.startShift = 0;
            return { newGlobal: parent, res: tree };
        } else if (parent == grand.head) {
            grand.head = brother;
            brother.parent = grand;
            brother.startShift = 0;
        } else {
            grand.tail = brother;
            brother.parent = grand;
            brother.startShift = parent.startShift;
        }
        // g = treeToAr(grand);
        // p = treeToAr(parent);
        return { res: tree };
    } else {
        if (atIndex < tree.tail.startShift) {
            tree.tail.startShift--;
            let res = spliceAt(tree.head, atIndex);
            return res;
        } else {
            return spliceAt(tree.tail, atIndex - tree.tail.startShift);
        }
    }
}

let deepestPut = 0;
function putTo(tree: Tree, atIndex: number, cup: Tree, curDeep = 0) {
    deepestPut = Math.max(curDeep, deepestPut);
    if (tree.value) {
        let parent = tree.parent;
        let newNode: Tree = atIndex == 0
            ? { startShift: tree.startShift, parent: tree.parent, head: cup, tail: tree }
            : { startShift: tree.startShift, parent: tree.parent, head: tree, tail: cup };
        if (atIndex == 0) {
            cup.startShift = 0;
            tree.startShift = 1;
        } else {
            tree.startShift = 0;
            cup.startShift = 1;
        }
        cup.parent = newNode;
        tree.parent = newNode;
        if (tree == parent.head) {
            parent.head = newNode;
        } else {
            parent.tail = newNode;
        }
    } else {
        let res;
        if (atIndex < tree.tail.startShift) {
            tree.tail.startShift++;
            res = putTo(tree.head, atIndex, cup, curDeep + 1);
        } else {
            res = putTo(tree.tail, atIndex - tree.tail.startShift, cup, curDeep + 1);
        }
        return res;
    }
}

function atIndex(tree: Tree, index: number): Tree {
    if (tree.value) {
        return tree;
    } else {
        if (index < tree.tail.startShift) {
            return atIndex(tree.head, index);
        } else {
            return atIndex(tree.tail, index - tree.tail.startShift);
        }
    }
}

function getIndex(toFind: number) {
    let curTree = cupTrees[toFind];
    let res = 0;
    while (curTree) {
        res += curTree.startShift;
        curTree = curTree.parent;
    }
    return res;
}


function treeToAr(tree: Tree): number[] {
    if (tree.value) {
        return [tree.value];
    } else {
        let res = treeToAr(tree.head);
        return res.concat(treeToAr(tree.tail));
    }
}

function treeToArF(tree: Tree) {
    if (!tree) return;
    if (tree.value) {
        return tree.value;
    } else {
        return `[${treeToArF(tree.head)}, ${treeToArF(tree.tail)}]`;
    }
}

function solve(input: string) {
    let moves = 10000000;
    let cups = prepare(input);
    for (let i = cups.length; i < totalCups; i++) {
        cups[i] = i + 1;
    }
    let tree = toTree(cups);
    let afterTree = play(tree, moves);
    let magic = getIndex(1);
    let afterAr = treeToAr(afterTree);
    let one = afterAr[magic + 0];
    let a = afterAr[magic + 1];
    let b = afterAr[magic + 2]
    console.log(a, b);
    // 901620 243600
    // 219 634 632 000
}

