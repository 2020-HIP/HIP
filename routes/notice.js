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

router.get('/:notice_page/:question_page', function (req, res, next) {
  let notice_page = req.params.notice_page;

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('local');
    var notice = user.collection('notice');

    notice.find({}).toArray((err, notices) => {
      if (err) throw err;
      req.notices = notices;
      req.notice_page = notice_page;
      req.notice_length = notices.length - 1;
      req.notice_num = 5;
      next();
    });
  });
});

router.get('/:notice_page/:question_page', function (req, res, next) {
  let question_page = req.params.question_page;

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('local');

    var question = user.collection('question');

    question.find({}).toArray((err, questions) => {
      if (err) throw err;
      res.render('notice', {
        notices: req.notices,
        notice_page: req.notice_page,
        notice_length: req.notice_length,
        notice_num: req.notice_num,
        questions: questions,
        question_page: question_page,
        question_length: questions.length - 1,
        question_num: 5,
      });
    });
  });
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
        res.redirect('/notice/1/1');
      }
    );
  });
});

router.get('/question', (req, res) => {
  res.render('question_form');
});

router.post('/question', (req, res) => {
  let title = req.query.report_title || req.body.report_title;
  let password = req.query.user_pw || req.body.user_pw;
  let content = req.query.report_content || req.body.report_content;
  let count = 0;

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('local');
    var question = user.collection('question');

    question.insertOne(
      { title: title, content: content, count: count },
      (err, result) => {
        if (err) throw err;
        res.redirect('/notice/1/1');
      }
    );
  });
});

module.exports = router;
