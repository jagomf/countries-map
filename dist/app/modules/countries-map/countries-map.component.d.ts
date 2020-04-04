import { ElementRef, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { GoogleChartsLoaderService } from './google-charts-loader.service';
import { ChartSelectEvent, ChartErrorEvent } from './chart-events.interface';
import { CountriesData, Selection, ValidCountryData } from './data-types.interface';
export declare class CountriesMapComponent implements OnChanges {
    private el;
    private loaderService;
    data: CountriesData;
    apiKey: string;
    options: any;
    countryLabel: string;
    valueLabel: string;
    showCaption: boolean;
    captionBelow: boolean;
    minValue: number;
    maxValue: number;
    minColor: string;
    maxColor: string;
    noDataColor: string;
    exceptionColor: string;
    chartReady: EventEmitter<void>;
    chartError: EventEmitter<ChartErrorEvent>;
    chartSelect: EventEmitter<ChartSelectEvent>;
    googleData: ValidCountryData[][];
    wrapper: any;
    selection: Selection | null;
    loading: boolean;
    get selectionValue(): ValidCountryData;
    constructor(el: ElementRef, loaderService: GoogleChartsLoaderService);
    private getExtraSelected;
    private selectCountry;
    /**
     * Convert a table (object) formatted as
     * `{ GB: { value:123, ...otherdata }, ES: { value:456, ...whatever } }`
     * to an array for Google Charts formatted as
     * `[ ['Country', 'Value'], ['GB', 123], ['ES', 456] ]`
     * and save to this.processedData
     */
    private processInputData;
    ngOnChanges(changes: SimpleChanges): void;
    redraw(): void;
    private onChartReady;
    private onCharterror;
    private onMapSelect;
    private registerChartWrapperEvents;
}
