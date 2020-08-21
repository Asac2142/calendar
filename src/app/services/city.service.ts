import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CityService {
    private URL: string = 'https://restcountries.eu/rest/v2/all';
    public constructor(private http: HttpClient) {}

    public getCities(): Observable<any> {
        return this.http.get(`${this.URL}`);
    }
}