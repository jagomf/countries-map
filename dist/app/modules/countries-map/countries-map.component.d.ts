import { ElementRef, OnChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { GoogleChartsLoaderService } from './google-charts-loader.service';
import { CountriesData, Selection, ValidCountryData } from './data-types.interface';
export declare class CountriesMapComponent implements OnChanges, OnDestroy {
    private readonly cdRef;
    private readonly el;
    private readonly loaderService;
    data: CountriesData;
    apiKey: string;
    options: any;
    countryLabel: string;
    valueLabel: string;
    showCaption: boolean;
    captionBelow: boolean;
    autoResize: boolean;
    minValue: number;
    maxValue: number;
    minColor: string;
    maxColor: string;
    backgroundColor: string;
    noDataColor: string;
    exceptionColor: string;
    private readonly chartReady;
    private readonly chartError;
    private readonly chartSelect;
    private readonly mapContent;
    private proportion;
    private googleData;
    private wrapper;
    selection: Selection | null;
    private innerLoading;
    get loading(): boolean;
    get selectionValue(): ValidCountryData;
    constructor(cdRef: ChangeDetectorRef, el: ElementRef, loaderService: GoogleChartsLoaderService);
    screenSizeChanged(): void;
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
    ngOnChanges({ data }: {
        data: any;
    }): void;
    redraw(): void;
    private onChartReady;
    private onCharterror;
    private onMapSelect;
    private registerChartWrapperEvents;
    ngOnDestroy(): void;
}
