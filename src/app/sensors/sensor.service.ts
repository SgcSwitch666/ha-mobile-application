import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sensor } from './sensors.component';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  private apiUrl = 'http://192.168.0.104/api/sensors';

  constructor(private http: HttpClient) { }

  getAllSensors(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(this.apiUrl);
  }
}
