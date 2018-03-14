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

  @Output() public chartReady: EventEmitter<void>;
  @Output() public chartError: EventEmitter<ChartErrorEvent>;
  @Output() public chartSelect: EventEmitter<ChartSelectEvent>;

  public googleData: string[][];
  public wrapper: any;
  public countrySelected: string | null = null;
  public get countrySelectedName(): string {
    return this.countrySelected ? countryName(this.countrySelected) : null;
  }
  public get extraSelected(): { key: string, val: string }[] | null {
    if (this.countrySelected) {
      const extra = this.data[this.countrySelected];
      delete extra[valueHolder];
      return Object.keys(extra).map(key => ({ key, val: extra[key] }));
    }
    return null;
  }

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

  /**
   * Pasar de una tabla en forma
   * { GB: { value:123, ...otherdata }, ES: { value:456, ...whatever } }
   * a un array para Google Charts en forma
   * [ ['Country', 'Value'], ['GB', 123], ['ES', 456] ]
   * y almacernarlo en this.processedData
   */
  private processInputData() {
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

      const options = {
        tooltip: { trigger: 'none' }
      };

      this.loaderService.load(this.apiKey).then(() => {
        this.processInputData();

        this.wrapper = new google.visualization.ChartWrapper({
          chartType: 'GeoChart',
          dataTable: this.googleData,
          options: Object.assign(options, this.options)
        });

        this.registerChartWrapperEvents();
        this.redraw();
      });
    }
  }

  public redraw(): void {
    this.wrapper.draw(this.el.nativeElement.querySelector('div.map-content'));
  }

  private onChartReady() {
    this.chartReady.emit();
  }

  private onCharterror(error: any) {
    this.chartError.emit(error as ChartErrorEvent);
  }

  private onMapSelect() {
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
      this.countrySelected = event.country;

    } else {
      this.countrySelected = null;
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
