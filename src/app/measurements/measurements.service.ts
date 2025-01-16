import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Measurement } from './measurements.component';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  private apiUrl = 'http://localhost:8081/Measurements';

  constructor(private http: HttpClient) { }

  getAllMeasurements(): Observable<Measurement[]> {
    return this.http.get<Measurement[]>(this.apiUrl);
  }
}


