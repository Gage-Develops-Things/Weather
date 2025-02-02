import { type Dayjs } from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

// TODO: Define a class for the Weather object
export class Weather {
  city: string;
  date: Dayjs | string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  constructor(
    city: string,
    date: Dayjs | string,
    tempF: number,
    windSpeed: number,
    humidity: number,
    icon: string,
    iconDescription: string
  ) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  
  baseURL?: string;

  apiKey?: string;

  city = '';

  constructor(
  ) {
    this.baseURL = process.env.API_BASE_URL || '';

    this.apiKey = process.env.API_KEY || '';
  }


  private async fetchLocationData(query: string) {
    const response = await fetch (query);
    let data = await response.json();
    return data[0];
  }

  private destructureLocationData(locationData: Coordinates): Coordinates {
    const {name,lat,lon,country,state} = locationData;
    const dataCoords: Coordinates = {
      name,lat,lon,country,state
    };
    return dataCoords;
  }

  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`
  }

  private async fetchAndDestructureLocationData() {
    const locationData:Coordinates = await this.fetchLocationData(this.buildGeocodeQuery());
    return await this.destructureLocationData(locationData)
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const rawInfo = await response.json();
    const currentWeather = this.parseCurrentWeather(rawInfo.list[0]);
    const weatherArray = this.buildForecastArray(currentWeather, rawInfo.list);
    return weatherArray;
  };
  private parseCurrentWeather(response: any) {
    return new Weather(
      this.city,
      response.dt_txt.split(' ')[0],
      response.main.temp,
      response.wind.speed,
      response.main.humidity,
      response.weather[0].icon,
      response.weather[0].description
    )
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    let weatherArray = [currentWeather];
    let filteredData = weatherData.filter((data:any)=>{
      return data.dt_txt.includes('12:00:00')
    })
    filteredData.map((item)=>{
      weatherArray.push(
        new Weather(
          this.city,
          item.dt_txt.split(' ')[0],
          item.main.temp,
          item.wind.speed,
          item.main.humidity,
          item.weather[0].icon,
          item.weather[0].description
        )
      )
    })
    return weatherArray
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.city = city;
    const coords = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coords);
    console.log(weatherData)
    return weatherData;
  }
}

export default new WeatherService();