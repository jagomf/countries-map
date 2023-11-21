import { importProvidersFrom } from '@angular/core';
import { DemoComponent } from './demo/demo.component';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { CountriesMapModule } from 'countries-map';

bootstrapApplication(DemoComponent, {
  providers: [importProvidersFrom(CountriesMapModule, BrowserModule)]
})
  .catch(err => console.error(err));
