import { Routes } from '@angular/router';
import { MapComponent } from './map/map.component';  // Update the path to the correct location

export const routes: Routes = [
  { path: '', redirectTo: 'map', pathMatch: 'full' },
  { path: 'map', component: MapComponent }
];