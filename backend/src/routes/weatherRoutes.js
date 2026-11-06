const { Router } = require('express');
const controller = require('../controllers/weatherController');
const validate = require('../middleware/validate');
const { weatherQuery, airQuery, citiesQuery } = require('../validators/weatherSchema');

const router = Router();

router.get('/weather', validate(weatherQuery), controller.getWeather);
router.get('/forecast', validate(weatherQuery), controller.getForecast);
router.get('/air', validate(airQuery), controller.getAir);
router.get('/cities', validate(citiesQuery), controller.searchCities);

module.exports = router;