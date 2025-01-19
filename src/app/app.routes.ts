import { Routes } from '@angular/router';
import { SensorsComponent } from './sensors/sensors.component';
import { SensorDetail } from './sensors/sensor-detail.component';


export const routes: Routes = [
  { path: '', redirectTo: '/sensors', pathMatch: 'full' },
  { path: 'sensors', component: SensorsComponent },
  //{ path: 'sensors/:id', component: SensorDetail},
];
