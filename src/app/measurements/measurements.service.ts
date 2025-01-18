import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Measurement } from './measurements.component';
import { map } from 'rxjs/operators';  // Add this import statement

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  private apiUrl = 'http://192.168.0.104:8081/Measurements';

  constructor(private http: HttpClient) { }

getAllMeasurements(): Observable<Measurement[]> {
    return this.http.get<Measurement[]>(this.apiUrl).pipe(
      map((data: Measurement[]) => {
        return data;
      })
    );
  }
}


