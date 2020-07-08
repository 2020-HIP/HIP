var express = require('express');
var router = express.Router();
var getConn = require('../db/connection');

/* GET home page. */
router.get('/', function (req, res, next) {
  let wrong_report_0 = [];
  let wrong_report_1 = [];
  let wrong_report_2 = [];

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var report = user.collection('report');

    report
      .aggregate([
        {
          $lookup: {
            from: 'place',
            localField: 'place_id',
            foreignField: 'id',
            //pipeline: [{ $match: { wrong_report: 0 } }],
            as: 'broken',
          },
        },
      ])
      .toArray(function (err, docs) {
        if (err) throw err;
        if (docs.length > 0) {
          for (let i = 0; i < docs.length; i++) {
            switch (docs[i].wrong_report) {
              case '0':
                wrong_report_0.push(docs[i]);
                break;
              case '1':
                wrong_report_1.push(docs[i]);
                break;
              case '2':
                wrong_report_2.push(docs[i]);
                break;
            }
          }
          res.render('index', {
            wrong_report_0: wrong_report_0,
            wrong_report_1: wrong_report_1,
            wrong_report_2: wrong_report_2,
          });
        } else {
          // console.log('projects 리스트 없음');
          res.render('index', { docs: [] });
        }
        // console.log(res);
        // console.log(res[0].main[0].name);
      });
  });
});

module.exports = router;
