declare var google: any;

import {
  Component,
  ElementRef,
  OnChanges,
  Input,
  Output,
  SimpleChanges,
  EventEmitter
} from '@angular/core';
import { GoogleChartsLoaderService } from './google-charts-loader.service';
import { ChartSelectEvent, ChartErrorEvent, CharErrorCode } from './chart-events.interface';
import { CountriesData, SelectionExtra, Selection } from './data-types.interface';
import { en as countriesEN } from '@jagomf/countrieslist';

const valueHolder = 'value';
const countryName = (countryCode: string): string => {
  return countriesEN[countryCode];
};

@Component({
  selector: 'countries-map',
  templateUrl: './countries-map.component.html',
  styleUrls: ['./countries-map.component.css']
})
export class CountriesMapComponent implements OnChanges {

  @Input() public data: CountriesData;
  @Input() public apiKey: string;
  @Input() public options: any;
  @Input() public countryLabel = 'Country';
  @Input() public valueLabel = 'Value';
  @Input() public showCaption = true;
  @Input() public captionBelow = true;
  @Input() public minValue = 0;
  @Input() public maxValue: number;
  @Input() public minColor = 'white';
  @Input() public maxColor = 'red';
  @Input() public noDataColor = '#CFCFCF';
  @Input() public exceptionColor = '#FFEE58';

  @Output() public chartReady: EventEmitter<void>;
  @Output() public chartError: EventEmitter<ChartErrorEvent>;
  @Output() public chartSelect: EventEmitter<ChartSelectEvent>;

  googleData: string[][];
  wrapper: any;
  selection: Selection | null = null;
  loading = true;
  get selectionValue() {
    return this.data[this.selection.countryId].value;
  }

  public constructor(
    private el: ElementRef,
    private loaderService: GoogleChartsLoaderService
  ) {
    this.el = el;
    this.loaderService = loaderService;
    this.chartSelect = new EventEmitter();
    this.chartReady = new EventEmitter();
    this.chartError = new EventEmitter();
  }

  private getExtraSelected(country: string): SelectionExtra[] | null {
    const { extra } = this.data[country];
    return extra && Object.keys(extra).map(key => ({ key, val: extra[key] }));
  }

  private selectCountry(country?: string): void {
    this.selection = country ? {
      countryId: country,
      countryName: countryName(country),
      extra: this.getExtraSelected(country)
    } : null;
  }

  /**
   * Pasar de una tabla en forma
   * `{ GB: { value:123, ...otherdata }, ES: { value:456, ...whatever } }`
   * a un array para Google Charts en forma
   * `[ ['Country', 'Value'], ['GB', 123], ['ES', 456] ]`
   * y almacernarlo en this.processedData
   */
  private processInputData(): void {
    this.googleData = Object.entries(this.data).reduce((acc, [key, val]) => {
      const valContent = val[valueHolder].toString();
      acc.push([key, valContent]);
      return acc;
    }, [['Country', 'Value']]);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const key = 'data';
    if (changes[key]) {

      if (!this.data) {
        return;
      }

      const defaultOptions = {
        colorAxis: {
          colors: [this.minColor, this.maxColor],
          minValue: Number.isInteger(this.minValue) ? this.minValue : undefined,
          maxValue: Number.isInteger(this.maxValue) ? this.maxValue : undefined
        },
        datalessRegionColor: this.noDataColor,
        defaultColor: this.exceptionColor,
        legend: this.showCaption,
        tooltip: { trigger: 'none' }
      };

      this.loaderService.load(this.apiKey).then(() => {
        this.processInputData();

        this.wrapper = new google.visualization.ChartWrapper({
          chartType: 'GeoChart',
          dataTable: this.googleData,
          options: Object.assign(defaultOptions, this.options)
        });

        this.registerChartWrapperEvents();
        this.redraw();
      }, () => {
        this.onCharterror({ id: CharErrorCode.loading, message: 'Could not load' });
      });
    }
  }

  public redraw(): void {
    this.wrapper.draw(this.el.nativeElement.querySelector('div.cm-map-content'));
  }

  private onChartReady(): void {
    this.loading = false;
    this.chartReady.emit();
  }

  private onCharterror(error: ChartErrorEvent): void {
    this.chartError.emit(error);
  }

  private onMapSelect(): void {
    const event: ChartSelectEvent = {
      selected: false,
      value: null,
      country: null
    };

    const selection: any[] = this.wrapper.visualization.getSelection();

    if (selection.length > 0) {
      const { row: tableRow }: { row: number } = selection[0];
      const dataTable = this.wrapper.getDataTable();

      event.selected = true;
      event.value = dataTable.getValue(tableRow, 1);
      event.country = dataTable.getValue(tableRow, 0);
      this.selectCountry(event.country);

    } else {
      this.selectCountry(null);
    }

    this.chartSelect.emit(event);
  }

  private registerChartWrapperEvents(): void {
    const { addListener } = google.visualization.events;
    addListener(this.wrapper, 'ready', this.onChartReady.bind(this));
    addListener(this.wrapper, 'error', this.onCharterror.bind(this));
    addListener(this.wrapper, 'select', this.onMapSelect.bind(this));
  }

}
