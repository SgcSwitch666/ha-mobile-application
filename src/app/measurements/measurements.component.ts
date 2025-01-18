import { Component } from '@angular/core';

@Component({
  selector: 'app-measurements',
  templateUrl: './measurements.component.html',
  styleUrls: ['./measurements.component.css'],
})
export class MeasurementsComponent {
  public measurements$: Measurement[] = [];

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
}
