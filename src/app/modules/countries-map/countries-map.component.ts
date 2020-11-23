import {
  Component,
  ElementRef,
  OnChanges,
  Input,
  Output,
  OnDestroy,
  HostListener,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter
} from '@angular/core';
import { GoogleChartsLoaderService } from './google-charts-loader.service';
import { ChartSelectEvent, ChartErrorEvent, CharErrorCode } from './chart-events.interface';
import { CountriesData, SelectionExtra, Selection, ValidCountryData } from './data-types.interface';
import { en as countriesEN } from '@jagomf/countrieslist';

const valueHolder = 'value';
const countryName = (countryCode: string): string => {
  return countriesEN[countryCode];
};

@Component({
  selector: 'countries-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './countries-map.component.html',
  styleUrls: ['./countries-map.component.css']
})
export class CountriesMapComponent implements OnChanges, OnDestroy {

  @Input() data: CountriesData;
  @Input() apiKey: string;
  @Input() options: any;
  @Input() countryLabel = 'Country';
  @Input() valueLabel = 'Value';
  @Input() showCaption = true;
  @Input() captionBelow = true;
  @Input() autoResize = false;
  @Input() minValue = 0;
  @Input() maxValue: number;
  @Input() minColor = 'white';
  @Input() maxColor = 'red';
  @Input() backgroundColor = 'white';
  @Input() noDataColor = '#CFCFCF';
  @Input() exceptionColor = '#FFEE58';

  @Output() private readonly chartReady = new EventEmitter<void>();
  @Output() private readonly chartError = new EventEmitter<ChartErrorEvent>();
  @Output() private readonly chartSelect = new EventEmitter<ChartSelectEvent>();

  @ViewChild('mapContent', { static: false }) private readonly mapContent: ElementRef;

  private proportion: number;
  private googleData: ValidCountryData[][];
  private wrapper: google.visualization.ChartWrapper;

  selection: Selection | null = null;

  private innerLoading = true;
  get loading() {
    return this.innerLoading;
  }

  get selectionValue() {
    return this.data[this.selection.countryId].value;
  }

  constructor(
    private readonly cdRef: ChangeDetectorRef,
    private readonly el: ElementRef,
    private readonly loaderService: GoogleChartsLoaderService
  ) {
  }

  @HostListener('window:deviceorientation')
  @HostListener('window:resize')
  screenSizeChanged(): void {
    if (!this.loading && this.autoResize) {
      const map: HTMLElement = this.mapContent.nativeElement;
      map.style.setProperty('height', `${map.clientWidth * this.proportion}px`);
      this.redraw();
    }
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
    this.cdRef.detectChanges();
  }

  /**
   * Convert a table (object) formatted as
   * `{ GB: { value:123, ...otherdata }, ES: { value:456, ...whatever } }`
   * to an array for Google Charts formatted as
   * `[ ['Country', 'Value'], ['GB', 123], ['ES', 456] ]`
   * and save to this.processedData
   */
  private processInputData(): void {
    this.googleData = Object.entries(this.data).reduce((acc, [key, val]) => {
      const rawValContent = val[valueHolder];
      acc.push([key, rawValContent === null ? null : rawValContent ? +rawValContent.toString() : 0]);
      return acc;
    }, [['Country', 'Value']] as ValidCountryData[][]);
  }

  ngOnChanges({ data }: { data: any }): void {
    if (data) {

      if (!this.data) {
        return;
      }

      this.initializeMap({
        //#region DEFAULTS (automatically set):
        // displayMode: 'regions',
        // region: 'world',
        // enableRegionInteractivity: true,
        // keepAspectRatio: true,
        //#endregion
        colorAxis: {
          colors: [this.minColor, this.maxColor],
          minValue: Number.isInteger(this.minValue) ? this.minValue : undefined,
          maxValue: Number.isInteger(this.maxValue) ? this.maxValue : undefined
        },
        datalessRegionColor: this.noDataColor,
        backgroundColor: this.backgroundColor,
        defaultColor: this.exceptionColor,
        legend: 'none',
        tooltip: { trigger: 'none' }
      });
    }
  }

  private async initializeMap(defaultOptions: google.visualization.GeoChartOptions) {
    try {
      await this.loaderService.load(this.apiKey);

      this.processInputData();

      this.wrapper = new google.visualization.ChartWrapper({
        chartType: 'GeoChart',
        dataTable: this.googleData,
        options: Object.assign(defaultOptions, this.options)
      });

      this.registerChartWrapperEvents();
      this.redraw();

      const self: HTMLElement = this.el.nativeElement;
      this.proportion = self.clientHeight / self.clientWidth;
    } catch (e) {
      this.onCharterror({ id: CharErrorCode.loading, message: 'Could not load' });
    }
  }

  redraw(): void {
    this.wrapper.draw(this.el.nativeElement.querySelector('div.cm-map-content'));
  }

  private onChartReady(): void {
    if (this.innerLoading) {
      this.innerLoading = false;
      this.chartReady.emit();
    }
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

    const selection = this.wrapper.getChart().getSelection();

    if (selection.length > 0) {
      const { row: tableRow } = selection[0];
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

  ngOnDestroy() {
    const { removeListener } = google.visualization.events;
    removeListener('ready');
    removeListener('error');
    removeListener('select');
  }

}
