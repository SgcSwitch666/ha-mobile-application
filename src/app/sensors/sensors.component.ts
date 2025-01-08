import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SensorService } from './sensor.service';

@Component({
  selector: 'app-sensors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sensors.component.html',
  styleUrls: ['./sensors.component.css'],
})
export class SensorsComponent implements OnInit {
  constructor(private http: HttpClient, private sensorService: SensorService) {}
  SensorList: Sensor[];

  ngOnInit(): void {
    console.log('Sensors loading');
    this.loadSensors();
  }

  loadSensors(): void {
    this.sensorService.getAllSensors().subscribe((data) => this.SensorList);
  }
}
export interface Sensor {
  sensorid: number;
  sensorname: string;
  sensorlocation: string;
  sensortype: number;
  sensorActive: boolean;
}
