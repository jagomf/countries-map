import {
  Component,
  ElementRef,
  Input,
  Output,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  AfterViewInit,
  OnChanges,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { CharErrorCode } from './chart-events.interface';
import type { ChartSelectEvent, ChartErrorEvent } from './chart-events.interface';
import type { CountriesData, SelectionExtra, DrawableCountries, Selection,
  ValidExtraData, DrawableCountry } from './data-types.interface';
import { en as countriesEN } from '@jagomf/countrieslist';
import { scale } from 'chroma-js';

const countryClass = 'countryxx';
const oceanId = 'ocean';

const countryName = (countryCode: string): string => {
  return countriesEN[countryCode];
};

@Component({
  selector: 'countries-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './countries-map.component.html',
  styleUrls: ['./countries-map.component.scss']
})
export class CountriesMapComponent implements AfterViewInit, OnChanges {

  @Input() data: CountriesData;
  @Input() countryLabel = 'Country';
  @Input() valueLabel = 'Value';
  @Input() showCaption = true;
  @Input() captionBelow = true;
  @Input() minColor = 'white';
  @Input() maxColor = 'red';
  @Input() backgroundColor = 'white';
  @Input() noDataColor = '#CFCFCF';
  @Input() exceptionColor = '#FFEE58';

  @Output() private readonly chartReady = new EventEmitter<void>();
  @Output() private readonly chartError = new EventEmitter<ChartErrorEvent>();
  @Output() private readonly chartSelect = new EventEmitter<ChartSelectEvent>();

  @ViewChild('mapContent', { static: false }) private readonly mapContent: ElementRef<HTMLElement>;

  mapData: DrawableCountries;
  selection: Selection | null = null;

  private innerLoading = true;
  get loading(): boolean {
    return this.innerLoading;
  }

  get selectionValue(): ValidExtraData {
    return this.data[this.selection.countryId].value;
  }

  constructor(
    private readonly cdRef: ChangeDetectorRef,
  ) { }

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

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const changedMapValueButNotOnStart = ['data', 'minColor', 'maxColor', 'backgroundColor', 'noDataColor', 'exceptionColor']
      .some(attr => changes[attr] && !changes[attr].firstChange);

    if (changedMapValueButNotOnStart) {
      this.initializeMap();
    }
  }

  private initializeMap(): void {
    try {
      const { max: maxVal, min: minVal } = this.data ? Object.values(this.data).reduce(
        ({min, max}: {min: number, max: number}, {value}) => ({
          max: parseInt(value?.toString()) > max ? parseInt(value?.toString()) : max,
          min: parseInt(value?.toString()) < min ? parseInt(value?.toString()) : min
        }), {min: null, max: null}
      ) : {min: 0, max: 1};

      const valToCol = scale([this.minColor, this.maxColor]).colors(maxVal - minVal + 1).reduce((acc, curr, i) =>
        ({ ...acc, [i + minVal]: curr }), {} as { [key: number]: string }
      );

      this.mapData = Object.entries(this.data).reduce((acc, [ countryId, countryVal ]) =>
        ({ ...acc, [countryId.toLowerCase()]: {...countryVal, color: valToCol[parseInt(countryVal.value.toString())]} as DrawableCountry }),
          {} as DrawableCountries
      );

      const svgMap = this.mapContent.nativeElement.children[0] as SVGSVGElement;
      svgMap.style.backgroundColor = this.backgroundColor;
      svgMap.querySelectorAll<SVGSVGElement>(`.${countryClass}`).forEach(item => {
        const mapItem = this.mapData[item.id.toLowerCase()];
        const isException = mapItem ? (typeof mapItem.value === 'undefined' || mapItem.value === null) : false;
        item.style.fill = mapItem ? isException ? this.exceptionColor : mapItem.color : this.noDataColor;
      });

      this.innerLoading = false;
      this.cdRef.detectChanges();
      this.onChartReady();

    } catch (e) {
      this.onCharterror({ id: CharErrorCode.loading, message: 'Could not load' });
    }
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

  onMapSelect({ target }: { target?: SVGElement }): void {
    const event: ChartSelectEvent = {
      selected: false,
      value: null,
      country: null
    };

    let newItem: SVGElement;
    if (target.id === oceanId) {
      this.selectCountry(null);

    } else {
      newItem = target;
      while (!newItem.classList.contains(countryClass)) {
        newItem = newItem.parentNode as SVGElement;
      }
    }

    const country = this.mapData[newItem?.id];
    if (country) {
      event.selected = true;
      event.value = parseInt(country.value.toString());
      event.country = newItem.id.toUpperCase();
      this.selectCountry(event.country);
    } else {
      this.selectCountry(null);
    }
    this.chartSelect.emit(event);
  }

}
