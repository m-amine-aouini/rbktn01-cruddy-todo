const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) { throw ('you cant have an id'); }
    let file = path.join(exports.dataDir, id + '.txt');
    fs.writeFile(file, text, (err) => {
      if (err) {
        throw ('error creating data');
      } else {
        items[id] = text;
        callback(null, { id, text });

      }
    });

  });


};

exports.readAll = (callback) => {
  // let data = _.map(files, (text, id) => {
  //   return { id, text };
  // });
  let dir = path.join(exports.dataDir);
  fs.readdir(dir, (err, files) => {
    if (err) {
      callback(err);
    } else {
      let map = _.map(files, (file) => {

        let filePath = path.join(exports.dataDir, file);
        let id = file[0] + file[1] + file[2] + file[3] + file[4];
        let text = id;

        // let text = fs.readFileSync(filePath) + "";
        // console.log(text)
        return { id, text };

      });
      // console.log(map)
      callback(null, map);
    }
  });

};

exports.readOne = (id, callback) => {

  let file = path.join(exports.dataDir, id + '.txt');
  fs.readFile(file, (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      text = text + '';
      callback(null, { id, text });
    }

  });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }

  let file = path.join(exports.dataDir, id + '.txt');

  fs.readFile(file, (err, data) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(file, text, (err) => {
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

  let file = path.join(exports.dataDir, id + '.txt');
  fs.unlink(file, (err) => {
    if (err) {
      callback(err);
    } else {
      callback();
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
