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

router.get('/notice', (req, res) => {
  res.render('notice_form');
});

router.post('/notice', (req, res, next) => {
  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('local');
    var notice = user.collection('notice');

    notice.find({}).toArray((err, notices) => {
      if (err) throw err;
      console.log(notices);
      console.log(notices.length - 1);
      let last_notice = notices.length - 1;
      console.log(notices[last_notice]);
      if (notices.length - 1 < 0) {
        req.num = 0;
      } else {
        req.num = notices[last_notice].num + 1;
      }

      next();
    });
  });
});

router.post('/notice', (req, res) => {
  let num = req.num;
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
      { num: num, title: title, content: content, date: date, count: count },
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

router.post('/question', (req, res, next) => {
  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('local');
    var question = user.collection('question');

    question.find({}).toArray((err, questions) => {
      if (err) throw err;
      console.log(questions.length - 1);
      let last_question = questions.length - 1;
      if (questions.length - 1 < 0) {
        req.num = 0;
      } else {
        req.num = questions[last_question].num + 1;
      }

      next();
    });
  });
});

router.post('/question', (req, res) => {
  let num = req.num;
  let title = req.query.report_title || req.body.report_title;
  let password = req.query.user_pw || req.body.user_pw;
  let content = req.query.report_content || req.body.report_content;
  let count = 0;

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('local');
    var question = user.collection('question');

    question.insertOne(
      { num: num, title: title, content: content, count: count },
      (err, result) => {
        if (err) throw err;
        res.redirect('/notice/1/1');
      }
    );
  });
});

router.get('/notice_list/read/:notice_num', (req, res, next) => {
  let notice_num = req.params.notice_num;

  console.log(parseInt(notice_num));

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('local');
    var notice = user.collection('notice');

    notice.updateOne(
      { num: parseInt(notice_num) },
      { $inc: { count: 1 } },
      (err, result) => {
        if (err) throw err;
        console.log(result);
        next();
      }
    );
  });
});

router.get('/notice_list/read/:notice_num', (req, res, next) => {
  let notice_num = req.params.notice_num;

  console.log(parseInt(notice_num));

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('local');
    var notice = user.collection('notice');

    notice.find({ num: parseInt(notice_num) }).toArray((err, notice) => {
      if (err) throw err;
      console.log(notice);
      res.render('read_notice', { notice: notice });
    });
  });
});

module.exports = router;
