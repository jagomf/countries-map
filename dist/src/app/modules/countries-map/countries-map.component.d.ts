import { ElementRef, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { GoogleChartsLoaderService } from './google-charts-loader.service';
import { ChartSelectEvent, ChartErrorEvent, CountriesData, Selection } from './interfaces';
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
    googleData: string[][];
    wrapper: any;
    selection: Selection | null;
    loading: boolean;
    readonly selectionValue: string | number;
    constructor(el: ElementRef, loaderService: GoogleChartsLoaderService);
    private getExtraSelected(country);
    private selectCountry(country?);
    /**
     * Pasar de una tabla en forma
     * { GB: { value:123, ...otherdata }, ES: { value:456, ...whatever } }
     * a un array para Google Charts en forma
     * [ ['Country', 'Value'], ['GB', 123], ['ES', 456] ]
     * y almacernarlo en this.processedData
     */
    private processInputData();
    ngOnChanges(changes: SimpleChanges): void;
    redraw(): void;
    private onChartReady();
    private onCharterror(error);
    private onMapSelect();
    private registerChartWrapperEvents();
}
