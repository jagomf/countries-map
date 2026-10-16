import { Component } from '@angular/core';
import { ChartErrorEvent, CountriesMapModule } from 'countries-map';
import { NgIf } from '@angular/common';

@Component({
    selector: 'demo-content',
    templateUrl: './demo.component.html',
    styles: [''],
    standalone: true,
    imports: [NgIf, CountriesMapModule]
})
export class DemoComponent {
  public mapData = {
    'GB' : { value:  21, extra: {
      'Hawthorn': '1958', 'Hill, G.': '1962, 1968', 'Clark': '1963, 1965', 'Surtees': '1964',
      'Stewart': '1969, 1971, 1973', 'Hunt': '1976', 'Mansell': '1992', 'Hill, D.': '1996',
      'Hamilton': '2008, 2014-2015, 2017-2020', 'Button': '2009', 'Norris': '2025'
    } },
    'DE' : { value:  12, extra: { 'Schumacher': '1994-1995, 2000-2004', 'Vettel': '2010-2013', 'Rosberg, N.': '2016' } },
    'BR' : { value:  8, extra: { 'Fittipaldi': '1972, 1974', 'Piquet': '1981, 1983, 1987', 'Senna': '1988, 1990-1991' } },
    'AR' : { value:  5, extra: { 'Fangio': '1951, 1954-1957' } },
    'AU' : { value:  4, extra: { 'Brabham': '1959-1960, 1966', 'Jones': '1980' } },
    'AT' : { value:  4, extra: { 'Rindt': '1970', 'Lauda': '1975, 1977, 1984' } },
    'FI' : { value:  4, extra: { 'Rosberg, K.': '1982', 'Häkkinen': '1998-1999', 'Räikkönen': '2007' } },
    'FR' : { value:  4, extra: { 'Prost': '1985-1986, 1989, 1993' } },
    'NL' : { value:  4, extra: { 'Verstappen': '2021-2024' } },
    'IT' : { value:  3, extra: { 'Farina': '1950', 'Ascari': '1952-1953' } },
    'US' : { value:  2, extra: { 'Hill, P.': '1961', 'Andretti': '1978' } },
    'ES' : { value:  2, extra: { 'Alonso': '2005-2006' } },
    'NZ' : { value:  1, extra: { 'Hulme': '1967' } },
    'CA' : { value:  1, extra: { 'Villeneuve': '1997' } },
    'ZA' : { value:  1, extra: { 'Scheckter': '1979' } },
    'BE' : { value:  0, extra: { 'Ickx': null, 'Boutsen': null } },
    'CH' : { value:  0, extra: { 'Siffert': null, 'Regazzoni': null } },
    'SE' : { value:  0, extra: { 'Peterson': null, 'Ericsson': null } },
    'MC' : { value:  0, extra: { 'Chiron': null, 'Leclerc': null } },
    'MX' : { value:  0, extra: { 'Rodríguez': null, 'Pérez': null } },
    'CO' : { value:  0, extra: { 'Montoya': null } },
    'VE' : { value:  0, extra: { 'Maldonado': null } },
    'PT' : { value:  0, extra: { 'Lamy': null, 'Monteiro': null } },
    'PL' : { value:  0, extra: { 'Kubica': null } },
    'DK' : { value:  0, extra: { 'Magnussen, J.': null, 'Magnussen, K.': null } },
    'RU' : { value:  0, extra: { 'Petrov': null, 'Kvyat': null } },
    'JP' : { value:  null, extra: { 'Sato': null, 'Yamamoto': null, 'Kobayashi': null, 'Tsunoda': null } },
    'IN' : { value:  null, extra: { 'Karthikeyan': null, 'Chandhok': null } },
    'MY' : { value:  null, extra: { 'Yoong': null } },
    'ID' : { value:  0, extra: { 'Haryanto': null } },
    'TH' : { value:  0, extra: { 'Albon': null } },
    'CN' : { value:  0, extra: { 'Zhou': null } },
  };

  errorLoading = null;
  mapError(error: ChartErrorEvent): void {
    this.errorLoading = error;
  }
  mapReady(): void {
    console.log('Map ready');
  }
}
