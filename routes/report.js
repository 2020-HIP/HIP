var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('report_list');
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
