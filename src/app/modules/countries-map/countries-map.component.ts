declare var google: any;

import {
  Component,
  ElementRef,
  ChangeDetectionStrategy,
  OnChanges,
  Input,
  Output,
  SimpleChanges,
  EventEmitter
} from '@angular/core';
import { GoogleChartsLoaderService } from './google-charts-loader.service';
import { ChartSelectEvent, ChartErrorEvent } from './chart-events';
import { en as countriesEN } from '@jagomf/countrieslist';

const valueHolder = 'value';
const countryName = (countryCode: string): string => {
  return countriesEN[countryCode];
};

interface Extra {
  key: string;
  val: string;
}
interface Selection {
  countryId: string;
  countryName: string;
  extra: Extra[] | null;
}

@Component({
  selector: 'countries-map',
  templateUrl: './countries-map.component.html',
  styleUrls: ['./countries-map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountriesMapComponent implements OnChanges {

  @Input() public data: any;
  @Input() public apiKey: string;
  @Input() public options: any;
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

  public googleData: string[][];
  public wrapper: any;
  public selection: Selection | null = null;

  private el: ElementRef;
  private loaderService: GoogleChartsLoaderService;

  public constructor(
    el: ElementRef,
    loaderService: GoogleChartsLoaderService
  ) {
    this.el = el;
    this.loaderService = loaderService;
    this.chartSelect = new EventEmitter();
    this.chartReady = new EventEmitter();
    this.chartError = new EventEmitter();
  }

  private getExtraSelected(): Extra[] | null {
    if (this.selection) {
      const extra = this.data[this.selection.countryId];
      delete extra[valueHolder];
      return Object.keys(extra).map(key => ({ key, val: extra[key] }));
    }
    return null;
  }

  private selectCountry(country?: string): void {
    if (country) {
      this.selection = {
        countryId: country,
        countryName: countryName(country),
        extra: null
      };
      this.selection.extra = this.getExtraSelected();
    } else {
      this.selection = null;
    }
  }

  /**
   * Pasar de una tabla en forma
   * { GB: { value:123, ...otherdata }, ES: { value:456, ...whatever } }
   * a un array para Google Charts en forma
   * [ ['Country', 'Value'], ['GB', 123], ['ES', 456] ]
   * y almacernarlo en this.processedData
   */
  private processInputData(): void {
    this.googleData = Object.keys(this.data).reduce((acc, currKey) => {
      const currVal = this.data[currKey][valueHolder];
      acc.push([currKey, currVal]);
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
      });
    }
  }

  public redraw(): void {
    this.wrapper.draw(this.el.nativeElement.querySelector('div.map-content'));
  }

  private onChartReady(): void {
    this.chartReady.emit();
  }

  private onCharterror(error: any): void {
    this.chartError.emit(error as ChartErrorEvent);
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
