import { Component, OnInit, inject,AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SensorService } from './sensor.service';
import { MeasurementService } from '../measurements/measurements.service';
import { SensorMeasurementRepository } from '../modules/sensorMeasurementRepository';
import { Measurement } from '../measurements/measurements.component';
import { forkJoin } from 'rxjs';
import { Page } from '@nativescript/core';  // Add this import for Page
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';

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

  // @ViewChild to access the Page component in the template
  @ViewChild(Page, { static: false }) page: Page;

  private sensorService = inject(SensorService);
  private measurementService = inject(MeasurementService);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log("Loading data");


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

