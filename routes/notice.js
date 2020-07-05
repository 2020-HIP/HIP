var getConn = require('../db/connection');

var express = require('express');
var router = express.Router();

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}

router.get('/', function (req, res, next) {
  res.render('notice');
});

router.get('/form', (req, res) => {
  res.render('notice_form');
});

router.post('/form', (req, res) => {
  let title = req.query.report_title || req.body.report_title;
  let password = req.query.user_pw || req.body.user_pw;
  let content = req.query.report_content || req.body.report_content;
  let date = formatDate(new Date());
  let count = 0;

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('local');
    var notice = user.collection('notice');

    notice.insertOne(
      { title: title, content: content, date: date, count: count },
      (err, result) => {
        if (err) throw err;
        res.redirect('/');
      }
    );
  });
});

router.get('/question', (req, res) => {
  res.render('question_form');
});

module.exports = router;
