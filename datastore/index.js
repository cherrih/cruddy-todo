const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // console.log('text:   ', text);
  // console.log('callback:  ', callback);
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err);
    } else {
      let fileName = exports.dataDir + '/' + id + '.txt';
      // console.log(fileName);
      fs.writeFile(fileName, text, (err) => {
        if (err) {
          callback(err);
        } else {
          // counter += 1;
          callback(null, { id, text });
        }
      });
    }
  });
};


exports.readAll = (callback) => {
  var data = [];
  fs.readdir(exports.dataDir, (err, todoList) => {
    for (var i = 0; i < todoList.length; i ++) {
      let id = todoList[i].split('.')[0];
      data.push({ id, text:id });
    }
    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  var fileName = exports.dataDir + '/' + id + '.txt';
  fs.readFile(fileName, (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      callback(null, { id, text: fileData.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  var fileName = exports.dataDir + '/' + id + '.txt';
  fs.readFile(fileName, (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(fileName, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  let fileName = exports.dataDir + '/' + id + '.txt';

  fs.unlink(fileName, (err) => {
    if (err) {
      callback(err);
    } else {
      callback(null, null);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
