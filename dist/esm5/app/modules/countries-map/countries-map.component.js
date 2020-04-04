import { __decorate, __read } from "tslib";
import { Component, ElementRef, OnChanges, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { GoogleChartsLoaderService } from './google-charts-loader.service';
import { CharErrorCode } from './chart-events.interface';
import { en as countriesEN } from '@jagomf/countrieslist';
var valueHolder = 'value';
var countryName = function (countryCode) {
    return countriesEN[countryCode];
};
var ɵ0 = countryName;
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
    /**
     * Convert a table (object) formatted as
     * `{ GB: { value:123, ...otherdata }, ES: { value:456, ...whatever } }`
     * to an array for Google Charts formatted as
     * `[ ['Country', 'Value'], ['GB', 123], ['ES', 456] ]`
     * and save to this.processedData
     */
    CountriesMapComponent.prototype.processInputData = function () {
        this.googleData = Object.entries(this.data).reduce(function (acc, _a) {
            var _b = __read(_a, 2), key = _b[0], val = _b[1];
            var rawValContent = val[valueHolder];
            acc.push([key, rawValContent === null ? null : rawValContent ? +rawValContent.toString() : 0]);
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
            }, function () {
                _this.onCharterror({ id: CharErrorCode.loading, message: 'Could not load' });
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
        this.chartError.emit(error);
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
    CountriesMapComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: GoogleChartsLoaderService }
    ]; };
    __decorate([
        Input()
    ], CountriesMapComponent.prototype, "data", void 0);
    __decorate([
        Input()
    ], CountriesMapComponent.prototype, "apiKey", void 0);
    __decorate([
        Input()
    ], CountriesMapComponent.prototype, "options", void 0);
    __decorate([
        Input()
    ], CountriesMapComponent.prototype, "countryLabel", void 0);
    __decorate([
        Input()
    ], CountriesMapComponent.prototype, "valueLabel", void 0);
    __decorate([
        Input()
    ], CountriesMapComponent.prototype, "showCaption", void 0);
    __decorate([
        Input()
    ], CountriesMapComponent.prototype, "captionBelow", void 0);
    __decorate([
        Input()
    ], CountriesMapComponent.prototype, "minValue", void 0);
    __decorate([
        Input()
    ], CountriesMapComponent.prototype, "maxValue", void 0);
    __decorate([
        Input()
    ], CountriesMapComponent.prototype, "minColor", void 0);
    __decorate([
        Input()
    ], CountriesMapComponent.prototype, "maxColor", void 0);
    __decorate([
        Input()
    ], CountriesMapComponent.prototype, "noDataColor", void 0);
    __decorate([
        Input()
    ], CountriesMapComponent.prototype, "exceptionColor", void 0);
    __decorate([
        Output()
    ], CountriesMapComponent.prototype, "chartReady", void 0);
    __decorate([
        Output()
    ], CountriesMapComponent.prototype, "chartError", void 0);
    __decorate([
        Output()
    ], CountriesMapComponent.prototype, "chartSelect", void 0);
    CountriesMapComponent = __decorate([
        Component({
            selector: 'countries-map',
            template: "<div class=\"major-block loading\" *ngIf=\"loading\"><span class=\"text\">Loading map...</span></div>\r\n\r\n<div class=\"major-block cm-map-content\" [ngClass]=\"{'goes-first': captionBelow}\"></div>\r\n\r\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\"\r\n  *ngIf=\"!loading && showCaption\">\r\n  <div class=\"cm-simple-caption\">\r\n    <div class=\"cm-country-label\">\r\n      <span class=\"cm-default-label\" *ngIf=\"!selection\">{{countryLabel}}</span>\r\n      <span class=\"cm-country-name\" *ngIf=\"selection\">{{selection?.countryName}}</span>\r\n    </div>\r\n    <div class=\"cm-value-label\">\r\n      <span class=\"cm-value-text\"\r\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}<span *ngIf=\"selection\">: </span></span>\r\n      <span class=\"cm-value-content\" *ngIf=\"selection\">{{selectionValue}}</span>\r\n    </div>\r\n  </div>\r\n  <div class=\"cm-extended-caption\" *ngIf=\"selection?.extra && selection?.extra.length > 0\">\r\n    <div *ngFor=\"let item of selection?.extra\" class=\"cm-extended-item\">\r\n      <span class=\"cm-extended-label\">{{item.key}}</span>:\r\n      <span class=\"cm-extended-value\">{{item.val}}</span>\r\n    </div>\r\n  </div>\r\n</div>\r\n",
            styles: [":host{display:flex;flex-flow:column nowrap;justify-content:space-between;align-items:stretch;align-content:stretch}.major-block.loading{flex:0 1 auto;align-self:center}.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{flex:0 1 auto;display:flex;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{flex:0 1 auto;align-self:flex-start}.cm-value-label{flex:0 1 auto;align-self:flex-end}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}"]
        })
    ], CountriesMapComponent);
    return CountriesMapComponent;
}());
export { CountriesMapComponent };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9jb3VudHJpZXMtbWFwLyIsInNvdXJjZXMiOlsiYXBwL21vZHVsZXMvY291bnRyaWVzLW1hcC9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sYUFBYSxFQUNiLFlBQVksRUFDYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMzRSxPQUFPLEVBQXFDLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRTVGLE9BQU8sRUFBRSxFQUFFLElBQUksV0FBVyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFMUQsSUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDO0FBQzVCLElBQU0sV0FBVyxHQUFHLFVBQUMsV0FBbUI7SUFDdEMsT0FBTyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbEMsQ0FBQyxDQUFDOztBQU9GO0lBNEJFLCtCQUNVLEVBQWMsRUFDZCxhQUF3QztRQUR4QyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2Qsa0JBQWEsR0FBYixhQUFhLENBQTJCO1FBekJsQyxpQkFBWSxHQUFHLFNBQVMsQ0FBQztRQUN6QixlQUFVLEdBQUcsT0FBTyxDQUFDO1FBQ3JCLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ25CLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFFYixhQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ25CLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsZ0JBQVcsR0FBRyxTQUFTLENBQUM7UUFDeEIsbUJBQWMsR0FBRyxTQUFTLENBQUM7UUFRM0MsY0FBUyxHQUFxQixJQUFJLENBQUM7UUFDbkMsWUFBTyxHQUFHLElBQUksQ0FBQztRQVNiLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQWJELHNCQUFJLGlEQUFjO2FBQWxCO1lBQ0UsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ25ELENBQUM7OztPQUFBO0lBYU8sZ0RBQWdCLEdBQXhCLFVBQXlCLE9BQWU7UUFDOUIsSUFBQSxnQ0FBSyxDQUF3QjtRQUNyQyxPQUFPLEtBQUssSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLENBQUMsRUFBRSxHQUFHLEtBQUEsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBMUIsQ0FBMEIsQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFFTyw2Q0FBYSxHQUFyQixVQUFzQixPQUFnQjtRQUNwQyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDekIsU0FBUyxFQUFFLE9BQU87WUFDbEIsV0FBVyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUM7WUFDakMsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7U0FDdEMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ1gsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNLLGdEQUFnQixHQUF4QjtRQUNFLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsR0FBRyxFQUFFLEVBQVU7Z0JBQVYsa0JBQVUsRUFBVCxXQUFHLEVBQUUsV0FBRztZQUNoRSxJQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDdkMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxhQUFhLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0YsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBeUIsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFTSwyQ0FBVyxHQUFsQixVQUFtQixPQUFzQjtRQUF6QyxpQkFtQ0M7UUFsQ0MsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDO1FBQ25CLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBRWhCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUNkLE9BQU87YUFDUjtZQUVELElBQU0sZ0JBQWMsR0FBRztnQkFDckIsU0FBUyxFQUFFO29CQUNULE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDdEMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTO29CQUNyRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVM7aUJBQ3RFO2dCQUNELG1CQUFtQixFQUFFLElBQUksQ0FBQyxXQUFXO2dCQUNyQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGNBQWM7Z0JBQ2pDLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDeEIsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTthQUM3QixDQUFDO1lBRUYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDeEMsS0FBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7Z0JBRXhCLEtBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQztvQkFDbkQsU0FBUyxFQUFFLFVBQVU7b0JBQ3JCLFNBQVMsRUFBRSxLQUFJLENBQUMsVUFBVTtvQkFDMUIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsZ0JBQWMsRUFBRSxLQUFJLENBQUMsT0FBTyxDQUFDO2lCQUNyRCxDQUFDLENBQUM7Z0JBRUgsS0FBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7Z0JBQ2xDLEtBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNoQixDQUFDLEVBQUU7Z0JBQ0QsS0FBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsRUFBRSxhQUFhLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7WUFDOUUsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFTSxzQ0FBTSxHQUFiO1FBQ0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRU8sNENBQVksR0FBcEI7UUFDRSxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFTyw0Q0FBWSxHQUFwQixVQUFxQixLQUFzQjtRQUN6QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRU8sMkNBQVcsR0FBbkI7UUFDRSxJQUFNLEtBQUssR0FBcUI7WUFDOUIsUUFBUSxFQUFFLEtBQUs7WUFDZixLQUFLLEVBQUUsSUFBSTtZQUNYLE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQztRQUVGLElBQU0sU0FBUyxHQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRW5FLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDaEIsSUFBQSwyQkFBYSxDQUFtQztZQUN4RCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxDQUFDO1lBRTlDLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLEtBQUssQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDOUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNoRCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUVuQzthQUFNO1lBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxQjtRQUVELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFTywwREFBMEIsR0FBbEM7UUFDVSxJQUFBLHFEQUFXLENBQWlDO1FBQ3BELFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7O2dCQXRIYSxVQUFVO2dCQUNDLHlCQUF5Qjs7SUE1QnpDO1FBQVIsS0FBSyxFQUFFO3VEQUE0QjtJQUMzQjtRQUFSLEtBQUssRUFBRTt5REFBdUI7SUFDdEI7UUFBUixLQUFLLEVBQUU7MERBQXFCO0lBQ3BCO1FBQVIsS0FBSyxFQUFFOytEQUFpQztJQUNoQztRQUFSLEtBQUssRUFBRTs2REFBNkI7SUFDNUI7UUFBUixLQUFLLEVBQUU7OERBQTJCO0lBQzFCO1FBQVIsS0FBSyxFQUFFOytEQUE0QjtJQUMzQjtRQUFSLEtBQUssRUFBRTsyREFBcUI7SUFDcEI7UUFBUixLQUFLLEVBQUU7MkRBQXlCO0lBQ3hCO1FBQVIsS0FBSyxFQUFFOzJEQUEyQjtJQUMxQjtRQUFSLEtBQUssRUFBRTsyREFBeUI7SUFDeEI7UUFBUixLQUFLLEVBQUU7OERBQWdDO0lBQy9CO1FBQVIsS0FBSyxFQUFFO2lFQUFtQztJQUVqQztRQUFULE1BQU0sRUFBRTs2REFBdUM7SUFDdEM7UUFBVCxNQUFNLEVBQUU7NkRBQWtEO0lBQ2pEO1FBQVQsTUFBTSxFQUFFOzhEQUFvRDtJQWxCbEQscUJBQXFCO1FBTGpDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxlQUFlO1lBQ3pCLHN2Q0FBNkM7O1NBRTlDLENBQUM7T0FDVyxxQkFBcUIsQ0FxSmpDO0lBQUQsNEJBQUM7Q0FBQSxBQXJKRCxJQXFKQztTQXJKWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIHZhciBnb29nbGU6IGFueTtcclxuXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG4gIEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBHb29nbGVDaGFydHNMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi9nb29nbGUtY2hhcnRzLWxvYWRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2hhcnRTZWxlY3RFdmVudCwgQ2hhcnRFcnJvckV2ZW50LCBDaGFyRXJyb3JDb2RlIH0gZnJvbSAnLi9jaGFydC1ldmVudHMuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgQ291bnRyaWVzRGF0YSwgU2VsZWN0aW9uRXh0cmEsIFNlbGVjdGlvbiwgVmFsaWRDb3VudHJ5RGF0YSB9IGZyb20gJy4vZGF0YS10eXBlcy5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBlbiBhcyBjb3VudHJpZXNFTiB9IGZyb20gJ0BqYWdvbWYvY291bnRyaWVzbGlzdCc7XHJcblxyXG5jb25zdCB2YWx1ZUhvbGRlciA9ICd2YWx1ZSc7XHJcbmNvbnN0IGNvdW50cnlOYW1lID0gKGNvdW50cnlDb2RlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG4gIHJldHVybiBjb3VudHJpZXNFTltjb3VudHJ5Q29kZV07XHJcbn07XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2NvdW50cmllcy1tYXAnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC5jc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ291bnRyaWVzTWFwQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcclxuXHJcbiAgQElucHV0KCkgcHVibGljIGRhdGE6IENvdW50cmllc0RhdGE7XHJcbiAgQElucHV0KCkgcHVibGljIGFwaUtleTogc3RyaW5nO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBvcHRpb25zOiBhbnk7XHJcbiAgQElucHV0KCkgcHVibGljIGNvdW50cnlMYWJlbCA9ICdDb3VudHJ5JztcclxuICBASW5wdXQoKSBwdWJsaWMgdmFsdWVMYWJlbCA9ICdWYWx1ZSc7XHJcbiAgQElucHV0KCkgcHVibGljIHNob3dDYXB0aW9uID0gdHJ1ZTtcclxuICBASW5wdXQoKSBwdWJsaWMgY2FwdGlvbkJlbG93ID0gdHJ1ZTtcclxuICBASW5wdXQoKSBwdWJsaWMgbWluVmFsdWUgPSAwO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBtYXhWYWx1ZTogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBtaW5Db2xvciA9ICd3aGl0ZSc7XHJcbiAgQElucHV0KCkgcHVibGljIG1heENvbG9yID0gJ3JlZCc7XHJcbiAgQElucHV0KCkgcHVibGljIG5vRGF0YUNvbG9yID0gJyNDRkNGQ0YnO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBleGNlcHRpb25Db2xvciA9ICcjRkZFRTU4JztcclxuXHJcbiAgQE91dHB1dCgpIHB1YmxpYyBjaGFydFJlYWR5OiBFdmVudEVtaXR0ZXI8dm9pZD47XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBjaGFydEVycm9yOiBFdmVudEVtaXR0ZXI8Q2hhcnRFcnJvckV2ZW50PjtcclxuICBAT3V0cHV0KCkgcHVibGljIGNoYXJ0U2VsZWN0OiBFdmVudEVtaXR0ZXI8Q2hhcnRTZWxlY3RFdmVudD47XHJcblxyXG4gIGdvb2dsZURhdGE6IFZhbGlkQ291bnRyeURhdGFbXVtdO1xyXG4gIHdyYXBwZXI6IGFueTtcclxuICBzZWxlY3Rpb246IFNlbGVjdGlvbiB8IG51bGwgPSBudWxsO1xyXG4gIGxvYWRpbmcgPSB0cnVlO1xyXG4gIGdldCBzZWxlY3Rpb25WYWx1ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5zZWxlY3Rpb24uY291bnRyeUlkXS52YWx1ZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsXHJcbiAgICBwcml2YXRlIGxvYWRlclNlcnZpY2U6IEdvb2dsZUNoYXJ0c0xvYWRlclNlcnZpY2VcclxuICApIHtcclxuICAgIHRoaXMuZWwgPSBlbDtcclxuICAgIHRoaXMubG9hZGVyU2VydmljZSA9IGxvYWRlclNlcnZpY2U7XHJcbiAgICB0aGlzLmNoYXJ0U2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5jaGFydFJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5jaGFydEVycm9yID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRFeHRyYVNlbGVjdGVkKGNvdW50cnk6IHN0cmluZyk6IFNlbGVjdGlvbkV4dHJhW10gfCBudWxsIHtcclxuICAgIGNvbnN0IHsgZXh0cmEgfSA9IHRoaXMuZGF0YVtjb3VudHJ5XTtcclxuICAgIHJldHVybiBleHRyYSAmJiBPYmplY3Qua2V5cyhleHRyYSkubWFwKGtleSA9PiAoeyBrZXksIHZhbDogZXh0cmFba2V5XSB9KSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNlbGVjdENvdW50cnkoY291bnRyeT86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhpcy5zZWxlY3Rpb24gPSBjb3VudHJ5ID8ge1xyXG4gICAgICBjb3VudHJ5SWQ6IGNvdW50cnksXHJcbiAgICAgIGNvdW50cnlOYW1lOiBjb3VudHJ5TmFtZShjb3VudHJ5KSxcclxuICAgICAgZXh0cmE6IHRoaXMuZ2V0RXh0cmFTZWxlY3RlZChjb3VudHJ5KVxyXG4gICAgfSA6IG51bGw7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb252ZXJ0IGEgdGFibGUgKG9iamVjdCkgZm9ybWF0dGVkIGFzXHJcbiAgICogYHsgR0I6IHsgdmFsdWU6MTIzLCAuLi5vdGhlcmRhdGEgfSwgRVM6IHsgdmFsdWU6NDU2LCAuLi53aGF0ZXZlciB9IH1gXHJcbiAgICogdG8gYW4gYXJyYXkgZm9yIEdvb2dsZSBDaGFydHMgZm9ybWF0dGVkIGFzXHJcbiAgICogYFsgWydDb3VudHJ5JywgJ1ZhbHVlJ10sIFsnR0InLCAxMjNdLCBbJ0VTJywgNDU2XSBdYFxyXG4gICAqIGFuZCBzYXZlIHRvIHRoaXMucHJvY2Vzc2VkRGF0YVxyXG4gICAqL1xyXG4gIHByaXZhdGUgcHJvY2Vzc0lucHV0RGF0YSgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ29vZ2xlRGF0YSA9IE9iamVjdC5lbnRyaWVzKHRoaXMuZGF0YSkucmVkdWNlKChhY2MsIFtrZXksIHZhbF0pID0+IHtcclxuICAgICAgY29uc3QgcmF3VmFsQ29udGVudCA9IHZhbFt2YWx1ZUhvbGRlcl07XHJcbiAgICAgIGFjYy5wdXNoKFtrZXksIHJhd1ZhbENvbnRlbnQgPT09IG51bGwgPyBudWxsIDogcmF3VmFsQ29udGVudCA/ICtyYXdWYWxDb250ZW50LnRvU3RyaW5nKCkgOiAwXSk7XHJcbiAgICAgIHJldHVybiBhY2M7XHJcbiAgICB9LCBbWydDb3VudHJ5JywgJ1ZhbHVlJ11dIGFzIFZhbGlkQ291bnRyeURhdGFbXVtdKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICBjb25zdCBrZXkgPSAnZGF0YSc7XHJcbiAgICBpZiAoY2hhbmdlc1trZXldKSB7XHJcblxyXG4gICAgICBpZiAoIXRoaXMuZGF0YSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgY29sb3JBeGlzOiB7XHJcbiAgICAgICAgICBjb2xvcnM6IFt0aGlzLm1pbkNvbG9yLCB0aGlzLm1heENvbG9yXSxcclxuICAgICAgICAgIG1pblZhbHVlOiBOdW1iZXIuaXNJbnRlZ2VyKHRoaXMubWluVmFsdWUpID8gdGhpcy5taW5WYWx1ZSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgIG1heFZhbHVlOiBOdW1iZXIuaXNJbnRlZ2VyKHRoaXMubWF4VmFsdWUpID8gdGhpcy5tYXhWYWx1ZSA6IHVuZGVmaW5lZFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGF0YWxlc3NSZWdpb25Db2xvcjogdGhpcy5ub0RhdGFDb2xvcixcclxuICAgICAgICBkZWZhdWx0Q29sb3I6IHRoaXMuZXhjZXB0aW9uQ29sb3IsXHJcbiAgICAgICAgbGVnZW5kOiB0aGlzLnNob3dDYXB0aW9uLFxyXG4gICAgICAgIHRvb2x0aXA6IHsgdHJpZ2dlcjogJ25vbmUnIH1cclxuICAgICAgfTtcclxuXHJcbiAgICAgIHRoaXMubG9hZGVyU2VydmljZS5sb2FkKHRoaXMuYXBpS2V5KS50aGVuKCgpID0+IHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NJbnB1dERhdGEoKTtcclxuXHJcbiAgICAgICAgdGhpcy53cmFwcGVyID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcih7XHJcbiAgICAgICAgICBjaGFydFR5cGU6ICdHZW9DaGFydCcsXHJcbiAgICAgICAgICBkYXRhVGFibGU6IHRoaXMuZ29vZ2xlRGF0YSxcclxuICAgICAgICAgIG9wdGlvbnM6IE9iamVjdC5hc3NpZ24oZGVmYXVsdE9wdGlvbnMsIHRoaXMub3B0aW9ucylcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5yZWdpc3RlckNoYXJ0V3JhcHBlckV2ZW50cygpO1xyXG4gICAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICAgIH0sICgpID0+IHtcclxuICAgICAgICB0aGlzLm9uQ2hhcnRlcnJvcih7IGlkOiBDaGFyRXJyb3JDb2RlLmxvYWRpbmcsIG1lc3NhZ2U6ICdDb3VsZCBub3QgbG9hZCcgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlZHJhdygpOiB2b2lkIHtcclxuICAgIHRoaXMud3JhcHBlci5kcmF3KHRoaXMuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuY20tbWFwLWNvbnRlbnQnKSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9uQ2hhcnRSZWFkeSgpOiB2b2lkIHtcclxuICAgIHRoaXMubG9hZGluZyA9IGZhbHNlO1xyXG4gICAgdGhpcy5jaGFydFJlYWR5LmVtaXQoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25DaGFydGVycm9yKGVycm9yOiBDaGFydEVycm9yRXZlbnQpOiB2b2lkIHtcclxuICAgIHRoaXMuY2hhcnRFcnJvci5lbWl0KGVycm9yKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25NYXBTZWxlY3QoKTogdm9pZCB7XHJcbiAgICBjb25zdCBldmVudDogQ2hhcnRTZWxlY3RFdmVudCA9IHtcclxuICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxyXG4gICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgY291bnRyeTogbnVsbFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBzZWxlY3Rpb246IGFueVtdID0gdGhpcy53cmFwcGVyLnZpc3VhbGl6YXRpb24uZ2V0U2VsZWN0aW9uKCk7XHJcblxyXG4gICAgaWYgKHNlbGVjdGlvbi5sZW5ndGggPiAwKSB7XHJcbiAgICAgIGNvbnN0IHsgcm93OiB0YWJsZVJvdyB9OiB7IHJvdzogbnVtYmVyIH0gPSBzZWxlY3Rpb25bMF07XHJcbiAgICAgIGNvbnN0IGRhdGFUYWJsZSA9IHRoaXMud3JhcHBlci5nZXREYXRhVGFibGUoKTtcclxuXHJcbiAgICAgIGV2ZW50LnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgZXZlbnQudmFsdWUgPSBkYXRhVGFibGUuZ2V0VmFsdWUodGFibGVSb3csIDEpO1xyXG4gICAgICBldmVudC5jb3VudHJ5ID0gZGF0YVRhYmxlLmdldFZhbHVlKHRhYmxlUm93LCAwKTtcclxuICAgICAgdGhpcy5zZWxlY3RDb3VudHJ5KGV2ZW50LmNvdW50cnkpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2VsZWN0Q291bnRyeShudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNoYXJ0U2VsZWN0LmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWdpc3RlckNoYXJ0V3JhcHBlckV2ZW50cygpOiB2b2lkIHtcclxuICAgIGNvbnN0IHsgYWRkTGlzdGVuZXIgfSA9IGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cztcclxuICAgIGFkZExpc3RlbmVyKHRoaXMud3JhcHBlciwgJ3JlYWR5JywgdGhpcy5vbkNoYXJ0UmVhZHkuYmluZCh0aGlzKSk7XHJcbiAgICBhZGRMaXN0ZW5lcih0aGlzLndyYXBwZXIsICdlcnJvcicsIHRoaXMub25DaGFydGVycm9yLmJpbmQodGhpcykpO1xyXG4gICAgYWRkTGlzdGVuZXIodGhpcy53cmFwcGVyLCAnc2VsZWN0JywgdGhpcy5vbk1hcFNlbGVjdC5iaW5kKHRoaXMpKTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==