var fs = require('fs');
var ejs = require('ejs');

exports.card_one = ejs.compile(fs.readFileSync('./Frontend/templates/card_one.ejs', "utf8"));
exports.option_one = ejs.compile(fs.readFileSync('./Frontend/templates/option_one.ejs', "utf8"));