import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  try {
  // TODO: save city to search history
  const city = req.body.cityName;
  const weatherData = await WeatherService.getWeatherForCity(city);
  await historyService.addCity(city)
  return res.json(weatherData);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const savedCities = await HistoryService.getCities();
    res.json(savedCities);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req:Request, res: Response) => {
  try {
    if (!req.params.id) {
      res.status(400).json({msg: 'City id is required' });
    }
    await HistoryService.removeCity(req.params.id);
    res.json({ success: 'City cuscessfully removed from search history'});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;
