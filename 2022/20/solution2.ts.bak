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

class FileRec {
    _size: number;
    constructor(
        public name: string,
        public parent: Directory | null,
        size?: number) {
        this._size = size;
    }

    get size() {
        return this._size;
    }
}

class Directory extends FileRec {
    children: FileRec[] = [];

    get size() {
        return this.children.reduce((acc, cur) => acc + cur.size, 0);
    }

    get dirs(): Directory[] {
        return this.children.filter(child => child instanceof Directory) as Directory[];
    }

    get files(): FileRec[] {
        return this.children.filter(child => !(child instanceof Directory)) as FileRec[];
    }

    addDir(name: string) {
        if (!this.dirs.find(dir => dir.name == name)) {
            this.children.push(new Directory(name, this));
        }
    }

    addFile(name: string, size: number) {
        if (!this.files.find(file => file.name == name)) {
            this.children.push(new FileRec(name, this, size));
        }
    }

    getMinEnough(size: number) {
        return this.dirs
            .reduce((acc, dir) => Math.min(acc, dir.getMinEnough(size), this.size > size ? this.size : 70000000), 70000000);
    }
}

function prepare(input: string) {
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
                    } else if (attr == '/') {
                        curDir = root;
                    } else {
                        curDir = curDir.dirs.find(dir => dir.name == attr);
                    }
                }
            } else {
                if (termLine[0] == 'dir') {
                    curDir.addDir(termLine[1]);
                } else {
                    curDir.addFile(termLine[1], parseInt(termLine[0]));
                }
            }
        });
    return root;
}

function calcRes(root: ReturnType<typeof prepare>) {
    const freeSpace = 70000000 - root.size;
    const spaceNeeded = 30000000 - freeSpace;
    return root.getMinEnough(spaceNeeded);

}


function solve(input: string) {
    let root = prepare(input);
    let res = calcRes(root);

    console.log(res);
}
