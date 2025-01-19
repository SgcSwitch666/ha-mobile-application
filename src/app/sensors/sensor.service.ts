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
      private measurementService = inject(MeasurementService);

  constructor(private http: HttpClient) { }

getAllSensors(): Observable<Sensor[]> {
    return this.http.get<Sensor[]>(this.apiUrl);
  }
  getSensorMeasurementRepository() : SensorMeasurementRepository[]{
      let SensorMeasurementRepository : SensorMeasurementRepository[];

      forkJoin({
            sensors: this.getAllSensors(),
            measurements: this.measurementService.getAllMeasurements(),
          }).subscribe({
            next: ({ sensors, measurements }) => {
              SensorMeasurementRepository = this.mapSensorsToRepositories(
                sensors,
                measurements
              );
            },
            error: (err) => {
              console.error('Error loading data:', err);
            },
          });
      return SensorMeasurementRepository;
      }
    private mapSensorsToRepositories(
      sensors: any[],  // Update this with the correct types based on your API response
      measurementsData: any  // Use a specific type instead of `any`
    ): SensorMeasurementRepository[] {
      const measurements: Measurement[] = measurementsData?._embedded?.Measurements || [];
      return sensors.map((sensor) => {
        const sensorMeasurements = measurements.filter(
          (measurement) => measurement.sensorid === sensor.sensorid
        );
          const l_measurement=this.getLatestMeasurement(sensorMeasurements);
        return {
          sensorid: sensor.sensorid,
          sensorname: sensor.sensorname,
          measurementList: sensorMeasurements,
          latestMeasurement: l_measurement,
        };
      });
    }

    private getLatestMeasurement(measurements: Measurement[]): Measurement | null {
      if (!measurements || measurements.length === 0) return null;
      return measurements.reduce((latest, current) =>
        this.convertToDate(current.measurementtime) > this.convertToDate(latest.measurementtime) ? current : latest
      );
    }

  private getLatestTenMeasurements(measurements: Measurement[]) : Measurement[] | null {
          let givenList = measurements;
          let retList : Measurement[] = [];

          for ( let i = 0; i < 10 && givenList.length != 0; i++) {
              const latestMeasurement = this.getLatestMeasurement(givenList);
              if (latestMeasurement != null) {
                  retList.push(latestMeasurement);
                  givenList = givenList.filter(measurement => measurement.measurementid === latestMeasurement.measurementid);
              }
          }

          return retList;
      }

    private convertToDate(dateString: string): Date | null {
      const [time, date] = dateString.split('-');
      const [hours, minutes] = time.split(':');
      const [day, month, year] = date.split('.');

      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hours}:${minutes}:00`;
      const dateObject = new Date(formattedDate);

      if (isNaN(dateObject.getTime())) {
        return null;
      }
      return dateObject;
    }


  }



