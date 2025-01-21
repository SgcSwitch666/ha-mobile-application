import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NativeScriptCommonModule } from '@nativescript/angular';
import { SensorService } from './sensor.service';
import { MeasurementService } from '../measurements/measurements.service';
import { Measurement } from '../measurements/measurements.component';
import { Sensor } from './sensors.component'; // Annahme: Sensor-Modell wird hier exportiert

@Component({
  selector: 'sensor-detail',
  templateUrl: './sensor-detail.component.html',
  styleUrls: ['./sensor-detail.component.css'],
  imports: [NativeScriptCommonModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SensorDetail implements OnInit {
  sensorDetails: Sensor | null = null; // Für die Sensor-Details
  last10Measurements: Measurement[] = []; // Für die letzten 10 Messungen

  constructor(
    private sensorService: SensorService,
    private measurementService: MeasurementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const sensorId = Number(this.route.snapshot.paramMap.get('id'));

    // Abrufen der Sensor-Details basierend auf der ID
    this.sensorService.getAllSensors().subscribe((sensors) => {
      this.sensorDetails = sensors.find((sensor) => sensor.sensorid === sensorId) || null;

      if (this.sensorDetails) {
        // Wenn der Sensor gefunden wurde, die letzten 10 Messungen abrufen
        this.measurementService.getAllMeasurements().subscribe((measurements) => {
          const sensorMeasurements = measurements.filter(
            (measurement) => measurement.sensorid === this.sensorDetails!.sensorid
          );
          this.last10Measurements = this.getLatestTenMeasurements(sensorMeasurements);
        });
      }
    });
  }

  // Funktion, um die letzten 10 Messungen zu holen
  private getLatestTenMeasurements(measurements: Measurement[]): Measurement[] {
    return measurements
      .sort((a, b) =>
        new Date(b.measurementtime).getTime() - new Date(a.measurementtime).getTime()
      )
      .slice(0, 10);
  }
}
