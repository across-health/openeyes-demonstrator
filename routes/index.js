var express = require('express');
var router = express.Router();

var dashboardData = require('../data/dashboard.json');

/* GET home page. */
router.get('/', function(req, res, next) {
  var title = 'Dashboard';
  var today = patientUtils.formatDate(new Date());
  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate()+1);
  tomorrow = patientUtils.formatDate(tomorrow);
  res.render('index', { title: 'Home', dateToday: today, dateTomorrow: tomorrow, dashboardData: dashboardData, patientUtils: patientUtils });
});

module.exports = router;
