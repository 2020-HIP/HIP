var express = require('express');
var router = express.Router();
var getConn = require('../db/connection');

function formatDate(date) {
  let d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
}

router.get('/', function (req, res, next) {
  res.render('school-map');
});


router.get('/list', function (req, res, next) {
  let place_id = req.query.place_id;

  getConn((err, db) => {
    if (err) throw err;
    let user = db.db('hip');
    let place = user.collection('place');

    place.find({ id: place_id }).toArray((err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        let place_name = result[0].name;
        console.log('result[0].name : ' + result[0].name);
        console.log('place_name : ' + place_name);

        req.place_id = place_id;
        req.place_name = place_name;

        console.log(req.place_name);
        next();
      } else {
        req.place_id = place_id;
        req.place_name = null;
        next();
      }
    });
  });
});

router.get('/list', function (req, res) {
  let place_id = req.query.place_id;
  let place_name = req.place_name;

  console.log('(별)place_name : ' + place_name);

  getConn((err, db) => {
    if (err) throw err;
    let user = db.db('hip');
    let report = user.collection('report');

    report.find({ place_id: place_id }).toArray((err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        console.log('result[0] : ' + place_name);
        res.render('report_list', {
          place_name: place_name,
          place_id: place_id,
          result: result,
        });
      } else {
        console.log('report 리스트 없음');
        res.render('report_list', {
          place_name: place_name,
          place_id: place_id,
          result: [],
        });
      }
    });
  });
});

router.get('/add', function (req, res, next) {
  let place_id = req.query.place_id;

  getConn((err, db) => {
    if (err) throw err;
    let user = db.db('hip');
    let place = user.collection('place');

    place.find({ id: place_id }).toArray((err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        let place_name = result[0].name;
        console.log('result[0].name : ' + result[0].name);
        console.log('place_name : ' + place_name);

        res.render('report', { place_id: place_id, place_name: place_name });
      } else {
        console.log('place 리스트 없음');
        res.render('/');
      }
    });
  });
});

router.post('/add', function (req, res, next) {

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var report = user.collection('report');

    report.find({}).toArray((err, reports) => {
      if (err) throw err;
      let last_report = reports.length - 1;
      if (reports.length - 1 < 0) {
        req.num = 0;
      } else {
        req.num = reports[last_report].num + 1;
      }
      next();
    });
  });
});

router.post('/add', function (req, res, next) {
  let num = req.num;
  let place_id = req.query.place_id || req.body.place_id;
  let computer_id = req.query.computer_id || req.body.computer_id;
  let wrong_report = req.query.wrong_report || req.body.wrong_report;
  let report_title = req.query.report_title || req.body.report_title;
  let report_content = req.query.report_content || req.body.report_content;
  let password = req.query.password || req.body.password;
  let writer_name = req.query.writer_name || req.body.writer_name;
  let date = formatDate(new Date());
  let solution = 0;

  console.log('HI');
  console.log(typeof num);

  console.log(`num(${place_id}), lace_id(${place_id}), computer_id(${computer_id}), wrong_report(${wrong_report}) ,
    report_title(${report_title}), report_content(${report_content}), password(${password}), writer_name(${writer_name}),
    date(${date}), solution=(${solution})`);

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var report = user.collection('report');

    report.insertOne(
      {
        num: parseInt(num),
        place_id: place_id,
        computer_id: computer_id,
        wrong_report: wrong_report,
        report_title: report_title,
        report_content: report_content,
        password: password,
        writer_name: writer_name,
        date: date,
        solution: solution,
      },
      (err, result) => {
        if (err) throw err;
        res.redirect('list?place_id=' + place_id);
      }
    );
  });
});


router.get('/read/:place_id/:num', (req, res, next) => {
  let place_id = req.params.place_id;
  let num = Number(req.params.num);

  console.log('num : ' + typeof num);

  getConn((err, db) => {
    if (err) throw err;
    let user = db.db('hip');
    let place = user.collection('place');

    place.find({ id: place_id }).toArray((err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        let place_name = result[0].name;
        console.log('result[0].name : ' + result[0].name);
        console.log('place_name : ' + place_name);

        req.place_id = place_id;
        req.place_name = place_name;
        req.num = num;

        console.log(req.place_id);
        console.log(req.place_name);
        next();
      } else {
        req.place_id = place_id;
        req.place_name = null;
        req.num = num;
        next();
      }
    });
  });
});

router.get('/read/:place_name/:num', (req, res, next) => {
  let place_id = req.place_id;
  let place_name = req.place_name;
  let num = Number(req.params.num);

  console.log('num : ' + typeof num);

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var report = user.collection('report');

    report
      .find({ num: num })
      .toArray((err, result) => {
        if (err) throw err;
        console.log(result);
        res.render('read_report', { result: result, place_name: place_name });
      });
  });
});

router.get('/update/:place_id/:num', (req, res, next) => {
  let place_id = req.params.place_id;
  let num = Number(req.params.num);

  getConn((err, db) => {
    if (err) throw err;
    let user = db.db('hip');
    let place = user.collection('place');

    place.find({ id: place_id }).toArray((err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        let place_name = result[0].name;
        console.log('result[0].name : ' + result[0].name);
        console.log('place_name : ' + place_name);

        req.place_id = place_id;
        req.place_name = place_name;
        req.num = num;

        console.log(req.place_id);
        console.log(req.place_name);
        next();
      } else {
        req.place_id = place_id;
        req.place_name = null;
        req.num = num;
        next();
      }
    });
  });
});

router.get('/update/:place_name/:num', (req, res, next) => {
  let place_id = req.place_id;
  let place_name = req.place_name;
  let num = Number(req.params.num);

  console.log('num : ' + typeof num);

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var report = user.collection('report');

    report
        .find({ num: num })
        .toArray((err, result) => {
          if (err) throw err;
          console.log(result);
          res.render('update_report', { result: result, place_name: place_name });
        });
  });
});

router.post('/add', function (req, res, next) {
  let num = req.num;
  let place_id = req.query.place_id || req.body.place_id;
  let computer_id = req.query.computer_id || req.body.computer_id;
  let wrong_report = req.query.wrong_report || req.body.wrong_report;
  let report_title = req.query.report_title || req.body.report_title;
  let report_content = req.query.report_content || req.body.report_content;
  let password = req.query.password || req.body.password;
  let writer_name = req.query.writer_name || req.body.writer_name;
  let date = formatDate(new Date());
  let solution = 0;

  console.log('HI');
  console.log(typeof num);

  console.log(`num(${place_id}), lace_id(${place_id}), computer_id(${computer_id}), wrong_report(${wrong_report}) ,
    report_title(${report_title}), report_content(${report_content}), password(${password}), writer_name(${writer_name}),
    date(${date}), solution=(${solution})`);

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var report = user.collection('report');

    report.insertOne(
        {
          num: parseInt(num),
          place_id: place_id,
          computer_id: computer_id,
          wrong_report: wrong_report,
          report_title: report_title,
          report_content: report_content,
          password: password,
          writer_name: writer_name,
          date: date,
          solution: solution,
        },
        (err, result) => {
          if (err) throw err;
          res.redirect('list?place_id=' + place_id);
        }
    );
  });
});


router.post('/update', function (req, res, next) {

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var report = user.collection('report');

    report.find({}).toArray((err, reports) => {
      if (err) throw err;
      let last_report = reports.length - 1;
      if (reports.length - 1 < 0) {
        req.num = 0;
      } else {
        req.num = 21;
      }
      next();
    });
  });
});

router.post('/update', function (req, res, next) {
  let num = req.num;
  let place_id = req.query.place_id || req.body.place_id;
  let computer_id = req.query.computer_id || req.body.computer_id;
  let wrong_report = req.query.wrong_report || req.body.wrong_report;
  let report_title = req.query.report_title || req.body.report_title;
  let report_content = req.query.report_content || req.body.report_content;
  let password = req.query.password || req.body.password;
  let writer_name = req.query.writer_name || req.body.writer_name;
  let date = formatDate(new Date());
  let solution = 0;

  console.log('HI');
  console.log(typeof num);

  console.log(`num(${place_id}), lace_id(${place_id}), computer_id(${computer_id}), wrong_report(${wrong_report}) ,
    report_title(${report_title}), report_content(${report_content}), password(${password}), writer_name(${writer_name}),
    date(${date}), solution=(${solution})`);

  getConn((err, db) => {
    if (err) throw err;
    var user = db.db('hip');
    var report = user.collection('report');

    report.insertOne(
        {
          num: parseInt(num),
          place_id: place_id,
          computer_id: computer_id,
          wrong_report: wrong_report,
          report_title: report_title,
          report_content: report_content,
          password: password,
          writer_name: writer_name,
          date: date,
          solution: solution,
        },
        (err, result) => {
          if (err) throw err;
          res.redirect('list?place_id=' + place_id);
        }
    );
  });
});

module.exports = router;
