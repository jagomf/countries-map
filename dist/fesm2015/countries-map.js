import { __decorate, __param, __metadata } from 'tslib';
import { EventEmitter, Injectable, Inject, LOCALE_ID, Input, Output, Component, ElementRef, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { en } from '@jagomf/countrieslist';

let GoogleChartsLoaderService = class GoogleChartsLoaderService {
    constructor(localeId) {
        this.googleScriptLoadingNotifier = new EventEmitter();
        this.googleScriptIsLoading = false;
        this.localeId = localeId;
    }
    load(apiKey) {
        return new Promise((resolve, reject) => {
            this.loadGoogleChartsScript().then(() => {
                const initializer = {
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
    loadGoogleChartsScript() {
        return new Promise((resolve, reject) => {
            if (typeof google !== 'undefined' && google.charts) {
                resolve();
            }
            else if (!this.googleScriptIsLoading) {
                this.googleScriptIsLoading = true;
                const script = document.createElement('script');
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
};
GoogleChartsLoaderService = __decorate([
    Injectable(),
    __param(0, Inject(LOCALE_ID)),
    __metadata("design:paramtypes", [String])
], GoogleChartsLoaderService);

const valueHolder = 'value';
const countryName = (countryCode) => {
    return en[countryCode];
};
const ɵ0 = countryName;
let CountriesMapComponent = class CountriesMapComponent {
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
    get selectionValue() {
        return this.data[this.selection.countryId].value;
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
    }
    /**
     * Pasar de una tabla en forma
     * { GB: { value:123, ...otherdata }, ES: { value:456, ...whatever } }
     * a un array para Google Charts en forma
     * [ ['Country', 'Value'], ['GB', 123], ['ES', 456] ]
     * y almacernarlo en this.processedData
     */
    processInputData() {
        this.googleData = Object.keys(this.data).reduce((acc, currKey) => {
            const currVal = this.data[currKey][valueHolder];
            acc.push([currKey, currVal]);
            return acc;
        }, [['Country', 'Value']]);
    }
    ngOnChanges(changes) {
        const key = 'data';
        if (changes[key]) {
            if (!this.data) {
                return;
            }
            const defaultOptions = {
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
    redraw() {
        this.wrapper.draw(this.el.nativeElement.querySelector('div.cm-map-content'));
    }
    onChartReady() {
        this.loading = false;
        this.chartReady.emit();
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
        const selection = this.wrapper.visualization.getSelection();
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
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], CountriesMapComponent.prototype, "data", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], CountriesMapComponent.prototype, "apiKey", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CountriesMapComponent.prototype, "options", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CountriesMapComponent.prototype, "countryLabel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CountriesMapComponent.prototype, "valueLabel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CountriesMapComponent.prototype, "showCaption", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CountriesMapComponent.prototype, "captionBelow", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CountriesMapComponent.prototype, "minValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CountriesMapComponent.prototype, "maxValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CountriesMapComponent.prototype, "minColor", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CountriesMapComponent.prototype, "maxColor", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CountriesMapComponent.prototype, "noDataColor", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CountriesMapComponent.prototype, "exceptionColor", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], CountriesMapComponent.prototype, "chartReady", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], CountriesMapComponent.prototype, "chartError", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], CountriesMapComponent.prototype, "chartSelect", void 0);
CountriesMapComponent = __decorate([
    Component({
        selector: 'countries-map',
        template: "<div class=\"major-block loading\" *ngIf=\"loading\"><span class=\"text\">Loading map...</span></div>\n\n<div class=\"major-block cm-map-content\" [ngClass]=\"{'goes-first': captionBelow}\"></div>\n\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\"\n  *ngIf=\"!loading && showCaption\">\n  <div class=\"cm-simple-caption\">\n    <div class=\"cm-country-label\">\n      <span class=\"cm-default-label\" *ngIf=\"!selection\">{{countryLabel}}</span>\n      <span class=\"cm-country-name\" *ngIf=\"selection\">{{selection?.countryName}}</span>\n    </div>\n    <div class=\"cm-value-label\">\n      <span class=\"cm-value-text\"\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}<span *ngIf=\"selection\">: </span></span>\n      <span class=\"cm-value-content\" *ngIf=\"selection\">{{selectionValue}}</span>\n    </div>\n  </div>\n  <div class=\"cm-extended-caption\" *ngIf=\"selection?.extra && selection?.extra.length > 0\">\n    <div *ngFor=\"let item of selection?.extra\" class=\"cm-extended-item\">\n      <span class=\"cm-extended-label\">{{item.key}}</span>:\n      <span class=\"cm-extended-value\">{{item.val}}</span>\n    </div>\n  </div>\n</div>\n",
        styles: [":host{display:flex;flex-flow:column nowrap;justify-content:space-between;align-items:stretch;align-content:stretch}.major-block.loading{flex:0 1 auto;-ms-grid-row-align:center;align-self:center}.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{flex:0 1 auto;display:flex;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{flex:0 1 auto;align-self:flex-start}.cm-value-label{flex:0 1 auto;align-self:flex-end}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:-ms-grid;display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}"]
    }),
    __metadata("design:paramtypes", [ElementRef,
        GoogleChartsLoaderService])
], CountriesMapComponent);

let CountriesMapModule = class CountriesMapModule {
};
CountriesMapModule = __decorate([
    NgModule({
        imports: [
            CommonModule
        ],
        declarations: [CountriesMapComponent],
        entryComponents: [CountriesMapComponent],
        providers: [GoogleChartsLoaderService],
        exports: [
            CountriesMapComponent
        ]
    })
], CountriesMapModule);

/**
 * Generated bundle index. Do not edit.
 */

export { CountriesMapComponent, CountriesMapModule, GoogleChartsLoaderService as ɵa };
//# sourceMappingURL=countries-map.js.map
