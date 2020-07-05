var express = require('express');
var router = express.Router();
var getConn = require('../db/connection')

/* GET home page. */
router.get('/', function(req, res, next) {

    getConn((err, db) => {
        if (err) throw err;
        var user = db.db('local');
        var report = user.collection('report');

        report.find().toArray((err, result) => {
            console.log(result);
            res.render('report_list', { result: result });
        });
    });
});

router.get('/list', function(req, res, next) {
    getConn((err, db) => {
        if (err) throw err;
        var user = db.db('local');
        var report = user.collection('report');

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

});

router.get('/view', function(req, res, next) {
    res.render('read_report');
});

router.post('/view', function(req, res, next) {

});

module.exports = router;
