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
      data.push({ id:id, text:id });
    }
    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
