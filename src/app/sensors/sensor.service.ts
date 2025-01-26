import { Component, OnInit, inject,AfterViewInit, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sensor } from './sensors.component';
import { map } from 'rxjs/operators';
import { MeasurementService } from '../measurements/measurements.service';
import { SensorMeasurementRepository } from '../modules/sensorMeasurementRepository';
import { Measurement } from '../measurements/measurements.component';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorService {
    private apiUrl = 'http://192.168.0.104:8081/api/sensors';

  constructor(private http: HttpClient,
      private measurementService: MeasurementService) { }

getAllSensors(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(this.apiUrl);
  }
  getSensorMeasurementRepository() : SensorMeasurementRepository[]{
    let SensorMeasurementRepository : SensorMeasurementRepository[];
    return SensorMeasurementRepository;
  }

  getSensorById(sensorId: number): Observable<Sensor | null> {
    return this.getAllSensors().pipe(
      map((sensors) => sensors.find((sensor) => sensor.sensorid === sensorId) || null)
    );
  }
}



