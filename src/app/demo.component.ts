import { Component } from '@angular/core';
import { ChartErrorEvent } from '../../projects/lib/src/public-api'; // TODO: 'countries-map'

@Component({
  selector: 'demo-content',
  templateUrl: './demo.component.html',
  styles: ['']
})
export class DemoComponent {
  public mapData = {
    'GB' : { value:  20, extra: {
      'Hamilton': '2008, 2014-2015, 2017-2020', 'Stewart': '1969, 1971, 1973', 'Hill, G.': '1962, 1968',
      'Clark': '1963, 1965', 'Button': '1980', 'Hawthorn': '1958', 'Hill, D.': '1996', 'Hunt': '1947',
      'Mansell': '1992', 'Surtees': '1964'
    } },
    'DE' : { value:  12, extra: { 'Schumacher': '1994-1995, 2000-2004', 'Vettel': '2010-2013', 'Rosberg, N.': '2016' } },
    'BR' : { value:  8, extra: { 'Fittipaldi': '1972, 1974', 'Senna': '1988, 1990-1991', 'Piquet': '1981, 1983, 1987' } },
    'AR' : { value:  5, extra: { 'Fangio': '1951, 1954-1957' } },
    'FI' : { value:  4, extra: { 'Häkkinen': '1998-1999', 'Räikkönen': '2007', 'Rosberg, K.': '1982' } },
    'AU' : { value:  4, extra: { 'Brabham': '1959-1960, 1966', 'Jones': '1980' } },
    'AT' : { value:  4, extra: { 'Lauda': '1975, 1977, 1984', 'Rindt': '1970' } },
    'FR' : { value:  4, extra: { 'Prost': '1985-1986, 1989, 1993' } },
    'IT' : { value:  3, extra: { 'Ascari': '1952-1953', 'Farina': '1950' } },
    'US' : { value:  2, extra: { 'Hill, P.': '1961', 'Andretti': '1978' } },
    'ES' : { value:  2, extra: { 'Alonso': '2005-2006' } },
    'NZ' : { value:  1, extra: { 'Hulme': '1967' } },
    'ZA' : { value:  1, extra: { 'Scheckter': '1979' } },
    'CA' : { value:  1, extra: { 'Villeneuve': '1997' } },
    'PT' : { value:  0, extra: { 'Monteiro': null } },
    'MX' : { value:  0, extra: { 'Pérez': null } },
    'RU' : { value:  0, extra: { 'Petrov': null, 'Kviat': null } },
    'IN' : { value:  null, extra: { 'Chandhok': null, 'Karthikeiyan': null } },
    'JP' : { value:  null, extra: { 'Sato': null, 'Yamamoto': null } },
    'MY' : { value:  null, extra: { 'Yoong': null } },
  };

  errorLoading = null;
  mapError(error: ChartErrorEvent): void {
    this.errorLoading = error;
  }
  mapReady(): void {
    console.log('Map ready');
  }
}
