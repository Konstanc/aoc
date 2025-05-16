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
        if (newTiles.length == 0) {
            return newImage;
        }
        let [newX, newY] = nextXY(x, y);
        let found = fit(newX, newY, newImage, newTiles);
        if (found) {
            return found;
        }
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
function getFullImage(image) {
    let fullImage = [];
    let w = image[0].length * 8;
    let h = image.length * 8;
    for (let y = 0; y < h; y++) {
        fullImage[y] = [];
        for (let x = 0; x < w; x++) {
            let subY = y % 8 + 1;
            let subX = x % 8 + 1;
            let imX = Math.floor(x / 8);
            let imY = Math.floor(y / 8);
            fullImage[y][x] = image[imY][imX].image[subY][subX];
        }
    }
    return fullImage;
}
function getAllFullOrs(image) {
    let res = [];
    let l = image.length;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2; j++) {
            let newImage = [];
            for (let y = 0; y < image.length; y++) {
                newImage.push([]);
                for (let x = 0; x < image.length; x++) {
                    if (i == 0) {
                        newImage[y][x] = image[y][x];
                    }
                    else if (i == 1) {
                        newImage[y][x] = image[l - x - 1][y];
                    }
                    else if (i == 2) {
                        newImage[y][x] = image[l - y - 1][l - x - 1];
                    }
                    else if (i == 3) {
                        newImage[y][x] = image[x][l - y - 1];
                    }
                }
            }
            if (j == 1) {
                newImage = newImage
                    .map(line => line.reverse());
            }
            res.push(newImage);
        }
    }
    return res;
}
function isMonster(cx, cy, image, monster, safe) {
    let mW = monster[0].length;
    let mH = monster.length;
    for (let x = 0; x < mW; x++) {
        for (let y = 0; y < mH; y++) {
            if (monster[y][x] == '#' &&
                image[cy + y][cx + x] != '#') {
                return false;
            }
        }
    }
    for (let x = 0; x < mW; x++) {
        for (let y = 0; y < mH; y++) {
            if (monster[y][x] == '#') {
                safe[cy + y][cx + x] = '.';
            }
        }
    }
    return true;
}
function findMonsters(image) {
    let monster = [
        '                  # ',
        '#    ##    ##    ###',
        ' #  #  #  #  #  #   '
    ].map(line => line.split(''));
    let safe = image.map(line => line.slice());
    let mW = monster[0].length;
    let mH = monster.length;
    let w = image[0].length;
    let h = image.length;
    let monsters = 0;
    for (let x = 0; x < w - mW; x++) {
        for (let y = 0; y < h - mH; y++) {
            if (isMonster(x, y, image, monster, safe)) {
                monsters++;
            }
        }
    }
    return { monsters, safe };
}
function countSafe(image) {
    let res = 0;
    let w = image[0].length;
    let h = image.length;
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            if (image[y][x] == '#') {
                res++;
            }
        }
    }
    return res;
}
function plotImage(image) {
    for (let i = 0; i < image.length; i++) {
        console.log(image[i].join(''));
    }
}
function solve(input) {
    let tiles = prepare(input);
    size = Math.sqrt(tiles.length);
    fillGlobalIndex(tiles);
    let image = fitSquares(tiles);
    if (!image) {
        console.log('no image');
        return;
    }
    let fullImage = getFullImage(image);
    let allFullOrs = getAllFullOrs(fullImage);
    let safeAr = allFullOrs
        .map(im => ({ im, meta: findMonsters(im) }))
        .filter(({ meta }) => meta.monsters > 0)
        .map(({ im, meta }) => {
        return countSafe(meta.safe);
    });
    console.log(safeAr);
}
//# sourceMappingURL=solution2.js.map