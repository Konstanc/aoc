fs = require('fs')
let fileName = 'input.txt';
// let fileName = 'example.txt';
fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    solve(data);
});

function prepare(input) {
    let parts = input
        .split('\r\n\r\n');
    let rules = parts[0]
        .split('\r\n')
        .map(s => s.split(': '))
        .map(ss => ({
            field: ss[0],
            ranges: ss[1]
                .split(' or ')
                .map(rs => rs.split('-')
                    .map(r => parseInt(r))
                )
        }));
    let myTicket = parts[1]
        .split('\r\n')[1]
        .split(',')
        .map(s => parseInt(s));
    let tickets = parts[2]
        .split('\r\n')
        .slice(1)
        .map(t => t
            .split(',')
            .map(s => parseInt(s))
        );
    return { rules, myTicket, tickets };
}


function findNext(fieldsIndexes) {
    let rIndex = fieldsIndexes.findIndex((fields, rIndex) => {
        return fields.filter(field => field).length == 1;
    })
    if (rIndex >= 0) {
        return { fIndex: fieldsIndexes[rIndex].findIndex(field => field), rIndex };
    }
    return { fIndex: -1, rIndex: -1 };
}

function solve(input) {
    let { rules, myTicket, tickets } = prepare(input);

    let fTickets = tickets.filter(ticket => {
        return ticket.every(field => {
            return rules
                .some(rule => rule.ranges.some(
                    range => {
                        return field >= range[0] && field <= range[1];
                    }
                ));
        });
    });
    let fieldsIndexes = rules.map(rule => {
        return fTickets[0].map(f => true);
    });
    fTickets.forEach(ticket => {
        ticket.forEach((field, fIndex) => {
            rules.forEach((rule, rIndex) => {
                if (!rule.ranges.some(
                    range => {
                        return field >= range[0] && field <= range[1];
                    }
                )) {
                    fieldsIndexes[rIndex][fIndex] = false;
                }
            });
        });
    });
    let found = rules.map(r => -1);
    let { fIndex, rIndex } = findNext(fieldsIndexes);
    while (rIndex >= 0) {
        found[rIndex] = fIndex;
        fieldsIndexes.forEach(rule => {
            rule[fIndex] = false;
        });
        let next = findNext(fieldsIndexes);
        fIndex = next.fIndex;
        rIndex = next.rIndex;
    }
    let res = 1;
    found.slice(0, 6)
        .forEach((f, i) => {
            res *= myTicket[f];
        });


    console.log(res);
}
