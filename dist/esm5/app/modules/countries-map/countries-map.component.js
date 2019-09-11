import * as tslib_1 from "tslib";
import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
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
            var _b = tslib_1.__read(_a, 2), key = _b[0], val = _b[1];
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
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CountriesMapComponent.prototype, "data", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", String)
    ], CountriesMapComponent.prototype, "apiKey", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CountriesMapComponent.prototype, "options", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CountriesMapComponent.prototype, "countryLabel", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CountriesMapComponent.prototype, "valueLabel", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CountriesMapComponent.prototype, "showCaption", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CountriesMapComponent.prototype, "captionBelow", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CountriesMapComponent.prototype, "minValue", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Number)
    ], CountriesMapComponent.prototype, "maxValue", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CountriesMapComponent.prototype, "minColor", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CountriesMapComponent.prototype, "maxColor", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CountriesMapComponent.prototype, "noDataColor", void 0);
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], CountriesMapComponent.prototype, "exceptionColor", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], CountriesMapComponent.prototype, "chartReady", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], CountriesMapComponent.prototype, "chartError", void 0);
    tslib_1.__decorate([
        Output(),
        tslib_1.__metadata("design:type", EventEmitter)
    ], CountriesMapComponent.prototype, "chartSelect", void 0);
    CountriesMapComponent = tslib_1.__decorate([
        Component({
            selector: 'countries-map',
            template: "<div class=\"major-block loading\" *ngIf=\"loading\"><span class=\"text\">Loading map...</span></div>\n\n<div class=\"major-block cm-map-content\" [ngClass]=\"{'goes-first': captionBelow}\"></div>\n\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\"\n  *ngIf=\"!loading && showCaption\">\n  <div class=\"cm-simple-caption\">\n    <div class=\"cm-country-label\">\n      <span class=\"cm-default-label\" *ngIf=\"!selection\">{{countryLabel}}</span>\n      <span class=\"cm-country-name\" *ngIf=\"selection\">{{selection?.countryName}}</span>\n    </div>\n    <div class=\"cm-value-label\">\n      <span class=\"cm-value-text\"\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}<span *ngIf=\"selection\">: </span></span>\n      <span class=\"cm-value-content\" *ngIf=\"selection\">{{selectionValue}}</span>\n    </div>\n  </div>\n  <div class=\"cm-extended-caption\" *ngIf=\"selection?.extra && selection?.extra.length > 0\">\n    <div *ngFor=\"let item of selection?.extra\" class=\"cm-extended-item\">\n      <span class=\"cm-extended-label\">{{item.key}}</span>:\n      <span class=\"cm-extended-value\">{{item.val}}</span>\n    </div>\n  </div>\n</div>\n",
            styles: [":host{display:flex;flex-flow:column nowrap;justify-content:space-between;align-items:stretch;align-content:stretch}.major-block.loading{flex:0 1 auto;-ms-grid-row-align:center;align-self:center}.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{flex:0 1 auto;display:flex;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{flex:0 1 auto;align-self:flex-start}.cm-value-label{flex:0 1 auto;align-self:flex-end}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:-ms-grid;display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}"]
        }),
        tslib_1.__metadata("design:paramtypes", [ElementRef,
            GoogleChartsLoaderService])
    ], CountriesMapComponent);
    return CountriesMapComponent;
}());
export { CountriesMapComponent };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9jb3VudHJpZXMtbWFwLyIsInNvdXJjZXMiOlsiYXBwL21vZHVsZXMvY291bnRyaWVzLW1hcC9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBRVYsS0FBSyxFQUNMLE1BQU0sRUFFTixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0UsT0FBTyxFQUFxQyxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUU1RixPQUFPLEVBQUUsRUFBRSxJQUFJLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTFELElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQztBQUM1QixJQUFNLFdBQVcsR0FBRyxVQUFDLFdBQW1CO0lBQ3RDLE9BQU8sV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2xDLENBQUMsQ0FBQzs7QUFPRjtJQTRCRSwrQkFDVSxFQUFjLEVBQ2QsYUFBd0M7UUFEeEMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGtCQUFhLEdBQWIsYUFBYSxDQUEyQjtRQXpCbEMsaUJBQVksR0FBRyxTQUFTLENBQUM7UUFDekIsZUFBVSxHQUFHLE9BQU8sQ0FBQztRQUNyQixnQkFBVyxHQUFHLElBQUksQ0FBQztRQUNuQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBRWIsYUFBUSxHQUFHLE9BQU8sQ0FBQztRQUNuQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGdCQUFXLEdBQUcsU0FBUyxDQUFDO1FBQ3hCLG1CQUFjLEdBQUcsU0FBUyxDQUFDO1FBUTNDLGNBQVMsR0FBcUIsSUFBSSxDQUFDO1FBQ25DLFlBQU8sR0FBRyxJQUFJLENBQUM7UUFTYixJQUFJ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RSxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBakpRO1FBQVIsS0FBSyxFQUFFOzt1REFBNEI7SUFDM0I7UUFBUixLQUFLLEVBQUU7O3lEQUF1QjtJQUN0QjtRQUFSLEtBQUssRUFBRTs7MERBQXFCO0lBQ3BCO1FBQVIsS0FBSyxFQUFFOzsrREFBaUM7SUFDaEM7UUFBUixLQUFLLEVBQUU7OzZEQUE2QjtJQUM1QjtRQUFSLEtBQUssRUFBRTs7OERBQTJCO0lBQzFCO1FBQVIsS0FBSyxFQUFFOzsrREFBNEI7SUFDM0I7UUFBUixLQUFLLEVBQUU7OzJEQUFxQjtJQUNwQjtRQUFSLEtBQUssRUFBRTs7MkRBQXlCO0lBQ3hCO1FBQVIsS0FBSyxFQUFFOzsyREFBMkI7SUFDMUI7UUFBUixLQUFLLEVBQUU7OzJEQUF5QjtJQUN4QjtRQUFSLEtBQUssRUFBRTs7OERBQWdDO0lBQy9CO1FBQVIsS0FBSyxFQUFFOztpRUFBbUM7SUFFakM7UUFBVCxNQUFNLEVBQUU7MENBQW9CLFlBQVk7NkRBQU87SUFDdEM7UUFBVCxNQUFNLEVBQUU7MENBQW9CLFlBQVk7NkRBQWtCO0lBQ2pEO1FBQVQsTUFBTSxFQUFFOzBDQUFxQixZQUFZOzhEQUFtQjtJQWxCbEQscUJBQXFCO1FBTGpDLFNBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxlQUFlO1lBQ3pCLHNzQ0FBNkM7O1NBRTlDLENBQUM7aURBOEJjLFVBQVU7WUFDQyx5QkFBeUI7T0E5QnZDLHFCQUFxQixDQXFKakM7SUFBRCw0QkFBQztDQUFBLEFBckpELElBcUpDO1NBckpZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImRlY2xhcmUgdmFyIGdvb2dsZTogYW55O1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIE9uQ2hhbmdlcyxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgRXZlbnRFbWl0dGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgR29vZ2xlQ2hhcnRzTG9hZGVyU2VydmljZSB9IGZyb20gJy4vZ29vZ2xlLWNoYXJ0cy1sb2FkZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDaGFydFNlbGVjdEV2ZW50LCBDaGFydEVycm9yRXZlbnQsIENoYXJFcnJvckNvZGUgfSBmcm9tICcuL2NoYXJ0LWV2ZW50cy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ291bnRyaWVzRGF0YSwgU2VsZWN0aW9uRXh0cmEsIFNlbGVjdGlvbiwgVmFsaWRDb3VudHJ5RGF0YSB9IGZyb20gJy4vZGF0YS10eXBlcy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgZW4gYXMgY291bnRyaWVzRU4gfSBmcm9tICdAamFnb21mL2NvdW50cmllc2xpc3QnO1xuXG5jb25zdCB2YWx1ZUhvbGRlciA9ICd2YWx1ZSc7XG5jb25zdCBjb3VudHJ5TmFtZSA9IChjb3VudHJ5Q29kZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgcmV0dXJuIGNvdW50cmllc0VOW2NvdW50cnlDb2RlXTtcbn07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NvdW50cmllcy1tYXAnLFxuICB0ZW1wbGF0ZVVybDogJy4vY291bnRyaWVzLW1hcC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NvdW50cmllcy1tYXAuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIENvdW50cmllc01hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG5cbiAgQElucHV0KCkgcHVibGljIGRhdGE6IENvdW50cmllc0RhdGE7XG4gIEBJbnB1dCgpIHB1YmxpYyBhcGlLZXk6IHN0cmluZztcbiAgQElucHV0KCkgcHVibGljIG9wdGlvbnM6IGFueTtcbiAgQElucHV0KCkgcHVibGljIGNvdW50cnlMYWJlbCA9ICdDb3VudHJ5JztcbiAgQElucHV0KCkgcHVibGljIHZhbHVlTGFiZWwgPSAnVmFsdWUnO1xuICBASW5wdXQoKSBwdWJsaWMgc2hvd0NhcHRpb24gPSB0cnVlO1xuICBASW5wdXQoKSBwdWJsaWMgY2FwdGlvbkJlbG93ID0gdHJ1ZTtcbiAgQElucHV0KCkgcHVibGljIG1pblZhbHVlID0gMDtcbiAgQElucHV0KCkgcHVibGljIG1heFZhbHVlOiBudW1iZXI7XG4gIEBJbnB1dCgpIHB1YmxpYyBtaW5Db2xvciA9ICd3aGl0ZSc7XG4gIEBJbnB1dCgpIHB1YmxpYyBtYXhDb2xvciA9ICdyZWQnO1xuICBASW5wdXQoKSBwdWJsaWMgbm9EYXRhQ29sb3IgPSAnI0NGQ0ZDRic7XG4gIEBJbnB1dCgpIHB1YmxpYyBleGNlcHRpb25Db2xvciA9ICcjRkZFRTU4JztcblxuICBAT3V0cHV0KCkgcHVibGljIGNoYXJ0UmVhZHk6IEV2ZW50RW1pdHRlcjx2b2lkPjtcbiAgQE91dHB1dCgpIHB1YmxpYyBjaGFydEVycm9yOiBFdmVudEVtaXR0ZXI8Q2hhcnRFcnJvckV2ZW50PjtcbiAgQE91dHB1dCgpIHB1YmxpYyBjaGFydFNlbGVjdDogRXZlbnRFbWl0dGVyPENoYXJ0U2VsZWN0RXZlbnQ+O1xuXG4gIGdvb2dsZURhdGE6IFZhbGlkQ291bnRyeURhdGFbXVtdO1xuICB3cmFwcGVyOiBhbnk7XG4gIHNlbGVjdGlvbjogU2VsZWN0aW9uIHwgbnVsbCA9IG51bGw7XG4gIGxvYWRpbmcgPSB0cnVlO1xuICBnZXQgc2VsZWN0aW9uVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLnNlbGVjdGlvbi5jb3VudHJ5SWRdLnZhbHVlO1xuICB9XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBsb2FkZXJTZXJ2aWNlOiBHb29nbGVDaGFydHNMb2FkZXJTZXJ2aWNlXG4gICkge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLmxvYWRlclNlcnZpY2UgPSBsb2FkZXJTZXJ2aWNlO1xuICAgIHRoaXMuY2hhcnRTZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgdGhpcy5jaGFydFJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIHRoaXMuY2hhcnRFcnJvciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RXh0cmFTZWxlY3RlZChjb3VudHJ5OiBzdHJpbmcpOiBTZWxlY3Rpb25FeHRyYVtdIHwgbnVsbCB7XG4gICAgY29uc3QgeyBleHRyYSB9ID0gdGhpcy5kYXRhW2NvdW50cnldO1xuICAgIHJldHVybiBleHRyYSAmJiBPYmplY3Qua2V5cyhleHRyYSkubWFwKGtleSA9PiAoeyBrZXksIHZhbDogZXh0cmFba2V5XSB9KSk7XG4gIH1cblxuICBwcml2YXRlIHNlbGVjdENvdW50cnkoY291bnRyeT86IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0aW9uID0gY291bnRyeSA/IHtcbiAgICAgIGNvdW50cnlJZDogY291bnRyeSxcbiAgICAgIGNvdW50cnlOYW1lOiBjb3VudHJ5TmFtZShjb3VudHJ5KSxcbiAgICAgIGV4dHJhOiB0aGlzLmdldEV4dHJhU2VsZWN0ZWQoY291bnRyeSlcbiAgICB9IDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGEgdGFibGUgKG9iamVjdCkgZm9ybWF0dGVkIGFzXG4gICAqIGB7IEdCOiB7IHZhbHVlOjEyMywgLi4ub3RoZXJkYXRhIH0sIEVTOiB7IHZhbHVlOjQ1NiwgLi4ud2hhdGV2ZXIgfSB9YFxuICAgKiB0byBhbiBhcnJheSBmb3IgR29vZ2xlIENoYXJ0cyBmb3JtYXR0ZWQgYXNcbiAgICogYFsgWydDb3VudHJ5JywgJ1ZhbHVlJ10sIFsnR0InLCAxMjNdLCBbJ0VTJywgNDU2XSBdYFxuICAgKiBhbmQgc2F2ZSB0byB0aGlzLnByb2Nlc3NlZERhdGFcbiAgICovXG4gIHByaXZhdGUgcHJvY2Vzc0lucHV0RGF0YSgpOiB2b2lkIHtcbiAgICB0aGlzLmdvb2dsZURhdGEgPSBPYmplY3QuZW50cmllcyh0aGlzLmRhdGEpLnJlZHVjZSgoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG4gICAgICBjb25zdCByYXdWYWxDb250ZW50ID0gdmFsW3ZhbHVlSG9sZGVyXTtcbiAgICAgIGFjYy5wdXNoKFtrZXksIHJhd1ZhbENvbnRlbnQgPT09IG51bGwgPyBudWxsIDogcmF3VmFsQ29udGVudCA/ICtyYXdWYWxDb250ZW50LnRvU3RyaW5nKCkgOiAwXSk7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIFtbJ0NvdW50cnknLCAnVmFsdWUnXV0gYXMgVmFsaWRDb3VudHJ5RGF0YVtdW10pO1xuICB9XG5cbiAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCBrZXkgPSAnZGF0YSc7XG4gICAgaWYgKGNoYW5nZXNba2V5XSkge1xuXG4gICAgICBpZiAoIXRoaXMuZGF0YSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICBjb2xvckF4aXM6IHtcbiAgICAgICAgICBjb2xvcnM6IFt0aGlzLm1pbkNvbG9yLCB0aGlzLm1heENvbG9yXSxcbiAgICAgICAgICBtaW5WYWx1ZTogTnVtYmVyLmlzSW50ZWdlcih0aGlzLm1pblZhbHVlKSA/IHRoaXMubWluVmFsdWUgOiB1bmRlZmluZWQsXG4gICAgICAgICAgbWF4VmFsdWU6IE51bWJlci5pc0ludGVnZXIodGhpcy5tYXhWYWx1ZSkgPyB0aGlzLm1heFZhbHVlIDogdW5kZWZpbmVkXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGFsZXNzUmVnaW9uQ29sb3I6IHRoaXMubm9EYXRhQ29sb3IsXG4gICAgICAgIGRlZmF1bHRDb2xvcjogdGhpcy5leGNlcHRpb25Db2xvcixcbiAgICAgICAgbGVnZW5kOiB0aGlzLnNob3dDYXB0aW9uLFxuICAgICAgICB0b29sdGlwOiB7IHRyaWdnZXI6ICdub25lJyB9XG4gICAgICB9O1xuXG4gICAgICB0aGlzLmxvYWRlclNlcnZpY2UubG9hZCh0aGlzLmFwaUtleSkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0lucHV0RGF0YSgpO1xuXG4gICAgICAgIHRoaXMud3JhcHBlciA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFdyYXBwZXIoe1xuICAgICAgICAgIGNoYXJ0VHlwZTogJ0dlb0NoYXJ0JyxcbiAgICAgICAgICBkYXRhVGFibGU6IHRoaXMuZ29vZ2xlRGF0YSxcbiAgICAgICAgICBvcHRpb25zOiBPYmplY3QuYXNzaWduKGRlZmF1bHRPcHRpb25zLCB0aGlzLm9wdGlvbnMpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJDaGFydFdyYXBwZXJFdmVudHMoKTtcbiAgICAgICAgdGhpcy5yZWRyYXcoKTtcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5vbkNoYXJ0ZXJyb3IoeyBpZDogQ2hhckVycm9yQ29kZS5sb2FkaW5nLCBtZXNzYWdlOiAnQ291bGQgbm90IGxvYWQnIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlZHJhdygpOiB2b2lkIHtcbiAgICB0aGlzLndyYXBwZXIuZHJhdyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmNtLW1hcC1jb250ZW50JykpO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkNoYXJ0UmVhZHkoKTogdm9pZCB7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5jaGFydFJlYWR5LmVtaXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgb25DaGFydGVycm9yKGVycm9yOiBDaGFydEVycm9yRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmNoYXJ0RXJyb3IuZW1pdChlcnJvcik7XG4gIH1cblxuICBwcml2YXRlIG9uTWFwU2VsZWN0KCk6IHZvaWQge1xuICAgIGNvbnN0IGV2ZW50OiBDaGFydFNlbGVjdEV2ZW50ID0ge1xuICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgdmFsdWU6IG51bGwsXG4gICAgICBjb3VudHJ5OiBudWxsXG4gICAgfTtcblxuICAgIGNvbnN0IHNlbGVjdGlvbjogYW55W10gPSB0aGlzLndyYXBwZXIudmlzdWFsaXphdGlvbi5nZXRTZWxlY3Rpb24oKTtcblxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgeyByb3c6IHRhYmxlUm93IH06IHsgcm93OiBudW1iZXIgfSA9IHNlbGVjdGlvblswXTtcbiAgICAgIGNvbnN0IGRhdGFUYWJsZSA9IHRoaXMud3JhcHBlci5nZXREYXRhVGFibGUoKTtcblxuICAgICAgZXZlbnQuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgZXZlbnQudmFsdWUgPSBkYXRhVGFibGUuZ2V0VmFsdWUodGFibGVSb3csIDEpO1xuICAgICAgZXZlbnQuY291bnRyeSA9IGRhdGFUYWJsZS5nZXRWYWx1ZSh0YWJsZVJvdywgMCk7XG4gICAgICB0aGlzLnNlbGVjdENvdW50cnkoZXZlbnQuY291bnRyeSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RDb3VudHJ5KG51bGwpO1xuICAgIH1cblxuICAgIHRoaXMuY2hhcnRTZWxlY3QuZW1pdChldmVudCk7XG4gIH1cblxuICBwcml2YXRlIHJlZ2lzdGVyQ2hhcnRXcmFwcGVyRXZlbnRzKCk6IHZvaWQge1xuICAgIGNvbnN0IHsgYWRkTGlzdGVuZXIgfSA9IGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cztcbiAgICBhZGRMaXN0ZW5lcih0aGlzLndyYXBwZXIsICdyZWFkeScsIHRoaXMub25DaGFydFJlYWR5LmJpbmQodGhpcykpO1xuICAgIGFkZExpc3RlbmVyKHRoaXMud3JhcHBlciwgJ2Vycm9yJywgdGhpcy5vbkNoYXJ0ZXJyb3IuYmluZCh0aGlzKSk7XG4gICAgYWRkTGlzdGVuZXIodGhpcy53cmFwcGVyLCAnc2VsZWN0JywgdGhpcy5vbk1hcFNlbGVjdC5iaW5kKHRoaXMpKTtcbiAgfVxuXG59XG4iXX0=