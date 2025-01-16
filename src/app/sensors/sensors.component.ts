import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SensorService } from './sensor.service';
import {SensorMeasurementRepository} from '../modules/sensorMeasurementRepository';
import { Measurement } from '../measurements/measurements.component';
import { forkJoin } from 'rxjs';
import {MeasurementService} from '../measurements/measurements.service';

@Component({
  selector: 'app-sensors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css'],
})
export class SensorsComponent implements OnInit {
  constructor(private http: HttpClient, private sensorService: SensorService, private measurementService: MeasurementService) {}
  SensorMeasurementRepository: SensorMeasurementRepository[];


  ngOnInit(): void {
    console.log("Loading data");

   forkJoin({
      sensors: this.sensorService.getAllSensors(),
      measurements: this.measurementService.getAllMeasurements(),
    }).subscribe(({ sensors, measurements }) => {
      console.log(sensors);
      console.log(measurements);
      this.SensorMeasurementRepository = this.mapSensorsToRepositories(sensors, measurements);
    });
  }

  private mapSensorsToRepositories(sensors: Sensor[], measurements: Measurement[]): SensorMeasurementRepository[] {
    return sensors.map(sensor => {
      const sensorMeasurements = measurements.filter(
        measurement => measurement.sensorid === sensor.sensorid // Assuming measurements have a `sensorId` field
      );
      //const l_Measurement = this.getLatestMeasurement(sensorMeasurements);
      return {
        sensorid: sensor.sensorid,
        sensorname: sensor.sensorname,
        measurementList: sensorMeasurements,
        latestMeasurement: sensorMeasurements[0],
      };
    });
  }

  // Find the latest measurement for a sensor
  private getLatestMeasurement(measurements: Measurement[]): Measurement | null {
    if (!measurements || measurements.length === 0) return null;
    return measurements.reduce((latest, current) =>
      this.convertToDate(current.measurementtime) > this.convertToDate(latest.measurementtime) ? current : latest
    );
  }

  private convertToDate(dateString: string): Date | null {
  const [time, date] = dateString.split('-'); // Split into time and date
  const [hours, minutes] = time.split(':');  // Split time into hours and minutes
  const [day, month, year] = date.split('.'); // Split date into day, month, and year

  // Build a string in the format `yyyy-mm-ddThh:mm:ss`
  const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours}:${minutes}:00`;

  // Create a Date object from the formatted string
  const dateObject = new Date(formattedDate);

  // Check if the date is valid
  if (isNaN(dateObject.getTime())) {
    return null;  // Return null if the date is invalid
  }
  
  return dateObject;
}
}

export interface Sensor {
  sensorid: number;
  sensorname: string;
  sensorlocation: string;
  sensortype: number;
  sensorActive: boolean;
}
