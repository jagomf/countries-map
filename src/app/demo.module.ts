import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CountriesMapModule } from 'countries-map';
import { DemoComponent } from './demo.component';


@NgModule({
  declarations: [
    DemoComponent
  ],
  imports: [
    CountriesMapModule,
    BrowserModule
  ],
  providers: [],
  bootstrap: [DemoComponent]
})
export class DemoModule { }
