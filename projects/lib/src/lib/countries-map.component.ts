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
  SimpleChanges
} from '@angular/core';
import { CharErrorCode } from './chart-events.interface';
import type { ChartSelectEvent, ChartErrorEvent } from './chart-events.interface';
import type { CountriesData, SelectionExtra, DrawableCountries, Selection,
  ValidExtraData, DrawableCountry, CountryData } from './data-types.interface';
import { en as countriesEN } from '@jagomf/countrieslist';
import { scale } from 'chroma-js';

const exists = item => typeof item !== 'undefined' && item !== null;
const countryNum = (item: CountryData) => parseInt(item.value?.toString());

const countryClass = 'countryxx';
const oceanId = 'ocean';
const getStrokeWidth = (isHovered: boolean) => isHovered ? '0.2%' : '0.1%';
const getStrokeColor = (isHovered: boolean) => isHovered ? '#888' : '#afafaf';

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
  @Input() minValue: number;
  @Input() maxValue: number;
  @Input() minColor = 'white';
  @Input() maxColor = 'red';
  @Input() backgroundColor = 'white';
  @Input() noDataColor = '#CFCFCF';
  @Input() exceptionColor = '#FFEE58';

  @Output() private readonly chartReady = new EventEmitter<void>();
  @Output() private readonly chartError = new EventEmitter<ChartErrorEvent>();
  @Output() private readonly chartSelect = new EventEmitter<ChartSelectEvent>();

  @ViewChild('mapContent', { static: false, read: ElementRef }) private readonly mapContent: ElementRef<HTMLElement>;

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
      // data is provided: might be able to paint countries in colors
      if (this.data) {
        // get highest value in range
        const maxVal = exists(this.maxValue) ? this.maxValue : Object.values(this.data).reduce(
          (acc, curr) => countryNum(curr) > acc || acc === null? countryNum(curr) : acc, null as number
        );
        // get lowest value in range
        const minVal = exists(this.minValue) ? this.minValue : Object.values(this.data).reduce(
          (acc, curr) => countryNum(curr) < acc || acc === null? countryNum(curr) : acc, null as number
        );

        // map values in range to colors
        const valToCol = scale([this.minColor, this.maxColor]).colors((maxVal ?? 1) - (minVal ?? 0) + 1).reduce((acc, curr, i) =>
          ({ ...acc, [i + minVal]: curr }), {} as { [key: number]: string }
        );

        // create local Map using provided data + calculated colors
        this.mapData = Object.entries(this.data).reduce((acc, [ countryId, countryVal ]) =>
          ({ ...acc,
            [countryId.toLowerCase()]: {
              ...countryVal,
              color: valToCol[countryNum(countryVal)] // value in between minVal and maxVal
                || (
                  // value below minVal
                  countryNum(countryVal) <= minVal ? valToCol[minVal] :
                  // value above maxVal
                  countryNum(countryVal) >= maxVal ? valToCol[maxVal]
                  // weird; should never get to here
                    : this.exceptionColor
                )
            } as DrawableCountry }),
          {} as DrawableCountries
        );

      // no data provided: will paint plain map
      } else {
        this.mapData = {};
      }

      const svgMap = this.mapContent.nativeElement.children[0] as SVGSVGElement;
      svgMap.style.backgroundColor = this.backgroundColor;
      svgMap.querySelectorAll<SVGSVGElement>(`.${countryClass}`).forEach(item => {
        const mapItem = this.mapData[item.id.toLowerCase()];
        const isException = mapItem ? !exists(mapItem.value) : false;
        item.style.fill = mapItem ? isException ? this.exceptionColor : mapItem.color : this.noDataColor;
        item.onmouseenter = this.countryHover.bind(this, item, true);
        item.onmouseleave = this.countryHover.bind(this, item, false);
      });

      this.innerLoading = false;
      this.cdRef.detectChanges();
      this.onChartReady();

    } catch (e) {
      this.onCharterror({ id: CharErrorCode.loading, message: 'Could not load' });
    }
  }

  private countryHover(item: SVGElement, hovered: boolean): void {
    item.style.strokeWidth = getStrokeWidth(hovered);
    item.style.stroke = getStrokeColor(hovered);
    item.querySelectorAll<SVGElement>('.landxx').forEach(i => {
      i.style.strokeWidth = getStrokeWidth(hovered);
      i.style.stroke = getStrokeColor(hovered);
    });
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
      event.value = countryNum(country);
      event.country = newItem.id.toUpperCase();
      this.selectCountry(event.country);
    } else {
      this.selectCountry(null);
    }
    this.chartSelect.emit(event);
  }

}
