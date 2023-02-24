const fs = require("node:fs/promises");

exports.fetchJSON = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, 'utf-8').then(result => {
        return JSON.parse(result);
    })
};