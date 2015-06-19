/**
 * Our grammar:
 * program -> [action]
 * action -> "repeat" nat nat | "print" nat nat
 */

const REPEAT = 'repeat';
const PRINT = 'print';

function parse (input) {
    var lines = input.split(/[\n]/);
    return lines.map(parseLine);
}

function parseLine (line, i) {
    var symbols = line.split(' ').filter(nonempty);
    if (token = repeat(symbols))
        return token;
    if (token = print(symbols))
        return token;
    throw new Error('Invalid line: ' + i);
}

function repeat (symbols) {
    var repeatT = symbols[0];
    var a = parseNat(symbols[1]);
    var b = parseNat(symbols[2]);
    if (repeatT === REPEAT && !isNaN(a) && !isNaN(b) && symbols.length === 3) {
        return {
            t: repeatT,
            a: a,
            b: b,
        };
    }
}

function print (symbols) {
    var printT = symbols[0];
    var a = parseNat(symbols[1]);
    if (printT === PRINT && !isNaN(a) && symbols.length === 2) {
        return {
            t: printT,
            a: a,
        };
    }
}

function parseNat (str) {
    if(/^[0-9]+$/.test(str)) {
        return Number(str);
    }
    return NaN;
}

function stringify (instruction) {
    if (instruction) {
        return Object.keys(instruction).map(function (k) {
            return instruction[k];
        }).join(' ');
    } else {
        return '';
    }
}

function nonempty (str) {
    return str.length !== 0;
}

function run (program) {
    var outputLines = [];
    var pc = 0;
    while (pc < program.length) {
        var instruction = program[pc];
        if (instruction.t === PRINT) {
            var start = pc + 1;
            var end = start + instruction.a;
            var printLines = program.slice(start, end);
            outputLines = outputLines.concat(printLines.map(stringify));
            pc = end;
        } else if (instruction.t === REPEAT) {
            var start = Math.max(outputLines.length - instruction.b, 0);
            var end = start + instruction.a;
            for (var i = start; i < end; i++) {
                outputLines.push(outputLines[i]);
            }
            pc++;
        }
    };
    return outputLines.filter(nonempty).join('\n');
}

// main module object
var Interpreter = {
    parse: parse,
    run: run,
};

// browser/nodejs compat
if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = Interpreter;
    }
    exports.Interpreter = Interpreter;
} else {
    window['Interpreter'] = Interpreter;
}
