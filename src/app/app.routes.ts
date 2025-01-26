import { Routes } from '@angular/router';
import { SensorsComponent } from './sensors/sensors.component';
import { RouterModule } from '@angular/router';


export const routes: Routes = [
  { path: '', redirectTo: '/sensors', pathMatch: 'full' },
  { path: 'sensors', component: SensorsComponent },
];
