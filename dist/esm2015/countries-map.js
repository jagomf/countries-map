import { Injectable, EventEmitter, LOCALE_ID, Inject, Component, ElementRef, Input, Output, NgModule } from '@angular/core';
import { en } from '@jagomf/countrieslist';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class GoogleChartsLoaderService {
    /**
     * @param {?} localeId
     */
    constructor(localeId) {
        this.googleScriptLoadingNotifier = new EventEmitter();
        this.googleScriptIsLoading = false;
        this.localeId = localeId;
    }
    /**
     * @param {?=} apiKey
     * @return {?}
     */
    load(apiKey) {
        return new Promise((resolve, reject) => {
            this.loadGoogleChartsScript().then(() => {
                const /** @type {?} */ initializer = {
                    packages: ['geochart'],
                    language: this.localeId,
                    callback: resolve
                };
                if (apiKey) {
                    initializer.mapsApiKey = apiKey;
                }
                google.charts.load('45.2', initializer);
            }).catch(err => reject());
        });
    }
    /**
     * @return {?}
     */
    loadGoogleChartsScript() {
        return new Promise((resolve, reject) => {
            if (typeof google !== 'undefined' && google.charts) {
                resolve();
            }
            else if (!this.googleScriptIsLoading) {
                this.googleScriptIsLoading = true;
                const /** @type {?} */ script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://www.gstatic.com/charts/loader.js';
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    this.googleScriptIsLoading = false;
                    this.googleScriptLoadingNotifier.emit(true);
                    resolve();
                };
                script.onerror = () => {
                    this.googleScriptIsLoading = false;
                    this.googleScriptLoadingNotifier.emit(false);
                    reject();
                };
                document.getElementsByTagName('head')[0].appendChild(script);
            }
            else {
                this.googleScriptLoadingNotifier.subscribe((loaded) => {
                    if (loaded) {
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
            }
        });
    }
}
GoogleChartsLoaderService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
GoogleChartsLoaderService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [LOCALE_ID,] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
const valueHolder = 'value';
const countryName = (countryCode) => {
    return en[countryCode];
};
class CountriesMapComponent {
    /**
     * @param {?} el
     * @param {?} loaderService
     */
    constructor(el, loaderService) {
        this.el = el;
        this.loaderService = loaderService;
        this.countryLabel = 'Country';
        this.valueLabel = 'Value';
        this.showCaption = true;
        this.captionBelow = true;
        this.minValue = 0;
        this.minColor = 'white';
        this.maxColor = 'red';
        this.noDataColor = '#CFCFCF';
        this.exceptionColor = '#FFEE58';
        this.selection = null;
        this.loading = true;
        this.el = el;
        this.loaderService = loaderService;
        this.chartSelect = new EventEmitter();
        this.chartReady = new EventEmitter();
        this.chartError = new EventEmitter();
    }
    /**
     * @return {?}
     */
    get selectionValue() {
        return this.data[this.selection.countryId].value;
    }
    /**
     * @param {?} country
     * @return {?}
     */
    getExtraSelected(country) {
        const { extra } = this.data[country];
        return extra && Object.keys(extra).map(key => ({ key, val: extra[key] }));
    }
    /**
     * @param {?=} country
     * @return {?}
     */
    selectCountry(country) {
        this.selection = country ? {
            countryId: country,
            countryName: countryName(country),
            extra: this.getExtraSelected(country)
        } : null;
    }
    /**
     * Pasar de una tabla en forma
     * { GB: { value:123, ...otherdata }, ES: { value:456, ...whatever } }
     * a un array para Google Charts en forma
     * [ ['Country', 'Value'], ['GB', 123], ['ES', 456] ]
     * y almacernarlo en this.processedData
     * @return {?}
     */
    processInputData() {
        this.googleData = Object.keys(this.data).reduce((acc, currKey) => {
            const /** @type {?} */ currVal = this.data[currKey][valueHolder];
            acc.push([currKey, /** @type {?} */ (currVal)]);
            return acc;
        }, [['Country', 'Value']]);
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        const /** @type {?} */ key = 'data';
        if (changes[key]) {
            if (!this.data) {
                return;
            }
            const /** @type {?} */ defaultOptions = {
                colorAxis: {
                    colors: [this.minColor, this.maxColor],
                    minValue: Number.isInteger(this.minValue) ? this.minValue : undefined,
                    maxValue: Number.isInteger(this.maxValue) ? this.maxValue : undefined
                },
                datalessRegionColor: this.noDataColor,
                defaultColor: this.exceptionColor,
                legend: this.showCaption,
                tooltip: { trigger: 'none' }
            };
            this.loaderService.load(this.apiKey).then(() => {
                this.processInputData();
                this.wrapper = new google.visualization.ChartWrapper({
                    chartType: 'GeoChart',
                    dataTable: this.googleData,
                    options: Object.assign(defaultOptions, this.options)
                });
                this.registerChartWrapperEvents();
                this.redraw();
            });
        }
    }
    /**
     * @return {?}
     */
    redraw() {
        this.wrapper.draw(this.el.nativeElement.querySelector('div.cm-map-content'));
    }
    /**
     * @return {?}
     */
    onChartReady() {
        this.loading = false;
        this.chartReady.emit();
    }
    /**
     * @param {?} error
     * @return {?}
     */
    onCharterror(error) {
        this.chartError.emit(/** @type {?} */ (error));
    }
    /**
     * @return {?}
     */
    onMapSelect() {
        const /** @type {?} */ event = {
            selected: false,
            value: null,
            country: null
        };
        const /** @type {?} */ selection = this.wrapper.visualization.getSelection();
        if (selection.length > 0) {
            const { row: tableRow } = selection[0];
            const /** @type {?} */ dataTable = this.wrapper.getDataTable();
            event.selected = true;
            event.value = dataTable.getValue(tableRow, 1);
            event.country = dataTable.getValue(tableRow, 0);
            this.selectCountry(event.country);
        }
        else {
            this.selectCountry(null);
        }
        this.chartSelect.emit(event);
    }
    /**
     * @return {?}
     */
    registerChartWrapperEvents() {
        const { addListener } = google.visualization.events;
        addListener(this.wrapper, 'ready', this.onChartReady.bind(this));
        addListener(this.wrapper, 'error', this.onCharterror.bind(this));
        addListener(this.wrapper, 'select', this.onMapSelect.bind(this));
    }
}
CountriesMapComponent.decorators = [
    { type: Component, args: [{
                selector: 'countries-map',
                template: `<div class="major-block loading" *ngIf="loading"><span class="text">Loading map...</span></div>
<div class="major-block cm-map-content" [ngClass]="{'goes-first': captionBelow}"></div>
<div class="major-block cm-caption-container" [ngClass]="{'goes-first': !captionBelow}"
  *ngIf="!loading && showCaption">
  <div class="cm-simple-caption">
    <div class="cm-country-label">
      <span class="cm-default-label" *ngIf="!selection">{{countryLabel}}</span>
      <span class="cm-country-name" *ngIf="selection">{{selection?.countryName}}</span>
    </div>
    <div class="cm-value-label">
      <span class="cm-value-text"
        [ngClass]="{'has-value': selection}">{{valueLabel}}<span *ngIf="selection">: </span></span>
      <span class="cm-value-content" *ngIf="selection">{{selectionValue}}</span>
    </div>
  </div>
  <div class="cm-extended-caption" *ngIf="selection?.extra && selection?.extra.length > 0">
    <div *ngFor="let item of selection?.extra" class="cm-extended-item">
      <span class="cm-extended-label">{{item.key}}</span>:
      <span class="cm-extended-value">{{item.val}}</span>
    </div>
  </div>
</div>
`,
                styles: [`:host{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-flow:column nowrap;flex-flow:column nowrap;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;-ms-flex-line-pack:stretch;align-content:stretch}.major-block.loading{-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto;-ms-flex-item-align:center;align-self:center}.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto}.major-block.goes-first{-webkit-box-ordinal-group:1;-ms-flex-order:0;order:0}.major-block:not(.goes-first){-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}.major-block.cm-caption-container{-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-flow:column nowrap;flex-flow:column nowrap;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.cm-simple-caption{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.cm-country-label{-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto;-ms-flex-item-align:start;align-self:flex-start}.cm-value-label{-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto;-ms-flex-item-align:end;align-self:flex-end}.cm-country-label,.cm-value-label{-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}`]
            },] },
];
/** @nocollapse */
CountriesMapComponent.ctorParameters = () => [
    { type: ElementRef, },
    { type: GoogleChartsLoaderService, },
];
CountriesMapComponent.propDecorators = {
    "data": [{ type: Input },],
    "apiKey": [{ type: Input },],
    "options": [{ type: Input },],
    "countryLabel": [{ type: Input },],
    "valueLabel": [{ type: Input },],
    "showCaption": [{ type: Input },],
    "captionBelow": [{ type: Input },],
    "minValue": [{ type: Input },],
    "maxValue": [{ type: Input },],
    "minColor": [{ type: Input },],
    "maxColor": [{ type: Input },],
    "noDataColor": [{ type: Input },],
    "exceptionColor": [{ type: Input },],
    "chartReady": [{ type: Output },],
    "chartError": [{ type: Output },],
    "chartSelect": [{ type: Output },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class CountriesMapModule {
}
CountriesMapModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [CountriesMapComponent],
                entryComponents: [CountriesMapComponent],
                providers: [GoogleChartsLoaderService],
                exports: [
                    CountriesMapComponent
                ]
            },] },
];
/** @nocollapse */
CountriesMapModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { CountriesMapModule, CountriesMapComponent as ɵa, GoogleChartsLoaderService as ɵb };
//# sourceMappingURL=countries-map.js.map
