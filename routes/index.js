var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const crudeGenerator = require('../apiController/crudeGenerator');

const modelGenerator = require('../apiController/modelGenerator');

const routerGenerator = require('../apiController/routesGenerator');

const crudeGeneratorMultipleIds = require('../apiController/crudeGeneratorMultipleIds');

const modelGeneratorMultipleIds = require('../apiController/modelGeneratorMultipleIds');

const routeGeneratorMultipleIds = require('../apiController/routesGeneratorMultipleIds');

router.post('/crudeGenerator', crudeGenerator.crudeGenerate);

router.post('/modelGenerator', modelGenerator.modelGenerate);

router.post('/routerGenerator', routerGenerator.routeGenerator);

router.post('/crudeGeneratorMultipleIds', crudeGeneratorMultipleIds.crudeGenerate);

router.post('/modelGeneratorMultipleIds', modelGeneratorMultipleIds.modelGenerate);

router.post('/routeGeneratorMultipleIds', routeGeneratorMultipleIds.routeGenerator);
module.exports = router;
