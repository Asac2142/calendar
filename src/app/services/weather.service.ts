import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WeatherService {
    private API_KEY: string = '8d8191afe91ac5fa9c898f0c757fc228';    
    public city: string;
    public days: number;

    public constructor(private httpClient: HttpClient) {}

    public getForecastWeatherByCity(): Observable<any> {        
        const URL = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&cnt=${this.days}&appid=${this.API_KEY}`;
        return this.httpClient.get(URL);
    }

}
