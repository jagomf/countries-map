import { ElementRef, OnChanges, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { GoogleChartsLoaderService } from './google-charts-loader.service';
import type { CountriesData, Selection, ValidCountryData } from './data-types.interface';
import * as i0 from "@angular/core";
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
    private initializeMap;
    redraw(): void;
    private onChartReady;
    private onCharterror;
    private onMapSelect;
    private registerChartWrapperEvents;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CountriesMapComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CountriesMapComponent, "countries-map", never, { "data": { "alias": "data"; "required": true; }; "apiKey": { "alias": "apiKey"; "required": false; }; "options": { "alias": "options"; "required": false; }; "countryLabel": { "alias": "countryLabel"; "required": false; }; "valueLabel": { "alias": "valueLabel"; "required": false; }; "showCaption": { "alias": "showCaption"; "required": false; }; "captionBelow": { "alias": "captionBelow"; "required": false; }; "autoResize": { "alias": "autoResize"; "required": false; }; "minValue": { "alias": "minValue"; "required": false; }; "maxValue": { "alias": "maxValue"; "required": false; }; "minColor": { "alias": "minColor"; "required": false; }; "maxColor": { "alias": "maxColor"; "required": false; }; "backgroundColor": { "alias": "backgroundColor"; "required": false; }; "noDataColor": { "alias": "noDataColor"; "required": false; }; "exceptionColor": { "alias": "exceptionColor"; "required": false; }; }, { "chartReady": "chartReady"; "chartError": "chartError"; "chartSelect": "chartSelect"; }, never, never, false, never>;
}
