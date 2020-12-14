import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesMapBaseComponent } from './base-map.component';
import { CountriesMapComponent } from './countries-map.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CountriesMapBaseComponent, CountriesMapComponent],
  exports: [
    CountriesMapComponent
  ]
})
export class CountriesMapModule { }
