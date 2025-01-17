import { Component } from '@angular/core';

@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.component.html',
  styleUrls: ['./measurements.component.css'],
})
export class MeasurementsComponent {
  public measurements$: Measurement[] = [];

  addSensorId = 0;
  addMeasurementTime = '';
  addMeasurementTemp = 0;
  addMeasurementHumidity = 0;
}

export interface Measurement {
  measurementid: number;
  sensorid: number;
  measurementtime: string;
  measurementtemperature: number;
  measurementhumidity: number;
}

export interface ApiResponse {
  _embedded: {
    Measurements: Measurement[];
  };
  _links: any;
  page: any;
}
