import { Injectable, EventEmitter, LOCALE_ID, Inject, Component, ElementRef, Input, Output, NgModule } from '@angular/core';
import { en } from '@jagomf/countrieslist';
import { CommonModule } from '@angular/common';

var GoogleChartsLoaderService = /** @class */ (function () {
    function GoogleChartsLoaderService(localeId) {
        this.googleScriptLoadingNotifier = new EventEmitter();
        this.googleScriptIsLoading = false;
        this.localeId = localeId;
    }
    GoogleChartsLoaderService.prototype.load = function (apiKey) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.loadGoogleChartsScript().then(function () {
                var initializer = {
                    packages: ['geochart'],
                    language: _this.localeId,
                    callback: resolve
                };
                if (apiKey) {
                    initializer.mapsApiKey = apiKey;
                }
                google.charts.load('45.2', initializer);
            }).catch(function (err) { return reject(); });
        });
    };
    GoogleChartsLoaderService.prototype.loadGoogleChartsScript = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof google !== 'undefined' && google.charts) {
                resolve();
            }
            else if (!_this.googleScriptIsLoading) {
                _this.googleScriptIsLoading = true;
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://www.gstatic.com/charts/loader.js';
                script.async = true;
                script.defer = true;
                script.onload = function () {
                    _this.googleScriptIsLoading = false;
                    _this.googleScriptLoadingNotifier.emit(true);
                    resolve();
                };
                script.onerror = function () {
                    _this.googleScriptIsLoading = false;
                    _this.googleScriptLoadingNotifier.emit(false);
                    reject();
                };
                document.getElementsByTagName('head')[0].appendChild(script);
            }
            else {
                _this.googleScriptLoadingNotifier.subscribe(function (loaded) {
                    if (loaded) {
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
            }
        });
    };
    return GoogleChartsLoaderService;
}());
GoogleChartsLoaderService.decorators = [
    { type: Injectable },
];
GoogleChartsLoaderService.ctorParameters = function () { return [
    { type: undefined, decorators: [{ type: Inject, args: [LOCALE_ID,] },] },
]; };
var valueHolder = 'value';
var countryName = function (countryCode) {
    return en[countryCode];
};
var CountriesMapComponent = /** @class */ (function () {
    function CountriesMapComponent(el, loaderService) {
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
    Object.defineProperty(CountriesMapComponent.prototype, "selectionValue", {
        get: function () {
            return this.data[this.selection.countryId].value;
        },
        enumerable: true,
        configurable: true
    });
    CountriesMapComponent.prototype.getExtraSelected = function (country) {
        var extra = this.data[country].extra;
        return extra && Object.keys(extra).map(function (key) { return ({ key: key, val: extra[key] }); });
    };
    CountriesMapComponent.prototype.selectCountry = function (country) {
        this.selection = country ? {
            countryId: country,
            countryName: countryName(country),
            extra: this.getExtraSelected(country)
        } : null;
    };
    CountriesMapComponent.prototype.processInputData = function () {
        var _this = this;
        this.googleData = Object.keys(this.data).reduce(function (acc, currKey) {
            var currVal = _this.data[currKey][valueHolder];
            acc.push([currKey, (currVal)]);
            return acc;
        }, [['Country', 'Value']]);
    };
    CountriesMapComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        var key = 'data';
        if (changes[key]) {
            if (!this.data) {
                return;
            }
            var defaultOptions_1 = {
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
            this.loaderService.load(this.apiKey).then(function () {
                _this.processInputData();
                _this.wrapper = new google.visualization.ChartWrapper({
                    chartType: 'GeoChart',
                    dataTable: _this.googleData,
                    options: Object.assign(defaultOptions_1, _this.options)
                });
                _this.registerChartWrapperEvents();
                _this.redraw();
            });
        }
    };
    CountriesMapComponent.prototype.redraw = function () {
        this.wrapper.draw(this.el.nativeElement.querySelector('div.cm-map-content'));
    };
    CountriesMapComponent.prototype.onChartReady = function () {
        this.loading = false;
        this.chartReady.emit();
    };
    CountriesMapComponent.prototype.onCharterror = function (error) {
        this.chartError.emit((error));
    };
    CountriesMapComponent.prototype.onMapSelect = function () {
        var event = {
            selected: false,
            value: null,
            country: null
        };
        var selection = this.wrapper.visualization.getSelection();
        if (selection.length > 0) {
            var tableRow = selection[0].row;
            var dataTable = this.wrapper.getDataTable();
            event.selected = true;
            event.value = dataTable.getValue(tableRow, 1);
            event.country = dataTable.getValue(tableRow, 0);
            this.selectCountry(event.country);
        }
        else {
            this.selectCountry(null);
        }
        this.chartSelect.emit(event);
    };
    CountriesMapComponent.prototype.registerChartWrapperEvents = function () {
        var addListener = google.visualization.events.addListener;
        addListener(this.wrapper, 'ready', this.onChartReady.bind(this));
        addListener(this.wrapper, 'error', this.onCharterror.bind(this));
        addListener(this.wrapper, 'select', this.onMapSelect.bind(this));
    };
    return CountriesMapComponent;
}());
CountriesMapComponent.decorators = [
    { type: Component, args: [{
                selector: 'countries-map',
                template: "<div class=\"major-block loading\" *ngIf=\"loading\"><span class=\"text\">Loading map...</span></div>\n<div class=\"major-block cm-map-content\" [ngClass]=\"{'goes-first': captionBelow}\"></div>\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\"\n  *ngIf=\"!loading && showCaption\">\n  <div class=\"cm-simple-caption\">\n    <div class=\"cm-country-label\">\n      <span class=\"cm-default-label\" *ngIf=\"!selection\">{{countryLabel}}</span>\n      <span class=\"cm-country-name\" *ngIf=\"selection\">{{selection?.countryName}}</span>\n    </div>\n    <div class=\"cm-value-label\">\n      <span class=\"cm-value-text\"\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}<span *ngIf=\"selection\">: </span></span>\n      <span class=\"cm-value-content\" *ngIf=\"selection\">{{selectionValue}}</span>\n    </div>\n  </div>\n  <div class=\"cm-extended-caption\" *ngIf=\"selection?.extra && selection?.extra.length > 0\">\n    <div *ngFor=\"let item of selection?.extra\" class=\"cm-extended-item\">\n      <span class=\"cm-extended-label\">{{item.key}}</span>:\n      <span class=\"cm-extended-value\">{{item.val}}</span>\n    </div>\n  </div>\n</div>\n",
                styles: [":host{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-flow:column nowrap;flex-flow:column nowrap;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;-ms-flex-line-pack:stretch;align-content:stretch}.major-block.loading{-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto;-ms-flex-item-align:center;align-self:center}.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto}.major-block.goes-first{-webkit-box-ordinal-group:1;-ms-flex-order:0;order:0}.major-block:not(.goes-first){-webkit-box-ordinal-group:2;-ms-flex-order:1;order:1}.major-block.cm-caption-container{-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-flow:column nowrap;flex-flow:column nowrap;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.cm-simple-caption{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between}.cm-country-label{-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto;-ms-flex-item-align:start;align-self:flex-start}.cm-value-label{-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto;-ms-flex-item-align:end;align-self:flex-end}.cm-country-label,.cm-value-label{-webkit-box-flex:0;-ms-flex:0 1 auto;flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}"]
            },] },
];
CountriesMapComponent.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: GoogleChartsLoaderService, },
]; };
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
var CountriesMapModule = /** @class */ (function () {
    function CountriesMapModule() {
    }
    return CountriesMapModule;
}());
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
CountriesMapModule.ctorParameters = function () { return []; };

export { CountriesMapModule, CountriesMapComponent, GoogleChartsLoaderService as ɵa };
//# sourceMappingURL=countries-map.js.map
