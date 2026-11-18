import {
  Component,
  ElementRef,
  Injector,
  Input,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  afterNextRender,
  inject,
  output,
  signal,
  viewChild
} from '@angular/core';
import { CountriesMapBaseComponent } from './base-map.component';
import { CharErrorCode } from './chart-events.interface';
import type { ChartSelectEvent, ChartErrorEvent } from './chart-events.interface';
import type { CountriesData, SelectionExtra, DrawableCountries, Selection,
  ValidExtraData, DrawableCountry, CountryData } from './data-types.interface';
import { en as countriesEN } from '@jagomf/countrieslist';

const exists = <T>(item: T | null | undefined): item is T => typeof item !== 'undefined' && item !== null;
const countryNum = (item: CountryData) => parseInt(String(item.value));

// A single step yields the midpoint between both colors.
const colorScale = (from: string, to: string, steps: number): string[] =>
  Array.from({ length: steps }, (_, i) =>
    `color-mix(in srgb, ${to} ${steps === 1 ? 50 : i / (steps - 1) * 100}%, ${from})`);

const countryClass = 'countryxx';
const oceanId = 'ocean';
const getStrokeWidth = (isHovered: boolean) => isHovered ? '0.2%' : '0.1%';
const getStrokeColor = (isHovered: boolean) => isHovered ? '#888' : '#afafaf';

const countryName = (countryCode: string): string => {
  return (countriesEN as Record<string, string>)[countryCode];
};

@Component({
  selector: 'countries-map',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './countries-map.component.html',
  styleUrls: ['./countries-map.component.scss'],
  imports: [CountriesMapBaseComponent]
})
export class CountriesMapComponent implements AfterViewInit, OnChanges {

  // Inputs read by the template are backed by signals, so the view updates without zone.js;
  // the accessors keep the same public members as 4.x (signal inputs would change their types)
  protected readonly dataSignal = signal<CountriesData | undefined>(undefined);
  @Input({ required: true }) set data(value: CountriesData) { this.dataSignal.set(value); }
  get data(): CountriesData { return this.dataSignal() as CountriesData; }

  protected readonly countryLabelSignal = signal('Country');
  @Input() set countryLabel(value: string) { this.countryLabelSignal.set(value); }
  get countryLabel(): string { return this.countryLabelSignal(); }

  protected readonly valueLabelSignal = signal('Value');
  @Input() set valueLabel(value: string) { this.valueLabelSignal.set(value); }
  get valueLabel(): string { return this.valueLabelSignal(); }

  protected readonly showCaptionSignal = signal(true);
  @Input() set showCaption(value: boolean) { this.showCaptionSignal.set(value); }
  get showCaption(): boolean { return this.showCaptionSignal(); }

  protected readonly captionBelowSignal = signal(true);
  @Input() set captionBelow(value: boolean) { this.captionBelowSignal.set(value); }
  get captionBelow(): boolean { return this.captionBelowSignal(); }

  // Inputs only used to paint the SVG, which happens imperatively in the lifecycle hooks
  @Input() minValue!: number;
  @Input() maxValue!: number;
  @Input() minColor = 'white';
  @Input() maxColor = 'red';
  @Input() backgroundColor = 'white';
  @Input() noDataColor = '#CFCFCF';
  @Input() exceptionColor = '#FFEE58';

  protected readonly chartReady = output<void>();
  protected readonly chartError = output<ChartErrorEvent>();
  protected readonly chartSelect = output<ChartSelectEvent>();

  private readonly mapContent = viewChild.required('mapContent', { read: ElementRef<HTMLElement> });
  private readonly injector = inject(Injector);

  mapData: DrawableCountries = {};

  protected readonly selectionSignal = signal<Selection | null>(null);
  get selection(): Selection | null { return this.selectionSignal(); }
  set selection(value: Selection | null) { this.selectionSignal.set(value); }

  protected readonly loadingSignal = signal(true);
  get loading(): boolean {
    return this.loadingSignal();
  }

  get selectionValue(): ValidExtraData {
    const selection = this.selectionSignal();
    // Keeps the 4.x public signature; the value can actually be null or undefined
    return (selection && this.dataSignal()?.[selection.countryId]?.value) as ValidExtraData;
  }

  private readyScheduled = false;

  private getExtraSelected(country: string): SelectionExtra[] | undefined {
    const { extra } = this.data[country];
    return extra ? Object.keys(extra).map(key => ({ key, val: extra[key] })) : undefined;
  }

  private selectCountry(country: string | null): void {
    this.selection = country ? {
      countryId: country,
      countryName: countryName(country),
      extra: this.getExtraSelected(country)
    } : null;
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
        const maxVal = (exists(this.maxValue) ? this.maxValue : Object.values(this.data).reduce<number | null>(
          (acc, curr) => acc === null || countryNum(curr) > acc ? countryNum(curr) : acc, null
        )) ?? 1;
        // get lowest value in range
        const minVal = (exists(this.minValue) ? this.minValue : Object.values(this.data).reduce<number | null>(
          (acc, curr) => acc === null || countryNum(curr) < acc ? countryNum(curr) : acc, null
        )) ?? 0;

        // map values in range to colors
        const valToCol = colorScale(this.minColor, this.maxColor, maxVal - minVal + 1).reduce((acc, curr, i) =>
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

      const svgMap = this.mapContent().nativeElement.children[0] as SVGSVGElement;
      svgMap.style.backgroundColor = this.backgroundColor;
      svgMap.querySelectorAll<SVGSVGElement>(`.${countryClass}`).forEach(item => {
        const mapItem = this.mapData[item.id.toLowerCase()];
        const isException = mapItem ? !exists(mapItem.value) : false;
        item.style.fill = mapItem ? isException ? this.exceptionColor : mapItem.color : this.noDataColor;
        item.onmouseenter = this.countryHover.bind(this, item, true);
        item.onmouseleave = this.countryHover.bind(this, item, false);
      });

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
    if (this.loadingSignal() && !this.readyScheduled) {
      this.readyScheduled = true;
      // Wait until the current render finishes, so that listeners can update their own views
      // without an ExpressionChangedAfterItHasBeenCheckedError
      afterNextRender(() => {
        this.loadingSignal.set(false);
        this.chartReady.emit();
      }, { injector: this.injector });
    }
  }

  private onCharterror(error: ChartErrorEvent): void {
    this.chartError.emit(error);
  }

  onMapSelect(ev: MouseEvent): void {
    // ChartSelectEvent keeps its 4.x typing, but value, extra and country are null when nothing gets selected
    const event = {
      selected: false,
      value: null,
      extra: null,
      country: null
    } as unknown as ChartSelectEvent;

    let newItem: SVGElement | undefined;
    if ((ev.target as SVGElement)?.id === oceanId) {
      this.selectCountry(null);

    } else {
      newItem = ev.target as SVGElement;
      while (!newItem.classList.contains(countryClass)) {
        newItem = newItem.parentNode as SVGElement;
      }
    }

    const country = newItem && this.mapData[newItem.id];
    if (newItem && country) {
      event.selected = true;
      event.value = countryNum(country);
      event.country = newItem.id.toUpperCase();
      event.extra = country.extra;
      this.selectCountry(event.country);
    } else {
      this.selectCountry(null);
    }
    this.chartSelect.emit(event);
  }

}
