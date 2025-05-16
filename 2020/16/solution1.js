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


function solve(input) {
    let { rules, myTicket, tickets } = prepare(input);
    let res = 0;
    tickets.forEach(ticket => {
        ticket.forEach(field => {
            if (rules
                .every(rule => rule.ranges.every(
                    range => field < range[0] || field > range[1]
                ))) {
                res += field;
            }
        });
    });
    console.log(res);
}
