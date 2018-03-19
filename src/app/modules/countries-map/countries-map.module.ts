import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesMapComponent } from './countries-map.component';
import { GoogleChartsLoaderService } from './google-charts-loader.service';

export { CountryExtraData, CountryData, CountriesData } from './interfaces';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [CountriesMapComponent],
  entryComponents: [CountriesMapComponent],
  providers: [GoogleChartsLoaderService],
  exports: [
    CountriesMapComponent
  ]
})
export class CountriesMapModule { }
