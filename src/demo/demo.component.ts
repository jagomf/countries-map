import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ChartErrorEvent, CountriesMapModule } from 'countries-map';

@Component({
  selector: 'demo-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './demo.component.html',
  styles: [''],
  imports: [CountriesMapModule]
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
    'BE' : { value:  0, extra: { 'Ickx': '', 'Boutsen': '' } },
    'CH' : { value:  0, extra: { 'Siffert': '', 'Regazzoni': '' } },
    'SE' : { value:  0, extra: { 'Peterson': '', 'Ericsson': '' } },
    'MC' : { value:  0, extra: { 'Chiron': '', 'Leclerc': '' } },
    'MX' : { value:  0, extra: { 'Rodríguez': '', 'Pérez': '' } },
    'CO' : { value:  0, extra: { 'Montoya': '' } },
    'VE' : { value:  0, extra: { 'Maldonado': '' } },
    'PT' : { value:  0, extra: { 'Lamy': '', 'Monteiro': '' } },
    'PL' : { value:  0, extra: { 'Kubica': '' } },
    'DK' : { value:  0, extra: { 'Magnussen, J.': '', 'Magnussen, K.': '' } },
    'RU' : { value:  0, extra: { 'Petrov': '', 'Kvyat': '' } },
    'JP' : { value:  null, extra: { 'Sato': '', 'Yamamoto': '', 'Kobayashi': '', 'Tsunoda': '' } },
    'IN' : { value:  null, extra: { 'Karthikeyan': '', 'Chandhok': '' } },
    'MY' : { value:  null, extra: { 'Yoong': '' } },
    'ID' : { value:  0, extra: { 'Haryanto': '' } },
    'TH' : { value:  0, extra: { 'Albon': '' } },
    'CN' : { value:  0, extra: { 'Zhou': '' } },
  };

  readonly errorLoading = signal<ChartErrorEvent | null>(null);
  mapError(error: ChartErrorEvent): void {
    this.errorLoading.set(error);
  }
  mapReady(): void {
    console.log('Map ready');
  }
}
