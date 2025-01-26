import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
import { ObservableArray } from '@nativescript/core';
import { RadCartesianChart } from "nativescript-ui-chart";

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
  chartSeries: any[] = [];

  @ViewChild(Page, { static: false }) page: Page;

  constructor(private http: HttpClient,
              private sensorService: SensorService,
              private measurementService: MeasurementService,
              private router: Router) {}

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
        //console.log("SensorMeasurementRepository loaded:", this.SensorMeasurementRepository);
        this.SensorMeasurementRepository.forEach(sens => {
          this.loadChartData(sens);
        });
        console.log(this.chartSeries);
      },
      error: (err) => {
        console.error('Error loading data:', err);
      },
    });
  }

   loadChartData(repository: SensorMeasurementRepository) {
    const last30DaysData = this.getLast30DaysData(repository);
    const dataPoints = last30DaysData.map(item => {
    const measurementDate = this.convertToDate(item.measurementtime);

      if (!measurementDate || isNaN(measurementDate.getTime())) {
        console.warn("Skipping invalid date:", item.measurementtime);
        return null;
      }

      return {
        value: item.measurementtemperature,
        category: this.formatDateForChart(measurementDate),
      };
    }).filter(dataPoint => dataPoint !== null);

    if (dataPoints.length === 0) {
      console.warn(`No valid data for sensor ${repository.sensorid}`);
      this.chartSeries.push({
        name: `Sensor ${repository.sensorid} - No Data`,
        data: [],
      });
      return;
    }

    this.chartSeries.push({
      name: `Sensor ${repository.sensorid} - Temperature`,
      data: dataPoints,
    });
  }

private formatDateForChart(date: Date): string {
  if (!date || isNaN(date.getTime())) {
    console.error("Invalid date passed to formatDateChart:", date);
    return '';
  }
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes}-${day}.${month}.${year}`;
}

  private getLast30DaysData(repository: SensorMeasurementRepository) {
    const currentDate = new Date();
    const thirtyDaysAgo = currentDate.getTime() - (30 * 24 * 60 * 60 * 1000);
        const last30DaysData = repository.measurementList.filter((measurement) => {
            const measurementDate = this.convertToDate(measurement.measurementtime);
                return measurementDate.getTime() >= thirtyDaysAgo;
        });
    //console.log("last 30 days data:");
    //console.log(last30DaysData);
        return last30DaysData;
  }

  private mapSensorsToRepositories(sensors: any[], measurementsData: any): SensorMeasurementRepository[] {
    const measurements: Measurement[] = measurementsData?._embedded?.Measurements || [];
    return sensors.map((sensor) => {
      const sensorMeasurements = measurements.filter(
        (measurement) => measurement.sensorid === sensor.sensorid
      );
      const l_measurement = this.getLatestMeasurement(sensorMeasurements);
      const l_10measurements = this.getLatestTenMeasurements(sensorMeasurements);
      const chartSeries = this.getChartSeries(sensorMeasurements);
        console.log('Chart series for sensor:', sensor.sensorid, chartSeries); // Log chart series
      return {
        sensorid: sensor.sensorid,
        sensorname: sensor.sensorname,
        measurementList: sensorMeasurements,
        latestMeasurement: l_measurement,
        latestTenMeasurements: l_10measurements,
        chartSeries: chartSeries,
      };
    });
  }

  private getChartSeries(measurements: Measurement[]): any[] {
    return [
      {
        name: "Sensor Data",
        data: measurements.map((measurement) => ({
          value: measurement.measurementtemperature,
          category: this.convertToDate(measurement.measurementtime), // Ensure this returns a Date object
        })),
      },
    ];
  }

  private getLatestTenMeasurements(measurements: Measurement[]): Measurement[] | null {
    let givenList = measurements;
    let retList: Measurement[] = [];

    for (let i = 0; i < 10 && givenList.length != 0; i++) {
      const latestMeasurement = this.getLatestMeasurement(givenList);

      if (latestMeasurement != null) {
        retList.push(latestMeasurement);
        givenList = givenList.filter(measurement => measurement.measurementtime != latestMeasurement.measurementtime);
      }
    }

    return retList;
  }

  private getLatestMeasurement(measurements: Measurement[]): Measurement | null {
    if (!measurements || measurements.length === 0) return null;
    return measurements.reduce((latest, current) =>
      this.convertToDate(current.measurementtime) > this.convertToDate(latest.measurementtime) ? current : latest
    );
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

  ngAfterViewInit(): void {
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
