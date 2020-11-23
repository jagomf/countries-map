import { EventEmitter, Injectable, Inject, LOCALE_ID, Component, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Input, Output, ViewChild, HostListener, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { __awaiter } from 'tslib';
import { en } from '@jagomf/countrieslist';

const chartsVersion = '45.2';
const chartsScript = 'https://www.gstatic.com/charts/loader.js';
class GoogleChartsLoaderService {
    constructor(localeId) {
        this.localeId = localeId;
        this.googleScriptLoadingNotifier = new EventEmitter();
        this.googleScriptIsLoading = false;
    }
    load(apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadGoogleChartsScript();
            const initializer = {
                packages: ['geochart'],
                language: this.localeId
            };
            if (apiKey) {
                return google.charts.load(chartsVersion, initializer, apiKey);
            }
            else {
                return google.charts.load(chartsVersion, initializer);
            }
        });
    }
    loadGoogleChartsScript() {
        return new Promise((resolve, reject) => {
            if (typeof google !== 'undefined' && google.charts) {
                resolve();
            }
            else if (!this.googleScriptIsLoading) {
                this.googleScriptIsLoading = true;
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = chartsScript;
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
    { type: Injectable }
];
GoogleChartsLoaderService.ctorParameters = () => [
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] }
];

var CharErrorCode;
(function (CharErrorCode) {
    CharErrorCode["loading"] = "loading";
})(CharErrorCode || (CharErrorCode = {}));

const valueHolder = 'value';
const countryName = (countryCode) => {
    return en[countryCode];
};
const ɵ0 = countryName;
class CountriesMapComponent {
    constructor(cdRef, el, loaderService) {
        this.cdRef = cdRef;
        this.el = el;
        this.loaderService = loaderService;
        this.countryLabel = 'Country';
        this.valueLabel = 'Value';
        this.showCaption = true;
        this.captionBelow = true;
        this.autoResize = false;
        this.minValue = 0;
        this.minColor = 'white';
        this.maxColor = 'red';
        this.backgroundColor = 'white';
        this.noDataColor = '#CFCFCF';
        this.exceptionColor = '#FFEE58';
        this.chartReady = new EventEmitter();
        this.chartError = new EventEmitter();
        this.chartSelect = new EventEmitter();
        this.selection = null;
        this.innerLoading = true;
    }
    get loading() {
        return this.innerLoading;
    }
    get selectionValue() {
        return this.data[this.selection.countryId].value;
    }
    screenSizeChanged() {
        if (!this.loading && this.autoResize) {
            const map = this.mapContent.nativeElement;
            map.style.setProperty('height', `${map.clientWidth * this.proportion}px`);
            this.redraw();
        }
    }
    getExtraSelected(country) {
        const { extra } = this.data[country];
        return extra && Object.keys(extra).map(key => ({ key, val: extra[key] }));
    }
    selectCountry(country) {
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
    processInputData() {
        this.googleData = Object.entries(this.data).reduce((acc, [key, val]) => {
            const rawValContent = val[valueHolder];
            acc.push([key, rawValContent === null ? null : rawValContent ? +rawValContent.toString() : 0]);
            return acc;
        }, [['Country', 'Value']]);
    }
    ngOnChanges({ data }) {
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
    initializeMap(defaultOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.loaderService.load(this.apiKey);
                this.processInputData();
                this.wrapper = new google.visualization.ChartWrapper({
                    chartType: 'GeoChart',
                    dataTable: this.googleData,
                    options: Object.assign(defaultOptions, this.options)
                });
                this.registerChartWrapperEvents();
                this.redraw();
                const self = this.el.nativeElement;
                this.proportion = self.clientHeight / self.clientWidth;
            }
            catch (e) {
                this.onCharterror({ id: CharErrorCode.loading, message: 'Could not load' });
            }
        });
    }
    redraw() {
        this.wrapper.draw(this.el.nativeElement.querySelector('div.cm-map-content'));
    }
    onChartReady() {
        if (this.innerLoading) {
            this.innerLoading = false;
            this.chartReady.emit();
        }
    }
    onCharterror(error) {
        this.chartError.emit(error);
    }
    onMapSelect() {
        const event = {
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
        }
        else {
            this.selectCountry(null);
        }
        this.chartSelect.emit(event);
    }
    registerChartWrapperEvents() {
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
CountriesMapComponent.decorators = [
    { type: Component, args: [{
                selector: 'countries-map',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: "<div class=\"major-block loading\" *ngIf=\"loading\"><span class=\"text\">Loading map...</span></div>\r\n\r\n<div class=\"major-block cm-map-content\" #mapContent [ngClass]=\"{'goes-first': captionBelow}\"></div>\r\n\r\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\"\r\n  *ngIf=\"!loading && showCaption\">\r\n  <div class=\"cm-simple-caption\">\r\n    <div class=\"cm-country-label\">\r\n      <span class=\"cm-default-label\" *ngIf=\"!selection\">{{countryLabel}}</span>\r\n      <span class=\"cm-country-name\" *ngIf=\"selection\">{{selection?.countryName}}</span>\r\n    </div>\r\n    <div class=\"cm-value-label\">\r\n      <span class=\"cm-value-text\"\r\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}<span *ngIf=\"selection\">: </span></span>\r\n      <span class=\"cm-value-content\" *ngIf=\"selection\">{{selectionValue}}</span>\r\n    </div>\r\n  </div>\r\n  <div class=\"cm-extended-caption\" *ngIf=\"selection?.extra && selection?.extra.length > 0\">\r\n    <div *ngFor=\"let item of selection?.extra\" class=\"cm-extended-item\">\r\n      <span class=\"cm-extended-label\">{{item.key}}</span>:\r\n      <span class=\"cm-extended-value\">{{item.val}}</span>\r\n    </div>\r\n  </div>\r\n</div>\r\n",
                styles: [":host{align-content:stretch;align-items:stretch;display:flex;flex-flow:column nowrap;justify-content:space-between}.major-block.loading{align-self:center;flex:0 1 auto}.loading .text{color:grey;font-family:sans-serif;font-style:italic}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{display:flex;flex:0 1 auto;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{align-self:flex-start;flex:0 1 auto}.cm-value-label{align-self:flex-end;flex:0 1 auto}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){color:#777;font-style:italic}.cm-extended-caption{display:grid;grid-gap:5px;grid-template-columns:repeat(auto-fill,minmax(120px,1fr))}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}"]
            },] }
];
CountriesMapComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: GoogleChartsLoaderService }
];
CountriesMapComponent.propDecorators = {
    data: [{ type: Input }],
    apiKey: [{ type: Input }],
    options: [{ type: Input }],
    countryLabel: [{ type: Input }],
    valueLabel: [{ type: Input }],
    showCaption: [{ type: Input }],
    captionBelow: [{ type: Input }],
    autoResize: [{ type: Input }],
    minValue: [{ type: Input }],
    maxValue: [{ type: Input }],
    minColor: [{ type: Input }],
    maxColor: [{ type: Input }],
    backgroundColor: [{ type: Input }],
    noDataColor: [{ type: Input }],
    exceptionColor: [{ type: Input }],
    chartReady: [{ type: Output }],
    chartError: [{ type: Output }],
    chartSelect: [{ type: Output }],
    mapContent: [{ type: ViewChild, args: ['mapContent', { static: false },] }],
    screenSizeChanged: [{ type: HostListener, args: ['window:deviceorientation',] }, { type: HostListener, args: ['window:resize',] }]
};

class CountriesMapModule {
}
CountriesMapModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [CountriesMapComponent],
                providers: [GoogleChartsLoaderService],
                exports: [
                    CountriesMapComponent
                ]
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { CharErrorCode, CountriesMapComponent, CountriesMapModule, GoogleChartsLoaderService as ɵa };
//# sourceMappingURL=countries-map.js.map
