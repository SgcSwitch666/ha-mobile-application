import { Component, NO_ERRORS_SCHEMA, OnInit, inject, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NativeScriptCommonModule } from '@nativescript/angular'
import { SensorsComponent } from './sensors.component'
import { SensorService } from './sensor.service'
import { MeasurementService } from '../measurements/measurements.service'
import {Measurement} from '../measurements/measurements.component'


@Component({
  selector: 'sensor-detail',
  templateUrl: './sensor-detail.component.html',
  imports: [NativeScriptCommonModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SensorDetail implements OnInit {
sensorService = inject(SensorService);
  measurementService = inject(MeasurementService);
  route = inject(ActivatedRoute);

  item = signal<Measurement | null>(null); // Signal für das Item
  last10Measurements: Measurement[] = []; // Für die letzten 10 Messungen

  ngOnInit(): void {
    const id = +this.route.snapshot.params.id;

    this.measurementService.getAllMeasurements().subscribe({
      next: (measurements) => {
        // Wenn Messungen da sind, setze sie in das Signal
        this.last10Measurements = measurements.slice(0, 10);  // Zeige nur die letzten 10 Messungen an
        console.log(this.last10Measurements);
      },
      error: (err) => {
        console.error('Fehler beim Abrufen der Messungen:', err);
      }
    });

  }
}
