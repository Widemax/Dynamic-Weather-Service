import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// Define an interface for the Coordinates object
export interface Coordinates {
  lat: number;
  lon: number;
  name: string;
}

// Define an interface for the Weather object (simplified)
export interface Weather {
  current: any;
  forecast: any[];
}

// Complete the WeatherService class
class WeatherService {
  private apiBaseUrl: string;
  private apiKey: string;

  constructor() {
    this.apiBaseUrl = process.env.API_BASE_URL || 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || '';
  }

  // Build the geocode query URL
  private buildGeocodeQuery(city: string): string {
    return `${this.apiBaseUrl}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${this.apiKey}`;
  }

  // Build the weather query URL using coordinates
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.apiBaseUrl}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  // Fetch location data (coordinates) for the given city name
  private async fetchLocationData(city: string): Promise<Coordinates> {
    const query = this.buildGeocodeQuery(city);
    const response = await axios.get(query);
    if (response.data && response.data.length > 0) {
      const data = response.data[0];
      return {
        lat: data.lat,
        lon: data.lon,
        name: data.name,
      };
    }
    throw new Error('Location not found');
  }

  // Fetch weather data using coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const query = this.buildWeatherQuery(coordinates);
    const response = await axios.get(query);
    return response.data;
  }

  private parseCurrentWeather(weatherData: any): any {
    // Fallback city name if `weatherData.city.name` is missing
    const cityName = weatherData.city?.name ?? '';
  
    if (weatherData?.list?.length > 0) {
      const currentItem = weatherData.list[0];
      return {
        city: cityName,
        date: currentItem.dt_txt,
        icon: currentItem.weather?.[0]?.icon || '',
        iconDescription: currentItem.weather?.[0]?.description || '',
        tempF: currentItem.main?.temp || '',
        windSpeed: currentItem.wind?.speed || '',
        humidity: currentItem.main?.humidity || '',
      };
    }
  
    // Return an object with empty strings if something goes wrong
    return {
      city: cityName,
      date: '',
      icon: '',
      iconDescription: '',
      tempF: '',
      windSpeed: '',
      humidity: '',
    };
  }
  
  private buildForecastArray(weatherData: any): any[] {
    // Use midday forecasts (12:00:00) as a typical pattern
    const middayForecasts = weatherData.list?.filter((item: any) =>
      item.dt_txt.includes('12:00:00')
    ) || [];
  
    // Take the first 5 midday forecasts
    const firstFive = middayForecasts.slice(0, 5);
  
    // Also read the city name from the same place
    const cityName = weatherData.city?.name ?? '';
  
    // Map each forecast item to the fields your front end needs
    return firstFive.map((item: any) => ({
      city: cityName,
      date: item.dt_txt,
      icon: item.weather?.[0]?.icon || '',
      iconDescription: item.weather?.[0]?.description || '',
      tempF: item.main?.temp || '',
      windSpeed: item.wind?.speed || '',
      humidity: item.main?.humidity || '',
    }));
  }
  

  // Get weather for a city by combining geocoding and forecast data
  async getWeatherForCity(city: string): Promise<{ current: any; forecast: any[] }> {
    const coordinates = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
  
    // Transform the raw data into front-end-friendly objects
    const current = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(weatherData);
  
    return { current, forecast };
  }
}

export default new WeatherService();
