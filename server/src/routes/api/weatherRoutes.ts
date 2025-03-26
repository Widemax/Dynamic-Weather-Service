import { Router, Request, Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST Request with city name to retrieve weather data and save the city to search history
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { city } = req.body;
  if (!city) {
    res.status(400).json({ error: 'City name is required' });
    return;
  }
  try {
    // Retrieve weather data for the given city
    const weatherData = await WeatherService.getWeatherForCity(city);
    // Save the searched city to history
    await HistoryService.addCity(city);
    res.json(weatherData);
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error retrieving weather data' });
    return;
  }
});

// GET search history
router.get('/history', async (_req: Request, res: Response): Promise<void> => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error retrieving search history' });
    return;
  }
});

// BONUS: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await HistoryService.removeCity(id);
    res.json({ message: 'City removed from history' });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Error deleting city from history' });
    return;
  }
});

export default router;
