const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      callback(err);
    } else {
      let fileName = exports.dataDir + '/' + id + '.txt';
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


exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading data folder');
    }
    var data = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      var filepath = path.join(exports.dataDir, file);
      return readFilePromise(filepath).then(fileData => {
        return {
          id: id,
          text: fileData.toString()
        };
      });
    });
    Promise.all(data)
      .then(items => callback(null, items), err => callback(err));
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
