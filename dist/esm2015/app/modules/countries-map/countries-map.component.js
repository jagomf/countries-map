import { __decorate } from "tslib";
import { Component, ElementRef, OnChanges, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
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
CountriesMapComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: GoogleChartsLoaderService }
];
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
export { CountriesMapComponent };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9jb3VudHJpZXMtbWFwLyIsInNvdXJjZXMiOlsiYXBwL21vZHVsZXMvY291bnRyaWVzLW1hcC9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sYUFBYSxFQUNiLFlBQVksRUFDYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUMzRSxPQUFPLEVBQXFDLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBRTVGLE9BQU8sRUFBRSxFQUFFLElBQUksV0FBVyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFMUQsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDO0FBQzVCLE1BQU0sV0FBVyxHQUFHLENBQUMsV0FBbUIsRUFBVSxFQUFFO0lBQ2xELE9BQU8sV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2xDLENBQUMsQ0FBQzs7QUFPRixJQUFhLHFCQUFxQixHQUFsQyxNQUFhLHFCQUFxQjtJQTRCaEMsWUFDVSxFQUFjLEVBQ2QsYUFBd0M7UUFEeEMsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGtCQUFhLEdBQWIsYUFBYSxDQUEyQjtRQXpCbEMsaUJBQVksR0FBRyxTQUFTLENBQUM7UUFDekIsZUFBVSxHQUFHLE9BQU8sQ0FBQztRQUNyQixnQkFBVyxHQUFHLElBQUksQ0FBQztRQUNuQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBRWIsYUFBUSxHQUFHLE9BQU8sQ0FBQztRQUNuQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGdCQUFXLEdBQUcsU0FBUyxDQUFDO1FBQ3hCLG1CQUFjLEdBQUcsU0FBUyxDQUFDO1FB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Q2pFLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7Q0FFRixDQUFBOztZQXhIZSxVQUFVO1lBQ0MseUJBQXlCOztBQTVCekM7SUFBUixLQUFLLEVBQUU7bURBQTRCO0FBQzNCO0lBQVIsS0FBSyxFQUFFO3FEQUF1QjtBQUN0QjtJQUFSLEtBQUssRUFBRTtzREFBcUI7QUFDcEI7SUFBUixLQUFLLEVBQUU7MkRBQWlDO0FBQ2hDO0lBQVIsS0FBSyxFQUFFO3lEQUE2QjtBQUM1QjtJQUFSLEtBQUssRUFBRTswREFBMkI7QUFDMUI7SUFBUixLQUFLLEVBQUU7MkRBQTRCO0FBQzNCO0lBQVIsS0FBSyxFQUFFO3VEQUFxQjtBQUNwQjtJQUFSLEtBQUssRUFBRTt1REFBeUI7QUFDeEI7SUFBUixLQUFLLEVBQUU7dURBQTJCO0FBQzFCO0lBQVIsS0FBSyxFQUFFO3VEQUF5QjtBQUN4QjtJQUFSLEtBQUssRUFBRTswREFBZ0M7QUFDL0I7SUFBUixLQUFLLEVBQUU7NkRBQW1DO0FBRWpDO0lBQVQsTUFBTSxFQUFFO3lEQUF1QztBQUN0QztJQUFULE1BQU0sRUFBRTt5REFBa0Q7QUFDakQ7SUFBVCxNQUFNLEVBQUU7MERBQW9EO0FBbEJsRCxxQkFBcUI7SUFMakMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGVBQWU7UUFDekIsc3ZDQUE2Qzs7S0FFOUMsQ0FBQztHQUNXLHFCQUFxQixDQXFKakM7U0FySlkscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiZGVjbGFyZSB2YXIgZ29vZ2xlOiBhbnk7XHJcblxyXG5pbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBFbGVtZW50UmVmLFxyXG4gIE9uQ2hhbmdlcyxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgU2ltcGxlQ2hhbmdlcyxcclxuICBFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgR29vZ2xlQ2hhcnRzTG9hZGVyU2VydmljZSB9IGZyb20gJy4vZ29vZ2xlLWNoYXJ0cy1sb2FkZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IENoYXJ0U2VsZWN0RXZlbnQsIENoYXJ0RXJyb3JFdmVudCwgQ2hhckVycm9yQ29kZSB9IGZyb20gJy4vY2hhcnQtZXZlbnRzLmludGVyZmFjZSc7XHJcbmltcG9ydCB7IENvdW50cmllc0RhdGEsIFNlbGVjdGlvbkV4dHJhLCBTZWxlY3Rpb24sIFZhbGlkQ291bnRyeURhdGEgfSBmcm9tICcuL2RhdGEtdHlwZXMuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgZW4gYXMgY291bnRyaWVzRU4gfSBmcm9tICdAamFnb21mL2NvdW50cmllc2xpc3QnO1xyXG5cclxuY29uc3QgdmFsdWVIb2xkZXIgPSAndmFsdWUnO1xyXG5jb25zdCBjb3VudHJ5TmFtZSA9IChjb3VudHJ5Q29kZTogc3RyaW5nKTogc3RyaW5nID0+IHtcclxuICByZXR1cm4gY291bnRyaWVzRU5bY291bnRyeUNvZGVdO1xyXG59O1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdjb3VudHJpZXMtbWFwJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vY291bnRyaWVzLW1hcC5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vY291bnRyaWVzLW1hcC5jb21wb25lbnQuY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIENvdW50cmllc01hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XHJcblxyXG4gIEBJbnB1dCgpIHB1YmxpYyBkYXRhOiBDb3VudHJpZXNEYXRhO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBhcGlLZXk6IHN0cmluZztcclxuICBASW5wdXQoKSBwdWJsaWMgb3B0aW9uczogYW55O1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBjb3VudHJ5TGFiZWwgPSAnQ291bnRyeSc7XHJcbiAgQElucHV0KCkgcHVibGljIHZhbHVlTGFiZWwgPSAnVmFsdWUnO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBzaG93Q2FwdGlvbiA9IHRydWU7XHJcbiAgQElucHV0KCkgcHVibGljIGNhcHRpb25CZWxvdyA9IHRydWU7XHJcbiAgQElucHV0KCkgcHVibGljIG1pblZhbHVlID0gMDtcclxuICBASW5wdXQoKSBwdWJsaWMgbWF4VmFsdWU6IG51bWJlcjtcclxuICBASW5wdXQoKSBwdWJsaWMgbWluQ29sb3IgPSAnd2hpdGUnO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBtYXhDb2xvciA9ICdyZWQnO1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBub0RhdGFDb2xvciA9ICcjQ0ZDRkNGJztcclxuICBASW5wdXQoKSBwdWJsaWMgZXhjZXB0aW9uQ29sb3IgPSAnI0ZGRUU1OCc7XHJcblxyXG4gIEBPdXRwdXQoKSBwdWJsaWMgY2hhcnRSZWFkeTogRXZlbnRFbWl0dGVyPHZvaWQ+O1xyXG4gIEBPdXRwdXQoKSBwdWJsaWMgY2hhcnRFcnJvcjogRXZlbnRFbWl0dGVyPENoYXJ0RXJyb3JFdmVudD47XHJcbiAgQE91dHB1dCgpIHB1YmxpYyBjaGFydFNlbGVjdDogRXZlbnRFbWl0dGVyPENoYXJ0U2VsZWN0RXZlbnQ+O1xyXG5cclxuICBnb29nbGVEYXRhOiBWYWxpZENvdW50cnlEYXRhW11bXTtcclxuICB3cmFwcGVyOiBhbnk7XHJcbiAgc2VsZWN0aW9uOiBTZWxlY3Rpb24gfCBudWxsID0gbnVsbDtcclxuICBsb2FkaW5nID0gdHJ1ZTtcclxuICBnZXQgc2VsZWN0aW9uVmFsdWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuc2VsZWN0aW9uLmNvdW50cnlJZF0udmFsdWU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxyXG4gICAgcHJpdmF0ZSBsb2FkZXJTZXJ2aWNlOiBHb29nbGVDaGFydHNMb2FkZXJTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgICB0aGlzLmVsID0gZWw7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2UgPSBsb2FkZXJTZXJ2aWNlO1xyXG4gICAgdGhpcy5jaGFydFNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuY2hhcnRSZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIHRoaXMuY2hhcnRFcnJvciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0RXh0cmFTZWxlY3RlZChjb3VudHJ5OiBzdHJpbmcpOiBTZWxlY3Rpb25FeHRyYVtdIHwgbnVsbCB7XHJcbiAgICBjb25zdCB7IGV4dHJhIH0gPSB0aGlzLmRhdGFbY291bnRyeV07XHJcbiAgICByZXR1cm4gZXh0cmEgJiYgT2JqZWN0LmtleXMoZXh0cmEpLm1hcChrZXkgPT4gKHsga2V5LCB2YWw6IGV4dHJhW2tleV0gfSkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZWxlY3RDb3VudHJ5KGNvdW50cnk/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0aW9uID0gY291bnRyeSA/IHtcclxuICAgICAgY291bnRyeUlkOiBjb3VudHJ5LFxyXG4gICAgICBjb3VudHJ5TmFtZTogY291bnRyeU5hbWUoY291bnRyeSksXHJcbiAgICAgIGV4dHJhOiB0aGlzLmdldEV4dHJhU2VsZWN0ZWQoY291bnRyeSlcclxuICAgIH0gOiBudWxsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ29udmVydCBhIHRhYmxlIChvYmplY3QpIGZvcm1hdHRlZCBhc1xyXG4gICAqIGB7IEdCOiB7IHZhbHVlOjEyMywgLi4ub3RoZXJkYXRhIH0sIEVTOiB7IHZhbHVlOjQ1NiwgLi4ud2hhdGV2ZXIgfSB9YFxyXG4gICAqIHRvIGFuIGFycmF5IGZvciBHb29nbGUgQ2hhcnRzIGZvcm1hdHRlZCBhc1xyXG4gICAqIGBbIFsnQ291bnRyeScsICdWYWx1ZSddLCBbJ0dCJywgMTIzXSwgWydFUycsIDQ1Nl0gXWBcclxuICAgKiBhbmQgc2F2ZSB0byB0aGlzLnByb2Nlc3NlZERhdGFcclxuICAgKi9cclxuICBwcml2YXRlIHByb2Nlc3NJbnB1dERhdGEoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdvb2dsZURhdGEgPSBPYmplY3QuZW50cmllcyh0aGlzLmRhdGEpLnJlZHVjZSgoYWNjLCBba2V5LCB2YWxdKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJhd1ZhbENvbnRlbnQgPSB2YWxbdmFsdWVIb2xkZXJdO1xyXG4gICAgICBhY2MucHVzaChba2V5LCByYXdWYWxDb250ZW50ID09PSBudWxsID8gbnVsbCA6IHJhd1ZhbENvbnRlbnQgPyArcmF3VmFsQ29udGVudC50b1N0cmluZygpIDogMF0pO1xyXG4gICAgICByZXR1cm4gYWNjO1xyXG4gICAgfSwgW1snQ291bnRyeScsICdWYWx1ZSddXSBhcyBWYWxpZENvdW50cnlEYXRhW11bXSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgY29uc3Qga2V5ID0gJ2RhdGEnO1xyXG4gICAgaWYgKGNoYW5nZXNba2V5XSkge1xyXG5cclxuICAgICAgaWYgKCF0aGlzLmRhdGEpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgICAgIGNvbG9yQXhpczoge1xyXG4gICAgICAgICAgY29sb3JzOiBbdGhpcy5taW5Db2xvciwgdGhpcy5tYXhDb2xvcl0sXHJcbiAgICAgICAgICBtaW5WYWx1ZTogTnVtYmVyLmlzSW50ZWdlcih0aGlzLm1pblZhbHVlKSA/IHRoaXMubWluVmFsdWUgOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICBtYXhWYWx1ZTogTnVtYmVyLmlzSW50ZWdlcih0aGlzLm1heFZhbHVlKSA/IHRoaXMubWF4VmFsdWUgOiB1bmRlZmluZWRcclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhdGFsZXNzUmVnaW9uQ29sb3I6IHRoaXMubm9EYXRhQ29sb3IsXHJcbiAgICAgICAgZGVmYXVsdENvbG9yOiB0aGlzLmV4Y2VwdGlvbkNvbG9yLFxyXG4gICAgICAgIGxlZ2VuZDogdGhpcy5zaG93Q2FwdGlvbixcclxuICAgICAgICB0b29sdGlwOiB7IHRyaWdnZXI6ICdub25lJyB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB0aGlzLmxvYWRlclNlcnZpY2UubG9hZCh0aGlzLmFwaUtleSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzSW5wdXREYXRhKCk7XHJcblxyXG4gICAgICAgIHRoaXMud3JhcHBlciA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFdyYXBwZXIoe1xyXG4gICAgICAgICAgY2hhcnRUeXBlOiAnR2VvQ2hhcnQnLFxyXG4gICAgICAgICAgZGF0YVRhYmxlOiB0aGlzLmdvb2dsZURhdGEsXHJcbiAgICAgICAgICBvcHRpb25zOiBPYmplY3QuYXNzaWduKGRlZmF1bHRPcHRpb25zLCB0aGlzLm9wdGlvbnMpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJDaGFydFdyYXBwZXJFdmVudHMoKTtcclxuICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG4gICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5vbkNoYXJ0ZXJyb3IoeyBpZDogQ2hhckVycm9yQ29kZS5sb2FkaW5nLCBtZXNzYWdlOiAnQ291bGQgbm90IGxvYWQnIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyByZWRyYXcoKTogdm9pZCB7XHJcbiAgICB0aGlzLndyYXBwZXIuZHJhdyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmNtLW1hcC1jb250ZW50JykpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvbkNoYXJ0UmVhZHkoKTogdm9pZCB7XHJcbiAgICB0aGlzLmxvYWRpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuY2hhcnRSZWFkeS5lbWl0KCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9uQ2hhcnRlcnJvcihlcnJvcjogQ2hhcnRFcnJvckV2ZW50KTogdm9pZCB7XHJcbiAgICB0aGlzLmNoYXJ0RXJyb3IuZW1pdChlcnJvcik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9uTWFwU2VsZWN0KCk6IHZvaWQge1xyXG4gICAgY29uc3QgZXZlbnQ6IENoYXJ0U2VsZWN0RXZlbnQgPSB7XHJcbiAgICAgIHNlbGVjdGVkOiBmYWxzZSxcclxuICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgIGNvdW50cnk6IG51bGxcclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgc2VsZWN0aW9uOiBhbnlbXSA9IHRoaXMud3JhcHBlci52aXN1YWxpemF0aW9uLmdldFNlbGVjdGlvbigpO1xyXG5cclxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICBjb25zdCB7IHJvdzogdGFibGVSb3cgfTogeyByb3c6IG51bWJlciB9ID0gc2VsZWN0aW9uWzBdO1xyXG4gICAgICBjb25zdCBkYXRhVGFibGUgPSB0aGlzLndyYXBwZXIuZ2V0RGF0YVRhYmxlKCk7XHJcblxyXG4gICAgICBldmVudC5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgIGV2ZW50LnZhbHVlID0gZGF0YVRhYmxlLmdldFZhbHVlKHRhYmxlUm93LCAxKTtcclxuICAgICAgZXZlbnQuY291bnRyeSA9IGRhdGFUYWJsZS5nZXRWYWx1ZSh0YWJsZVJvdywgMCk7XHJcbiAgICAgIHRoaXMuc2VsZWN0Q291bnRyeShldmVudC5jb3VudHJ5KTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNlbGVjdENvdW50cnkobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jaGFydFNlbGVjdC5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVnaXN0ZXJDaGFydFdyYXBwZXJFdmVudHMoKTogdm9pZCB7XHJcbiAgICBjb25zdCB7IGFkZExpc3RlbmVyIH0gPSBnb29nbGUudmlzdWFsaXphdGlvbi5ldmVudHM7XHJcbiAgICBhZGRMaXN0ZW5lcih0aGlzLndyYXBwZXIsICdyZWFkeScsIHRoaXMub25DaGFydFJlYWR5LmJpbmQodGhpcykpO1xyXG4gICAgYWRkTGlzdGVuZXIodGhpcy53cmFwcGVyLCAnZXJyb3InLCB0aGlzLm9uQ2hhcnRlcnJvci5iaW5kKHRoaXMpKTtcclxuICAgIGFkZExpc3RlbmVyKHRoaXMud3JhcHBlciwgJ3NlbGVjdCcsIHRoaXMub25NYXBTZWxlY3QuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=