import { NgModule } from '@angular/core';
import { CountriesMapComponent } from './countries-map.component';

/**
 * Kept for apps that use NgModules; standalone components can import `CountriesMapComponent` directly.
 */
@NgModule({
  imports: [CountriesMapComponent],
  exports: [CountriesMapComponent]
})
export class CountriesMapModule { }
