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
    var user = db.db('hip');
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
    var user = db.db('hip');

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
  let password = req.query.user_pw || req.body.user_pw;

  console.log(password === 'rhwkdtlsfh20@)');

  if (password !== 'rhwkdtlsfh20@)') {
    res.send(
      '<script> alert("비밀번호가 틀렸습니다."); location.href="/notice/notice" </script>'
    );
  } else {
    getConn((err, db) => {
      if (err) throw err;
      var user = db.db('hip');
      var notice = user.collection('notice');

      notice.find({}).toArray((err, notices) => {
        if (err) throw err;
        let last_notice = notices.length - 1;
        if (notices.length - 1 < 0) {
          req.num = 0;
        } else {
          req.num = notices[last_notice].num + 1;
        }
        next();
      });
    });
  }
});

router.post('/notice', (req, res) => {
  let num = req.num;
  let title = req.query.report_title || req.body.report_title;
  let content = req.query.report_content || req.body.report_content;
  let date = formatDate(new Date());
  let count = 0;

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
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
  let password = req.query.user_pw || req.body.user_pw;

  console.log(password === 'rhwkdtlsfh20@)');

  if (password !== 'rhwkdtlsfh20@)') {
    res.send(
      '<script> alert("비밀번호가 틀렸습니다."); location.href="/notice/question" </script>'
    );
  } else {
    getConn((err, db) => {
      if (err) throw err;
      var user = db.db('hip');
      var question = user.collection('question');

      question.find({}).toArray((err, questions) => {
        if (err) throw err;
        let last_question = questions.length - 1;
        if (questions.length - 1 < 0) {
          req.num = 0;
        } else {
          req.num = questions[last_question].num + 1;
        }

        next();
      });
    });
  }
});

router.post('/question', (req, res) => {
  let num = req.num;
  let title = req.query.report_title || req.body.report_title;
  let password = req.query.user_pw || req.body.user_pw;
  let content = req.query.report_content || req.body.report_content;
  let count = 0;

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
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

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
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

router.get('/notice_list/read/:notice_num', (req, res) => {
  let notice_num = req.params.notice_num;

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var notice = user.collection('notice');

    notice.find({ num: parseInt(notice_num) }).toArray((err, notice) => {
      if (err) throw err;
      res.render('read_notice', { notice: notice });
    });
  });
});

router.get('/question_list/read/:question_num', (req, res, next) => {
  let question_num = req.params.question_num;

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var question = user.collection('question');

    question.updateOne(
      { num: parseInt(question_num) },
      { $inc: { count: 1 } },
      (err, result) => {
        if (err) throw err;
        next();
      }
    );
  });
});

router.get('/question_list/read/:question_num', (req, res) => {
  let question_num = req.params.question_num;

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var question = user.collection('question');

    question.find({ num: parseInt(question_num) }).toArray((err, question) => {
      if (err) throw err;

      res.render('read_question', { question: question });
    });
  });
});

router.get('/notice_list/update/:notice_num', (req, res) => {
  let notice_num = req.params.notice_num;

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var notice = user.collection('notice');

    notice.find({ num: parseInt(notice_num) }).toArray((err, notice) => {
      if (err) throw err;
      console.log(notice);
      res.render('update_notice', { notice: notice });
    });
  });
});

router.post('/notice_list/update/:notice_num', (req, res) => {
  let notice_num = req.params.notice_num;
  let title = req.query.report_title || req.body.report_title;
  let password = req.query.user_pw || req.body.user_pw;
  let content = req.query.report_content || req.body.report_content;
  let date = formatDate(new Date());

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var notice = user.collection('notice');

    notice.updateOne(
      { num: parseInt(notice_num) },
      { $set: { title: title, content: content, date: date } },
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.redirect('../read/' + notice_num);
      }
    );
  });
});

router.get('/question_list/update/:question_num', (req, res) => {
  let question_num = req.params.question_num;

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var question = user.collection('question');

    question.find({ num: parseInt(question_num) }).toArray((err, question) => {
      if (err) throw err;
      console.log(question);
      res.render('update_question', { question: question });
    });
  });
});

router.post('/question_list/update/:question_num', (req, res) => {
  let question_num = req.params.question_num;
  let title = req.query.report_title || req.body.report_title;
  let password = req.query.user_pw || req.body.user_pw;
  let content = req.query.report_content || req.body.report_content;

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var question = user.collection('question');

    question.updateOne(
      { num: parseInt(question_num) },
      { $set: { title: title, content: content } },
      (err, result) => {
        if (err) throw err;
        console.log(result);
        res.redirect('../read/' + question_num);
      }
    );
  });
});

router.post('/notice_list/delete/:notice_num', (req, res) => {
  let notice_num = req.params.notice_num;

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var notice = user.collection('notice');

    notice.deleteOne({ num: parseInt(notice_num) }, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.redirect('/notice/1/1');
    });
  });
});

router.post('/question_list/delete/:question_num', (req, res) => {
  let question_num = req.params.question_num;

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var question = user.collection('question');

    question.deleteOne({ num: parseInt(question_num) }, (err, result) => {
      if (err) throw err;
      console.log(result);
      res.redirect('/notice/1/1');
    });
  });
});

module.exports = router;
