const timing = require("./getTiming");

const LOG_COLOR = {
    green: 'green',
    red: 'red',
    yellow: 'yellow',
    default: 'default'
}

/**
 * 
 * @param {string} name 
 * @param {*} message 
 * @param {keyof typeof LOG_COLOR} color 
 */
function log(name, message = '', color) {

    switch (color) {
        case "green":
            console.log(`\x1b[32m ${timing()} => ${name}: \x1b[0m`, message);
            return
        case "red":
            console.error(`\x1b[31m ${timing()} => ${name}: \x1b[0m`, message);
            return
        case "yellow":
            console.log(`\x1b[33m ${timing()} => ${name}: \x1b[0m`, message);
            return
        default:
            console.log(`\x1b[34m ${timing()} => ${name}: \x1b[0m`, message);
            return
    }
}

module.exports = log;