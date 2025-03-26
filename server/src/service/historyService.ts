import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Define a City class with name and id properties
export class City {
  id: string;
  name: string;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

const HISTORY_FILE = path.join(process.cwd(), 'searchHistory.json');

class HistoryService {
  // Read from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(HISTORY_FILE, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  // Write the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(HISTORY_FILE, JSON.stringify(cities, null, 2));
  }

  // Get cities from the searchHistory.json file
  async getCities(): Promise<City[]> {
    return await this.read();
  }

  // Add a city to the searchHistory.json file
  async addCity(city: string): Promise<City> {
    const cities = await this.read();
    const newCity = new City(uuidv4(), city);
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }

  // BONUS: Remove a city from the searchHistory.json file by id
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter(city => city.id !== id);
    await this.write(updatedCities);
  }
}

export default new HistoryService();
