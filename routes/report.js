var express = require('express');
var router = express.Router();
var getConn = require('../db/connection')

function formatDate(date) {
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}

router.get('/', function(req, res, next) {
    getConn((err, db) => {
        if (err) throw err;
        let user = db.db('local');
        let report = user.collection('report');

        report.find().toArray((err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                console.log(result);
                res.render('report_list', {result: result});
            } else {
                console.log('report 리스트 없음');
                console.log(result);
                res.render('report_list', {result: []});
            }
        });
    });
});

router.get('/list', function(req, res, next) {
    getConn((err, db) => {
        if (err) throw err;
        let user = db.db('local');
        let report = user.collection('report');

        report.find().toArray((err, result) => {
            if (err) throw err;
            if (result.length > 0) {
                console.log(result);
                res.render('report_list', {result: result});
            } else {
                console.log('report 리스트 없음');
                console.log(result);
                res.render('report_list', {result: []});
            }
        });
    });
});

router.post('/list', function(req, res, next) {

});

router.get('/add', function(req, res, next) {
    res.render('report');
});

router.post('/add', function(req, res, next) {
    let place_id = req.query.place_id || req.body.place_id;
    let computer_id = req.query.computer_id || req.body.computer_id;
    let wrong_report = req.query.wrong_report || req.body.wrong_report;
    let report_title = req.query.report_title || req.body.report_title;
    let report_content = req.query.report_content || req.body.report_content;
    let password = req.query.password || req.body.password;
    let writer_name = req.query.writer_name || req.body.writer_name;
    let date = formatDate(new Date());
    let solution = 0;


    console.log(`place_id(${place_id}), computer_id(${computer_id}), wrong_report(${wrong_report}) ,
    report_title(${report_title}), report_content(${report_content}), password(${password}), writer_name(${writer_name}),
    date(${date}), solution=(${solution})`);

    getConn((err, db) => {
        if (err) throw err;
        var user = db.db('local');
        var report = user.collection('report');

        report.insertOne(
            {
                place_id: place_id,
                computer_id: computer_id,
                wrong_report: wrong_report,
                report_title: report_title,
                report_content: report_content,
                password: password,
                writer_name: writer_name,
                date: date,
                solution: solution
            },
            (err, result) => {
                if (err) throw err;
                res.redirect('list');
            }
        );
    });
});

router.get('/view', function(req, res, next) {
    res.render('read_report');
});

router.post('/view', function(req, res, next) {

});

module.exports = router;
