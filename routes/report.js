var express = require('express');
var router = express.Router();
var getConn = require('../db/connection')

/* GET home page. */
router.get('/', function(req, res, next) {
    getConn((err, db) => {
        if (err) throw err;
        var user = db.db('local');
        var report = user.collection('place');

        report.find().toArray((err, result) => {
            console.log(result);
            res.send({'ok': true});
        });
    });


});

router.get('/list', function(req, res, next) {
    res.render('report_list');
});

router.post('/list', function(req, res, next) {

});

router.get('/add', function(req, res, next) {
    res.render('report');
});

router.post('/add', function(req, res, next) {

});

module.exports = router;
