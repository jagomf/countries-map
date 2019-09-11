import * as tslib_1 from "tslib";
import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { GoogleChartsLoaderService } from './google-charts-loader.service';
import { CharErrorCode } from './chart-events.interface';
import { en as countriesEN } from '@jagomf/countrieslist';
const valueHolder = 'value';
const countryName = (countryCode) => {
    return countriesEN[countryCode];
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
            }, () => {
                this.onCharterror({ id: CharErrorCode.loading, message: 'Could not load' });
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
export { CountriesMapComponent };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9jb3VudHJpZXMtbWFwLyIsInNvdXJjZXMiOlsiYXBwL21vZHVsZXMvY291bnRyaWVzLW1hcC9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBRVYsS0FBSyxFQUNMLE1BQU0sRUFFTixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0UsT0FBTyxFQUFxQyxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUU1RixPQUFPLEVBQUUsRUFBRSxJQUFJLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTFELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQztBQUM1QixNQUFNLFdBQVcsR0FBRyxDQUFDLFdBQW1CLEVBQVUsRUFBRTtJQUNsRCxPQUFPLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUM7O0FBT0YsSUFBYSxxQkFBcUIsR0FBbEMsTUFBYSxxQkFBcUI7SUE0QmhDLFlBQ1UsRUFBYyxFQUNkLGFBQXdDO1FBRHhDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxrQkFBYSxHQUFiLGFBQWEsQ0FBMkI7UUF6QmxDLGlCQUFZLEdBQUcsU0FBUyxDQUFDO1FBQ3pCLGVBQVUsR0FBRyxPQUFPLENBQUM7UUFDckIsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFDbkIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsYUFBUSxHQUFHLENBQUMsQ0FBQztRQUViLGFBQVEsR0FBRyxPQUFPLENBQUM7UUFDbkIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixnQkFBVyxHQUFHLFNBQVMsQ0FBQztRQUN4QixtQkFBYyxHQUFHLFNBQVMsQ0FBQztRQVEzQyxjQUFTLEdBQXFCLElBQUks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QUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNqRSxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNuRSxDQUFDO0NBRUYsQ0FBQTtBQW5KVTtJQUFSLEtBQUssRUFBRTs7bURBQTRCO0FBQzNCO0lBQVIsS0FBSyxFQUFFOztxREFBdUI7QUFDdEI7SUFBUixLQUFLLEVBQUU7O3NEQUFxQjtBQUNwQjtJQUFSLEtBQUssRUFBRTs7MkRBQWlDO0FBQ2hDO0lBQVIsS0FBSyxFQUFFOzt5REFBNkI7QUFDNUI7SUFBUixLQUFLLEVBQUU7OzBEQUEyQjtBQUMxQjtJQUFSLEtBQUssRUFBRTs7MkRBQTRCO0FBQzNCO0lBQVIsS0FBSyxFQUFFOzt1REFBcUI7QUFDcEI7SUFBUixLQUFLLEVBQUU7O3VEQUF5QjtBQUN4QjtJQUFSLEtBQUssRUFBRTs7dURBQTJCO0FBQzFCO0lBQVIsS0FBSyxFQUFFOzt1REFBeUI7QUFDeEI7SUFBUixLQUFLLEVBQUU7OzBEQUFnQztBQUMvQjtJQUFSLEtBQUssRUFBRTs7NkRBQW1DO0FBRWpDO0lBQVQsTUFBTSxFQUFFO3NDQUFvQixZQUFZO3lEQUFPO0FBQ3RDO0lBQVQsTUFBTSxFQUFFO3NDQUFvQixZQUFZO3lEQUFrQjtBQUNqRDtJQUFULE1BQU0sRUFBRTtzQ0FBcUIsWUFBWTswREFBbUI7QUFsQmxELHFCQUFxQjtJQUxqQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsZUFBZTtRQUN6Qixzc0NBQTZDOztLQUU5QyxDQUFDOzZDQThCYyxVQUFVO1FBQ0MseUJBQXlCO0dBOUJ2QyxxQkFBcUIsQ0FxSmpDO1NBckpZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImRlY2xhcmUgdmFyIGdvb2dsZTogYW55O1xuXG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIE9uQ2hhbmdlcyxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgRXZlbnRFbWl0dGVyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgR29vZ2xlQ2hhcnRzTG9hZGVyU2VydmljZSB9IGZyb20gJy4vZ29vZ2xlLWNoYXJ0cy1sb2FkZXIuc2VydmljZSc7XG5pbXBvcnQgeyBDaGFydFNlbGVjdEV2ZW50LCBDaGFydEVycm9yRXZlbnQsIENoYXJFcnJvckNvZGUgfSBmcm9tICcuL2NoYXJ0LWV2ZW50cy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgQ291bnRyaWVzRGF0YSwgU2VsZWN0aW9uRXh0cmEsIFNlbGVjdGlvbiwgVmFsaWRDb3VudHJ5RGF0YSB9IGZyb20gJy4vZGF0YS10eXBlcy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgZW4gYXMgY291bnRyaWVzRU4gfSBmcm9tICdAamFnb21mL2NvdW50cmllc2xpc3QnO1xuXG5jb25zdCB2YWx1ZUhvbGRlciA9ICd2YWx1ZSc7XG5jb25zdCBjb3VudHJ5TmFtZSA9IChjb3VudHJ5Q29kZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgcmV0dXJuIGNvdW50cmllc0VOW2NvdW50cnlDb2RlXTtcbn07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NvdW50cmllcy1tYXAnLFxuICB0ZW1wbGF0ZVVybDogJy4vY291bnRyaWVzLW1hcC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NvdW50cmllcy1tYXAuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIENvdW50cmllc01hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG5cbiAgQElucHV0KCkgcHVibGljIGRhdGE6IENvdW50cmllc0RhdGE7XG4gIEBJbnB1dCgpIHB1YmxpYyBhcGlLZXk6IHN0cmluZztcbiAgQElucHV0KCkgcHVibGljIG9wdGlvbnM6IGFueTtcbiAgQElucHV0KCkgcHVibGljIGNvdW50cnlMYWJlbCA9ICdDb3VudHJ5JztcbiAgQElucHV0KCkgcHVibGljIHZhbHVlTGFiZWwgPSAnVmFsdWUnO1xuICBASW5wdXQoKSBwdWJsaWMgc2hvd0NhcHRpb24gPSB0cnVlO1xuICBASW5wdXQoKSBwdWJsaWMgY2FwdGlvbkJlbG93ID0gdHJ1ZTtcbiAgQElucHV0KCkgcHVibGljIG1pblZhbHVlID0gMDtcbiAgQElucHV0KCkgcHVibGljIG1heFZhbHVlOiBudW1iZXI7XG4gIEBJbnB1dCgpIHB1YmxpYyBtaW5Db2xvciA9ICd3aGl0ZSc7XG4gIEBJbnB1dCgpIHB1YmxpYyBtYXhDb2xvciA9ICdyZWQnO1xuICBASW5wdXQoKSBwdWJsaWMgbm9EYXRhQ29sb3IgPSAnI0NGQ0ZDRic7XG4gIEBJbnB1dCgpIHB1YmxpYyBleGNlcHRpb25Db2xvciA9ICcjRkZFRTU4JztcblxuICBAT3V0cHV0KCkgcHVibGljIGNoYXJ0UmVhZHk6IEV2ZW50RW1pdHRlcjx2b2lkPjtcbiAgQE91dHB1dCgpIHB1YmxpYyBjaGFydEVycm9yOiBFdmVudEVtaXR0ZXI8Q2hhcnRFcnJvckV2ZW50PjtcbiAgQE91dHB1dCgpIHB1YmxpYyBjaGFydFNlbGVjdDogRXZlbnRFbWl0dGVyPENoYXJ0U2VsZWN0RXZlbnQ+O1xuXG4gIGdvb2dsZURhdGE6IFZhbGlkQ291bnRyeURhdGFbXVtdO1xuICB3cmFwcGVyOiBhbnk7XG4gIHNlbGVjdGlvbjogU2VsZWN0aW9uIHwgbnVsbCA9IG51bGw7XG4gIGxvYWRpbmcgPSB0cnVlO1xuICBnZXQgc2VsZWN0aW9uVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLnNlbGVjdGlvbi5jb3VudHJ5SWRdLnZhbHVlO1xuICB9XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBsb2FkZXJTZXJ2aWNlOiBHb29nbGVDaGFydHNMb2FkZXJTZXJ2aWNlXG4gICkge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLmxvYWRlclNlcnZpY2UgPSBsb2FkZXJTZXJ2aWNlO1xuICAgIHRoaXMuY2hhcnRTZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgdGhpcy5jaGFydFJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIHRoaXMuY2hhcnRFcnJvciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RXh0cmFTZWxlY3RlZChjb3VudHJ5OiBzdHJpbmcpOiBTZWxlY3Rpb25FeHRyYVtdIHwgbnVsbCB7XG4gICAgY29uc3QgeyBleHRyYSB9ID0gdGhpcy5kYXRhW2NvdW50cnldO1xuICAgIHJldHVybiBleHRyYSAmJiBPYmplY3Qua2V5cyhleHRyYSkubWFwKGtleSA9PiAoeyBrZXksIHZhbDogZXh0cmFba2V5XSB9KSk7XG4gIH1cblxuICBwcml2YXRlIHNlbGVjdENvdW50cnkoY291bnRyeT86IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0aW9uID0gY291bnRyeSA/IHtcbiAgICAgIGNvdW50cnlJZDogY291bnRyeSxcbiAgICAgIGNvdW50cnlOYW1lOiBjb3VudHJ5TmFtZShjb3VudHJ5KSxcbiAgICAgIGV4dHJhOiB0aGlzLmdldEV4dHJhU2VsZWN0ZWQoY291bnRyeSlcbiAgICB9IDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGEgdGFibGUgKG9iamVjdCkgZm9ybWF0dGVkIGFzXG4gICAqIGB7IEdCOiB7IHZhbHVlOjEyMywgLi4ub3RoZXJkYXRhIH0sIEVTOiB7IHZhbHVlOjQ1NiwgLi4ud2hhdGV2ZXIgfSB9YFxuICAgKiB0byBhbiBhcnJheSBmb3IgR29vZ2xlIENoYXJ0cyBmb3JtYXR0ZWQgYXNcbiAgICogYFsgWydDb3VudHJ5JywgJ1ZhbHVlJ10sIFsnR0InLCAxMjNdLCBbJ0VTJywgNDU2XSBdYFxuICAgKiBhbmQgc2F2ZSB0byB0aGlzLnByb2Nlc3NlZERhdGFcbiAgICovXG4gIHByaXZhdGUgcHJvY2Vzc0lucHV0RGF0YSgpOiB2b2lkIHtcbiAgICB0aGlzLmdvb2dsZURhdGEgPSBPYmplY3QuZW50cmllcyh0aGlzLmRhdGEpLnJlZHVjZSgoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG4gICAgICBjb25zdCByYXdWYWxDb250ZW50ID0gdmFsW3ZhbHVlSG9sZGVyXTtcbiAgICAgIGFjYy5wdXNoKFtrZXksIHJhd1ZhbENvbnRlbnQgPT09IG51bGwgPyBudWxsIDogcmF3VmFsQ29udGVudCA/ICtyYXdWYWxDb250ZW50LnRvU3RyaW5nKCkgOiAwXSk7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIFtbJ0NvdW50cnknLCAnVmFsdWUnXV0gYXMgVmFsaWRDb3VudHJ5RGF0YVtdW10pO1xuICB9XG5cbiAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCBrZXkgPSAnZGF0YSc7XG4gICAgaWYgKGNoYW5nZXNba2V5XSkge1xuXG4gICAgICBpZiAoIXRoaXMuZGF0YSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICBjb2xvckF4aXM6IHtcbiAgICAgICAgICBjb2xvcnM6IFt0aGlzLm1pbkNvbG9yLCB0aGlzLm1heENvbG9yXSxcbiAgICAgICAgICBtaW5WYWx1ZTogTnVtYmVyLmlzSW50ZWdlcih0aGlzLm1pblZhbHVlKSA/IHRoaXMubWluVmFsdWUgOiB1bmRlZmluZWQsXG4gICAgICAgICAgbWF4VmFsdWU6IE51bWJlci5pc0ludGVnZXIodGhpcy5tYXhWYWx1ZSkgPyB0aGlzLm1heFZhbHVlIDogdW5kZWZpbmVkXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGFsZXNzUmVnaW9uQ29sb3I6IHRoaXMubm9EYXRhQ29sb3IsXG4gICAgICAgIGRlZmF1bHRDb2xvcjogdGhpcy5leGNlcHRpb25Db2xvcixcbiAgICAgICAgbGVnZW5kOiB0aGlzLnNob3dDYXB0aW9uLFxuICAgICAgICB0b29sdGlwOiB7IHRyaWdnZXI6ICdub25lJyB9XG4gICAgICB9O1xuXG4gICAgICB0aGlzLmxvYWRlclNlcnZpY2UubG9hZCh0aGlzLmFwaUtleSkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0lucHV0RGF0YSgpO1xuXG4gICAgICAgIHRoaXMud3JhcHBlciA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFdyYXBwZXIoe1xuICAgICAgICAgIGNoYXJ0VHlwZTogJ0dlb0NoYXJ0JyxcbiAgICAgICAgICBkYXRhVGFibGU6IHRoaXMuZ29vZ2xlRGF0YSxcbiAgICAgICAgICBvcHRpb25zOiBPYmplY3QuYXNzaWduKGRlZmF1bHRPcHRpb25zLCB0aGlzLm9wdGlvbnMpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJDaGFydFdyYXBwZXJFdmVudHMoKTtcbiAgICAgICAgdGhpcy5yZWRyYXcoKTtcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5vbkNoYXJ0ZXJyb3IoeyBpZDogQ2hhckVycm9yQ29kZS5sb2FkaW5nLCBtZXNzYWdlOiAnQ291bGQgbm90IGxvYWQnIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlZHJhdygpOiB2b2lkIHtcbiAgICB0aGlzLndyYXBwZXIuZHJhdyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmNtLW1hcC1jb250ZW50JykpO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkNoYXJ0UmVhZHkoKTogdm9pZCB7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5jaGFydFJlYWR5LmVtaXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgb25DaGFydGVycm9yKGVycm9yOiBDaGFydEVycm9yRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmNoYXJ0RXJyb3IuZW1pdChlcnJvcik7XG4gIH1cblxuICBwcml2YXRlIG9uTWFwU2VsZWN0KCk6IHZvaWQge1xuICAgIGNvbnN0IGV2ZW50OiBDaGFydFNlbGVjdEV2ZW50ID0ge1xuICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgdmFsdWU6IG51bGwsXG4gICAgICBjb3VudHJ5OiBudWxsXG4gICAgfTtcblxuICAgIGNvbnN0IHNlbGVjdGlvbjogYW55W10gPSB0aGlzLndyYXBwZXIudmlzdWFsaXphdGlvbi5nZXRTZWxlY3Rpb24oKTtcblxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgeyByb3c6IHRhYmxlUm93IH06IHsgcm93OiBudW1iZXIgfSA9IHNlbGVjdGlvblswXTtcbiAgICAgIGNvbnN0IGRhdGFUYWJsZSA9IHRoaXMud3JhcHBlci5nZXREYXRhVGFibGUoKTtcblxuICAgICAgZXZlbnQuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgZXZlbnQudmFsdWUgPSBkYXRhVGFibGUuZ2V0VmFsdWUodGFibGVSb3csIDEpO1xuICAgICAgZXZlbnQuY291bnRyeSA9IGRhdGFUYWJsZS5nZXRWYWx1ZSh0YWJsZVJvdywgMCk7XG4gICAgICB0aGlzLnNlbGVjdENvdW50cnkoZXZlbnQuY291bnRyeSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RDb3VudHJ5KG51bGwpO1xuICAgIH1cblxuICAgIHRoaXMuY2hhcnRTZWxlY3QuZW1pdChldmVudCk7XG4gIH1cblxuICBwcml2YXRlIHJlZ2lzdGVyQ2hhcnRXcmFwcGVyRXZlbnRzKCk6IHZvaWQge1xuICAgIGNvbnN0IHsgYWRkTGlzdGVuZXIgfSA9IGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cztcbiAgICBhZGRMaXN0ZW5lcih0aGlzLndyYXBwZXIsICdyZWFkeScsIHRoaXMub25DaGFydFJlYWR5LmJpbmQodGhpcykpO1xuICAgIGFkZExpc3RlbmVyKHRoaXMud3JhcHBlciwgJ2Vycm9yJywgdGhpcy5vbkNoYXJ0ZXJyb3IuYmluZCh0aGlzKSk7XG4gICAgYWRkTGlzdGVuZXIodGhpcy53cmFwcGVyLCAnc2VsZWN0JywgdGhpcy5vbk1hcFNlbGVjdC5iaW5kKHRoaXMpKTtcbiAgfVxuXG59XG4iXX0=