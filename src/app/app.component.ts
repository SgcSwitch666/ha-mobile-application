import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { PageRouterOutlet } from '@nativescript/angular';
import { provideHttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { MeasurementsComponent } from './measurements/measurements.component';

@Component({
  selector: 'ns-app',
  templateUrl: './app.component.html',
  imports: [PageRouterOutlet, MeasurementsComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppComponent {
  data: any;
  constructor(private http: HttpClient) {}
}
