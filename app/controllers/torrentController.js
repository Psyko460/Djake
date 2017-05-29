var path = require("path");
var config = require(path.join(__dirname, '..', 'config', 'configTorrent.json'));
var exports = module.exports = {};

const TorrentSearchApi = require('torrent-search-api');
const torrentSearch = new TorrentSearchApi();

function enableProviderByJSON(){
  for(var k in config) {
    if(config[k].isActivated == 1) {
      torrentSearch.enableProvider(k);
    }else{
      torrentSearch.disableProvider(k);
    }
  }
  providerActive = torrentSearch.getActiveProviders();
  if(typeof(providerActive) != 'undefined'){
    return true;
  }else{
    return false;
  }
}

exports.searchTorrent = function(req, res) {
  if( enableProviderByJSON() == true){
    torrentSearch.search(req.body.searchMusic, 'Music', 20)
            .then(torrents => {
                results = torrents;
                res.render('searchResult', {result : results});
            console.log(torrents);
    }).catch(err => {
            console.log(err);
    });
  }

};

exports.downloadTorrent = function(req, res){
    torrentSearch.downloadTorrent(torrent, "F:/torrents/")
        .then(()=> {

        }).catch(err =>{
            console.log(err);
    })
};

exports.options = function(req, res) {
    torrentProvider = [];
    allProvider = [];
    for(var k in config) {
      if(config[k].isActivated == 1){
        allProvider.push({name: k, username: config[k].username, password: config[k].password, isActivated: "1"})
      }else{
        allProvider.push({name: k, username: config[k].username, password: config[k].password, isActivated: ""})
      }

    }
    res.render('options', {allProviders: allProvider});
};


/*
var T411 = require('t411');
var clientT411 = new T411();
var results;

exports.searchTorrent = function(req, res) {
    if(config.t411.username == "" && config.t411.password == ""){
        res.redirect('/options');
    }
    var regSearch = req.body.searchMusic.replace(/\s/g, '');
  if(regSearch != '') {
      clientT411.auth(config.t411.username, config.t411.password, function(err) {
          if(err) throw err;
          clientT411.search(req.body.searchMusic, function(err, result) {
              if(err) throw err;
              //  res.json(result); //open next page but send nothing
              //res.render('searchResults');
              // console.log(result.torrents);
              results = result.torrents;
              res.render('searchResult', {result : results})
          });
      });
  } else {
    res.redirect('/dashboard');
  }
};

*/
