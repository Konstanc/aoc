const fs = require('fs');
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});
let size = 3;
function prepare(input) {
    let tiles = input
        .split('\r\n\r\n')
        .map(p => {
        let lines = p.split('\r\n');
        let id = lines[0].substring(5, lines[0].length - 1);
        let image = lines.slice(1)
            .map(line => line.split(''));
        return { id, image };
    });
    return tiles;
}
function withEdges(tile) {
    let edges = [];
    edges[0] = tile.image[0];
    edges[1] = [];
    edges[2] = tile.image[tile.image.length - 1];
    edges[3] = [];
    for (let i = 0; i < tile.image.length; i++) {
        edges[1].push(tile.image[i][tile.image[i].length - 1]);
        edges[3].push(tile.image[i][0]);
    }
    return {
        id: tile.id,
        subId: tile.subId,
        image: tile.image,
        edges
    };
}
let orIndex = {};
function allOrs(tile) {
    if (orIndex[tile.id]) {
        return orIndex[tile.id];
    }
    let res = [];
    let l = tile.image.length;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2; j++) {
            let newTile = { ...tile };
            newTile.image = [];
            for (let y = 0; y < tile.image.length; y++) {
                newTile.image.push([]);
                for (let x = 0; x < tile.image.length; x++) {
                    if (i == 0) {
                        newTile.image[y][x] = tile.image[y][x];
                    }
                    else if (i == 1) {
                        newTile.image[y][x] = tile.image[l - x - 1][y];
                    }
                    else if (i == 2) {
                        newTile.image[y][x] = tile.image[l - y - 1][l - x - 1];
                    }
                    else if (i == 3) {
                        newTile.image[y][x] = tile.image[x][l - y - 1];
                    }
                }
            }
            if (j == 1) {
                newTile.image = newTile.image
                    .map(line => line.reverse());
            }
            newTile.subId = '' + tile.id + '.' + (i * 2 + j);
            res.push(newTile);
        }
    }
    orIndex[tile.id] = res.map(t => withEdges(t));
    return orIndex[tile.id];
}
let sameEdgeDownIndex = {};
let sameEdgeRighIndex = {};
function sameEdge(toDown, t1, t2) {
    let index = toDown ? sameEdgeDownIndex : sameEdgeRighIndex;
    if (!index[t1.subId]) {
        index[t1.subId] = {};
    }
    if (t2.subId in index[t1.subId]) {
        return index[t1.subId][t2.subId];
    }
    let e1;
    let e2;
    if (toDown) {
        e1 = t1.edges[2];
        e2 = t2.edges[0];
    }
    else {
        e1 = t1.edges[1];
        e2 = t2.edges[3];
    }
    let res = e1.every((e, index) => e == e2[index]);
    index[t1.subId][t2.subId] = res;
    return res;
}
function nextXY(x, y) {
    let [newX, newY] = y == 0 ? [0, x + 1] : [x + 1, y - 1];
    if (newY >= size || newX >= size) {
        [newX, newY] = nextXY(newX, newY);
    }
    return [newX, newY];
}
function fit(x, y, image, tiles) {
    let possibleTiles = [];
    if (x == 0 && y == 0) {
        tiles.forEach(id => allTileIndex[id].subTiles.forEach(subTile => {
            possibleTiles.push({ id: subTile.id, subId: subTile.subId });
        }));
    }
    else {
        if (x == 0) {
            let tileUp = image[y - 1][x];
            possibleTiles = Object.values(globalToDownIndex[tileUp.subId]);
        }
        else {
            let tileLeft = image[y][x - 1];
            possibleTiles = Object.values(globalToRightIndex[tileLeft.subId]);
            if (y != 0) {
                let tileUp = image[y - 1][x];
                let tileUpIndex = globalToDownIndex[tileUp.subId];
                possibleTiles = possibleTiles.filter(pTile => pTile.subId in tileUpIndex);
            }
        }
    }
    possibleTiles = possibleTiles.filter(pTile => tiles.includes(pTile.id));
    for (let i = 0; i < possibleTiles.length; i++) {
        let pTile = possibleTiles[i];
        let newImage = image.slice();
        newImage[y] = image[y].slice();
        newImage[y][x] = allSubTileIndex[pTile.subId];
        let newTiles = tiles.filter(id => id != pTile.id);
        // let newTiles = tiles.slice(1);
        if (newTiles.length != tiles.length - 1) {
            console.log(tiles);
            console.log('alarm');
        }
        if (newTiles.length == 0) {
            return newImage;
        }
        let [newX, newY] = nextXY(x, y);
        let found = fit(newX, newY, newImage, newTiles);
        if (found) {
            return found;
        }
        // console.log('never here')
    }
    return false;
}
function fitSquares(tiles) {
    let x = 0;
    let y = 0;
    let image = Array.from(Array(size), a => []);
    return fit(0, 0, image, tiles.map(tile => tile.id));
}
let globalToDownIndex = {};
let globalToRightIndex = {};
let allTileIndex = {};
let allSubTileIndex = {};
function fillGlobalIndex(tiles) {
    tiles.forEach(tile => {
        let subtTiles = allOrs(tile);
        tile.subTiles = subtTiles;
        allTileIndex[tile.id] = tile;
    });
    tiles.forEach(tile => {
        tile.subTiles.forEach(subTile => {
            allSubTileIndex[subTile.subId] = subTile;
            globalToDownIndex[subTile.subId] = {};
            globalToRightIndex[subTile.subId] = {};
            tiles.forEach(nextTile => {
                //if (nextTile.id != tile.id) {
                nextTile.subTiles.forEach(nextSubTile => {
                    if (sameEdge(true, subTile, nextSubTile)) {
                        globalToDownIndex[subTile.subId][nextSubTile.subId] = { id: nextSubTile.id, subId: nextSubTile.subId };
                    }
                    if (sameEdge(false, subTile, nextSubTile)) {
                        globalToRightIndex[subTile.subId][nextSubTile.subId] = { id: nextSubTile.id, subId: nextSubTile.subId };
                    }
                });
                //}
            });
        });
    });
}
function globalStats() {
    let stats = Array.from(Array(100), (_, i) => ({ i, countDown: 0, countRight: 0 }));
    for (let key in globalToDownIndex) {
        let l = Object.values(globalToDownIndex[key]).length;
        stats[l].countDown++;
        let lr = Object.values(globalToRightIndex[key]).length;
        stats[l].countRight++;
    }
    stats = stats.filter(s => s.countDown != 0 && s.countRight != 0);
    stats.sort((a, b) => b.countDown - a.countDown);
    console.log(stats);
    console.log('===========');
    /* stats = Array.from(Array(100), (_, i) => ({ i, count: 0 }));
    for (let key in globalToDownIndex) {
        let l = Object.values(globalToRightIndex[key]).length;
        stats[l].count++;
    }
    stats.sort((a, b) => b.count - a.count);
    console.log(stats);*/
}
/* function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}*/
function solve(input) {
    // 12x12
    let tiles = prepare(input);
    // let tiles = shuffle(prepare(input));
    size = Math.sqrt(tiles.length);
    fillGlobalIndex(tiles);
    // globalStats();
    let image = fitSquares(tiles);
    if (!image) {
        console.log('no image');
    }
    else {
        let res = parseInt(image[0][0].id);
        res *= parseInt(image[0][size - 1].id);
        res *= parseInt(image[size - 1][0].id);
        res *= parseInt(image[size - 1][size - 1].id);
        console.log(res);
    }
    //12887949220441: too low
    //172561563240361: too high
}
//# sourceMappingURL=solution1.js.map