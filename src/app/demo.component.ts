import { Component } from '@angular/core';
import { ChartErrorEvent } from './modules/countries-map/chart-events.interface';

@Component({
  selector: 'demo-content',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent {
  public mapData = {
    'CA' : { value:  1, extra: { 'Villeneuve': '', 'Stroll': '' } },
    'ES' : { value:  2, extra: { 'Alonso': '', 'Sainz': '', 'De la Rosa': '', 'De Villota': '', 'Jordá': '' } },
    'FR' : { value:  4, extra: { 'Grosjean': '', 'Prost': '' } },
    'GB' : { value:  17, extra: {
      'Hamilton': '1985', 'Button': '1980', 'Coulthard': '1971', 'Mansell': '1953', 'Hunt': '1947', 'Wolff': '1982'
    } },
    'PT' : { value:  0, extra: { 'Monteiro': '0' } },
    'IT' : { value:  3, extra: { 'Trulli': '', 'Lombardi': '', 'Farina': '' } },
    'MX' : { value:  0, extra: { 'Pérez': '' } },
    'AT' : { value:  4, extra: { 'Lauda': '' } },
    'AU' : { value:  4, extra: { 'Ricciardo': '', 'Webber': '', 'Brabham': '' } },
    'AR' : { value:  5, extra: { 'Fangio': '' } },
    'RU' : { value:  0, extra: { 'Petrov': '', 'Kvyat': '' } },
    'US' : { value:  2, extra: { 'Hill': '' } },
    'FI' : { value:  4, extra: { 'Raikkonen': '', 'Hakkinen': '' } },
    'JP' : { value:  0, extra: { 'Sato': '', 'Yamamoto': '' } },
    'NZ' : { value:  1, extra: { 'Hulme': '' } },
    'ZA' : { value:  1, extra: { 'Scheckter': '' } },
    'IN' : { value:  0, extra: { 'Karthikeiyan': '', 'Chandhok': '' } },
    'BR' : { value:  8, extra: { 'Massa': '', 'Barrichello': '', 'Senna': '', 'Piquet': '' } },
    'DE' : { value:  12, extra: { 'Vettel': '', 'Schumacher': '' } }
  };

  errorLoading = null;
  mapError(error: ChartErrorEvent) {
    this.errorLoading = error;
  }
  mapReady() {
    console.log('Map ready');
  }
}
