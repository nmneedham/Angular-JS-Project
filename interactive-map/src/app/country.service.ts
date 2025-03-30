import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private baseUrl = 'https://api.worldbank.org/V2/country';

  constructor(private http: HttpClient) {}

  getCountryData(countryCode: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${countryCode}?format=json`).pipe(
      map((response: any) => response[1]?.[0] || null)
    );
  }
}