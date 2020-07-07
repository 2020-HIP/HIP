var express = require('express');
var router = express.Router();
var getConn = require('../db/connection');

/* GET home page. */
router.get('/', function (req, res, next) {
  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var report = user.collection('report');

    report
      .find()
      .sort({ amount: 1, date: -1 })
      .limit(5)
      .toArray((err, docs) => {
        if (err) throw err;
        if (docs.length > 0) {
          console.log('docs : ' + docs);
          console.dir(docs);
          res.render('index', { docs: docs });
        } else {
          console.log('projects 리스트 없음');
          res.render('index', { docs: [] });
        }
      });
  });
});

module.exports = router;
