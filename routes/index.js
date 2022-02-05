var express = require('express');
var router = express.Router();
var { testDbConnection } = require('../db/sequelize')

/* GET home page. */
router.get('/', async function(req, res, next) {
  //await testDbConnection()
  res.render('index', { title: 'Express' });
});

module.exports = router;
