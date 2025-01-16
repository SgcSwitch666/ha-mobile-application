import { Routes } from '@angular/router';
import { SensorsComponent } from './sensors/sensors.component';

export const routes: Routes = [
  { path: '', redirectTo: '/items', pathMatch: 'full' },
  { path: 'items', component: SensorsComponent },
];
