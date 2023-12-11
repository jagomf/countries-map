import { ChangeDetectorRef, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import type { CountriesData, DrawableCountries, Selection, ValidExtraData } from './data-types.interface';
import * as i0 from "@angular/core";
export declare class CountriesMapComponent implements AfterViewInit, OnChanges {
    private readonly cdRef;
    data: CountriesData;
    countryLabel: string;
    valueLabel: string;
    showCaption: boolean;
    captionBelow: boolean;
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
    mapData: DrawableCountries;
    selection: Selection | null;
    private innerLoading;
    get loading(): boolean;
    get selectionValue(): ValidExtraData;
    constructor(cdRef: ChangeDetectorRef);
    private getExtraSelected;
    private selectCountry;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private initializeMap;
    private countryHover;
    private onChartReady;
    private onCharterror;
    onMapSelect({ target }: {
        target?: SVGElement;
    }): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CountriesMapComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CountriesMapComponent, "countries-map", never, { "data": { "alias": "data"; "required": true; }; "countryLabel": { "alias": "countryLabel"; "required": false; }; "valueLabel": { "alias": "valueLabel"; "required": false; }; "showCaption": { "alias": "showCaption"; "required": false; }; "captionBelow": { "alias": "captionBelow"; "required": false; }; "minValue": { "alias": "minValue"; "required": false; }; "maxValue": { "alias": "maxValue"; "required": false; }; "minColor": { "alias": "minColor"; "required": false; }; "maxColor": { "alias": "maxColor"; "required": false; }; "backgroundColor": { "alias": "backgroundColor"; "required": false; }; "noDataColor": { "alias": "noDataColor"; "required": false; }; "exceptionColor": { "alias": "exceptionColor"; "required": false; }; }, { "chartReady": "chartReady"; "chartError": "chartError"; "chartSelect": "chartSelect"; }, never, never, false, never>;
}
