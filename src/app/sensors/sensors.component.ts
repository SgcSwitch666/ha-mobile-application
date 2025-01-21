import { Component, OnInit,AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SensorService } from './sensor.service';
import { MeasurementService } from '../measurements/measurements.service';
import { SensorMeasurementRepository } from '../modules/sensorMeasurementRepository';
import { Measurement } from '../measurements/measurements.component';
import { forkJoin } from 'rxjs';
import { Page } from '@nativescript/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sensors',
  standalone: true,
  imports: [CommonModule, NativeScriptCommonModule, NativeScriptRouterModule],
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css'],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SensorsComponent implements OnInit, AfterViewInit {
  public SensorMeasurementRepository: SensorMeasurementRepository[] = [];

  @ViewChild(Page, { static: false }) page: Page;
 // private sensorService = inject(SensorService);
  //private measurementService = inject(MeasurementService);

  constructor(private http: HttpClient,
                private sensorService: SensorService,
                private measurementService: MeasurementService,
                ) {}

  ngOnInit(): void {
    console.log("Loading data");

    forkJoin({
                sensors: this.sensorService.getAllSensors(),
                measurements: this.measurementService.getAllMeasurements(),
              }).subscribe({
                next: ({ sensors, measurements }) => {
                  this.SensorMeasurementRepository = this.mapSensorsToRepositories(
                    sensors,
                    measurements
                  );
                },
                error: (err) => {
                  console.error('Error loading data:', err);
                },
              });
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

   private getLatestMeasurement(measurements: Measurement[]): Measurement | null {
      if (!measurements || measurements.length === 0) return null;
      return measurements.reduce((latest, current) =>
        this.convertToDate(current.measurementtime) > this.convertToDate(latest.measurementtime) ? current : latest
      );
    }

  ngAfterViewInit(): void {
    // Ensure page frame is available after the view is loaded
    if (this.page) {
      this.page.on('loaded', () => {
        if (__IOS__) {
          const navigationController = this.page.frame.ios.controller;
          navigationController.navigationBar.prefersLargeTitles = true;
        }
      });
    }
  }


}

export interface Sensor {
  sensorid: number;
  sensorname: string;
  sensorlocation: string;
  sensortype: number;
  sensorActive: boolean;
}

