const fs = require('fs');
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});
class FileRec {
    constructor(name, parent, size) {
        this.name = name;
        this.parent = parent;
        this._size = size;
    }
    get size() {
        return this._size;
    }
}
class Directory extends FileRec {
    constructor() {
        super(...arguments);
        this.children = [];
    }
    get size() {
        return this.children.reduce((acc, cur) => acc + cur.size, 0);
    }
    get dirs() {
        return this.children.filter(child => child instanceof Directory);
    }
    get files() {
        return this.children.filter(child => !(child instanceof Directory));
    }
    addDir(name) {
        if (!this.dirs.find(dir => dir.name == name)) {
            this.children.push(new Directory(name, this));
        }
    }
    addFile(name, size) {
        if (!this.files.find(file => file.name == name)) {
            this.children.push(new FileRec(name, this, size));
        }
    }
    getMinEnough(size) {
        return this.dirs
            .reduce((acc, dir) => Math.min(acc, dir.getMinEnough(size), this.size > size ? this.size : 70000000), 70000000);
    }
}
function prepare(input) {
    let root = new Directory('', null);
    let curDir = root;
    input.split('\n')
        .forEach(line => {
        let termLine = line.split(' ');
        if (termLine[0] == '$') {
            let command = termLine[1];
            if (command == 'cd') {
                let attr = termLine[2];
                if (attr == '..') {
                    curDir = curDir.parent;
                }
                else if (attr == '/') {
                    curDir = root;
                }
                else {
                    curDir = curDir.dirs.find(dir => dir.name == attr);
                }
            }
        }
        else {
            if (termLine[0] == 'dir') {
                curDir.addDir(termLine[1]);
            }
            else {
                curDir.addFile(termLine[1], parseInt(termLine[0]));
            }
        }
    });
    return root;
}
function calcRes(root) {
    const freeSpace = 70000000 - root.size;
    const spaceNeeded = 30000000 - freeSpace;
    return root.getMinEnough(spaceNeeded);
}
function solve(input) {
    let root = prepare(input);
    let res = calcRes(root);
    console.log(res);
}
//# sourceMappingURL=solution2.js.map