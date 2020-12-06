import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesMapComponent } from './countries-map.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CountriesMapComponent],
  exports: [
    CountriesMapComponent
  ]
})
export class CountriesMapModule { }
