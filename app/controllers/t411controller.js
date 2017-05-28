var path = require("path");
var config = require(path.join(__dirname, '..', 'config', 'config.json'));
var exports = module.exports = {};
var T411 = require('t411');

var clientT411 = new T411();
var results;

clientT411.auth(config.t411.username, config.t411.password, function(err) {
    if(err) throw err;
    /* client.download(id, function(err, buf) {
     // `buf` is a Buffer in node as well as in the browser
     var parsed = require('parse-torrent')(buf);
     console.log(parsed);
     });*/
});

exports.searchT411 = function(req, res) {
    clientT411.search(req.body.searchMusic, function(err, result) {
        if(err) throw err;
        //  res.json(result); //open next page but send nothing
         //res.render('searchResults');
        console.log(result.torrents);
        results = result.torrents;
    });
    res.render('searchResult', {result : results}) //don't send the var, don't know why
};

// tests
exports.t411Result = function(req, res) {
    res.render('searchResult');
};
