const weatherService = require('../services/weatherService');
const airService = require('../services/airService');
const geoService = require('../services/geoService');

exports.getWeather = async (req, res) => {
  res.json(await weatherService.getCurrentWeather(req.validated));
};

exports.getForecast = async (req, res) => {
  res.json(await weatherService.getForecast(req.validated));
};

exports.getAir = async (req, res) => {
  res.json(await airService.getAirQuality(req.validated));
};

exports.searchCities = async (req, res) => {
  res.json(await geoService.searchCities(req.validated.q));
};