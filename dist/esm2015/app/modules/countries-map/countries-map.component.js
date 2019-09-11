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
     * Pasar de una tabla en forma
     * `{ GB: { value:123, ...otherdata }, ES: { value:456, ...whatever } }`
     * a un array para Google Charts en forma
     * `[ ['Country', 'Value'], ['GB', 123], ['ES', 456] ]`
     * y almacernarlo en this.processedData
     */
    processInputData() {
        this.googleData = Object.entries(this.data).reduce((acc, [key, val]) => {
            const rawValContent = val[valueHolder];
            if (rawValContent) {
                const valContent = rawValContent.toString();
                acc.push([key, valContent]);
            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9jb3VudHJpZXMtbWFwLyIsInNvdXJjZXMiOlsiYXBwL21vZHVsZXMvY291bnRyaWVzLW1hcC9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBRVYsS0FBSyxFQUNMLE1BQU0sRUFFTixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0UsT0FBTyxFQUFxQyxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUU1RixPQUFPLEVBQUUsRUFBRSxJQUFJLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTFELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQztBQUM1QixNQUFNLFdBQVcsR0FBRyxDQUFDLFdBQW1CLEVBQVUsRUFBRTtJQUNsRCxPQUFPLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUM7O0FBT0YsSUFBYSxxQkFBcUIsR0FBbEMsTUFBYSxxQkFBcUI7SUE0QmhDLFlBQ1UsRUFBYyxFQUNkLGFBQXdDO1FBRHhDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxrQkFBYSxHQUFiLGFBQWEsQ0FBMkI7UUF6QmxDLGlCQUFZLEdBQUcsU0FBUyxDQUFDO1FBQ3pCLGVBQVUsR0FBRyxPQUFPLENBQUM7UUFDckIsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFDbkIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsYUFBUSxHQUFHLENBQUMsQ0FBQztRQUViLGFBQVEsR0FBRyxPQUFPLENBQUM7UUFDbkIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixnQkFBVyxHQUFHLFNBQVMsQ0FBQztRQUN4QixtQkFBYyxHQUFHLFNBQVMsQ0FBQztRQVEzQyxjQUFTLEdBQXFCLElBQUks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WSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7Q0FFRixDQUFBO0FBdEpVO0lBQVIsS0FBSyxFQUFFOzttREFBNEI7QUFDM0I7SUFBUixLQUFLLEVBQUU7O3FEQUF1QjtBQUN0QjtJQUFSLEtBQUssRUFBRTs7c0RBQXFCO0FBQ3BCO0lBQVIsS0FBSyxFQUFFOzsyREFBaUM7QUFDaEM7SUFBUixLQUFLLEVBQUU7O3lEQUE2QjtBQUM1QjtJQUFSLEtBQUssRUFBRTs7MERBQTJCO0FBQzFCO0lBQVIsS0FBSyxFQUFFOzsyREFBNEI7QUFDM0I7SUFBUixLQUFLLEVBQUU7O3VEQUFxQjtBQUNwQjtJQUFSLEtBQUssRUFBRTs7dURBQXlCO0FBQ3hCO0lBQVIsS0FBSyxFQUFFOzt1REFBMkI7QUFDMUI7SUFBUixLQUFLLEVBQUU7O3VEQUF5QjtBQUN4QjtJQUFSLEtBQUssRUFBRTs7MERBQWdDO0FBQy9CO0lBQVIsS0FBSyxFQUFFOzs2REFBbUM7QUFFakM7SUFBVCxNQUFNLEVBQUU7c0NBQW9CLFlBQVk7eURBQU87QUFDdEM7SUFBVCxNQUFNLEVBQUU7c0NBQW9CLFlBQVk7eURBQWtCO0FBQ2pEO0lBQVQsTUFBTSxFQUFFO3NDQUFxQixZQUFZOzBEQUFtQjtBQWxCbEQscUJBQXFCO0lBTGpDLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxlQUFlO1FBQ3pCLHNzQ0FBNkM7O0tBRTlDLENBQUM7NkNBOEJjLFVBQVU7UUFDQyx5QkFBeUI7R0E5QnZDLHFCQUFxQixDQXdKakM7U0F4SlkscUJBQXFCIiwic291cmNlc0NvbnRlbnQiOlsiZGVjbGFyZSB2YXIgZ29vZ2xlOiBhbnk7XG5cbmltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgT25DaGFuZ2VzLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBFdmVudEVtaXR0ZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBHb29nbGVDaGFydHNMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi9nb29nbGUtY2hhcnRzLWxvYWRlci5zZXJ2aWNlJztcbmltcG9ydCB7IENoYXJ0U2VsZWN0RXZlbnQsIENoYXJ0RXJyb3JFdmVudCwgQ2hhckVycm9yQ29kZSB9IGZyb20gJy4vY2hhcnQtZXZlbnRzLmludGVyZmFjZSc7XG5pbXBvcnQgeyBDb3VudHJpZXNEYXRhLCBTZWxlY3Rpb25FeHRyYSwgU2VsZWN0aW9uIH0gZnJvbSAnLi9kYXRhLXR5cGVzLmludGVyZmFjZSc7XG5pbXBvcnQgeyBlbiBhcyBjb3VudHJpZXNFTiB9IGZyb20gJ0BqYWdvbWYvY291bnRyaWVzbGlzdCc7XG5cbmNvbnN0IHZhbHVlSG9sZGVyID0gJ3ZhbHVlJztcbmNvbnN0IGNvdW50cnlOYW1lID0gKGNvdW50cnlDb2RlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICByZXR1cm4gY291bnRyaWVzRU5bY291bnRyeUNvZGVdO1xufTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY291bnRyaWVzLW1hcCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vY291bnRyaWVzLW1hcC5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgQ291bnRyaWVzTWFwQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcblxuICBASW5wdXQoKSBwdWJsaWMgZGF0YTogQ291bnRyaWVzRGF0YTtcbiAgQElucHV0KCkgcHVibGljIGFwaUtleTogc3RyaW5nO1xuICBASW5wdXQoKSBwdWJsaWMgb3B0aW9uczogYW55O1xuICBASW5wdXQoKSBwdWJsaWMgY291bnRyeUxhYmVsID0gJ0NvdW50cnknO1xuICBASW5wdXQoKSBwdWJsaWMgdmFsdWVMYWJlbCA9ICdWYWx1ZSc7XG4gIEBJbnB1dCgpIHB1YmxpYyBzaG93Q2FwdGlvbiA9IHRydWU7XG4gIEBJbnB1dCgpIHB1YmxpYyBjYXB0aW9uQmVsb3cgPSB0cnVlO1xuICBASW5wdXQoKSBwdWJsaWMgbWluVmFsdWUgPSAwO1xuICBASW5wdXQoKSBwdWJsaWMgbWF4VmFsdWU6IG51bWJlcjtcbiAgQElucHV0KCkgcHVibGljIG1pbkNvbG9yID0gJ3doaXRlJztcbiAgQElucHV0KCkgcHVibGljIG1heENvbG9yID0gJ3JlZCc7XG4gIEBJbnB1dCgpIHB1YmxpYyBub0RhdGFDb2xvciA9ICcjQ0ZDRkNGJztcbiAgQElucHV0KCkgcHVibGljIGV4Y2VwdGlvbkNvbG9yID0gJyNGRkVFNTgnO1xuXG4gIEBPdXRwdXQoKSBwdWJsaWMgY2hhcnRSZWFkeTogRXZlbnRFbWl0dGVyPHZvaWQ+O1xuICBAT3V0cHV0KCkgcHVibGljIGNoYXJ0RXJyb3I6IEV2ZW50RW1pdHRlcjxDaGFydEVycm9yRXZlbnQ+O1xuICBAT3V0cHV0KCkgcHVibGljIGNoYXJ0U2VsZWN0OiBFdmVudEVtaXR0ZXI8Q2hhcnRTZWxlY3RFdmVudD47XG5cbiAgZ29vZ2xlRGF0YTogc3RyaW5nW11bXTtcbiAgd3JhcHBlcjogYW55O1xuICBzZWxlY3Rpb246IFNlbGVjdGlvbiB8IG51bGwgPSBudWxsO1xuICBsb2FkaW5nID0gdHJ1ZTtcbiAgZ2V0IHNlbGVjdGlvblZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5zZWxlY3Rpb24uY291bnRyeUlkXS52YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgbG9hZGVyU2VydmljZTogR29vZ2xlQ2hhcnRzTG9hZGVyU2VydmljZVxuICApIHtcbiAgICB0aGlzLmVsID0gZWw7XG4gICAgdGhpcy5sb2FkZXJTZXJ2aWNlID0gbG9hZGVyU2VydmljZTtcbiAgICB0aGlzLmNoYXJ0U2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIHRoaXMuY2hhcnRSZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICB0aGlzLmNoYXJ0RXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIH1cblxuICBwcml2YXRlIGdldEV4dHJhU2VsZWN0ZWQoY291bnRyeTogc3RyaW5nKTogU2VsZWN0aW9uRXh0cmFbXSB8IG51bGwge1xuICAgIGNvbnN0IHsgZXh0cmEgfSA9IHRoaXMuZGF0YVtjb3VudHJ5XTtcbiAgICByZXR1cm4gZXh0cmEgJiYgT2JqZWN0LmtleXMoZXh0cmEpLm1hcChrZXkgPT4gKHsga2V5LCB2YWw6IGV4dHJhW2tleV0gfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZWxlY3RDb3VudHJ5KGNvdW50cnk/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdGlvbiA9IGNvdW50cnkgPyB7XG4gICAgICBjb3VudHJ5SWQ6IGNvdW50cnksXG4gICAgICBjb3VudHJ5TmFtZTogY291bnRyeU5hbWUoY291bnRyeSksXG4gICAgICBleHRyYTogdGhpcy5nZXRFeHRyYVNlbGVjdGVkKGNvdW50cnkpXG4gICAgfSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUGFzYXIgZGUgdW5hIHRhYmxhIGVuIGZvcm1hXG4gICAqIGB7IEdCOiB7IHZhbHVlOjEyMywgLi4ub3RoZXJkYXRhIH0sIEVTOiB7IHZhbHVlOjQ1NiwgLi4ud2hhdGV2ZXIgfSB9YFxuICAgKiBhIHVuIGFycmF5IHBhcmEgR29vZ2xlIENoYXJ0cyBlbiBmb3JtYVxuICAgKiBgWyBbJ0NvdW50cnknLCAnVmFsdWUnXSwgWydHQicsIDEyM10sIFsnRVMnLCA0NTZdIF1gXG4gICAqIHkgYWxtYWNlcm5hcmxvIGVuIHRoaXMucHJvY2Vzc2VkRGF0YVxuICAgKi9cbiAgcHJpdmF0ZSBwcm9jZXNzSW5wdXREYXRhKCk6IHZvaWQge1xuICAgIHRoaXMuZ29vZ2xlRGF0YSA9IE9iamVjdC5lbnRyaWVzKHRoaXMuZGF0YSkucmVkdWNlKChhY2MsIFtrZXksIHZhbF0pID0+IHtcbiAgICAgIGNvbnN0IHJhd1ZhbENvbnRlbnQgPSB2YWxbdmFsdWVIb2xkZXJdXG4gICAgICBpZiAocmF3VmFsQ29udGVudCkge1xuICAgICAgICBjb25zdCB2YWxDb250ZW50ID0gcmF3VmFsQ29udGVudC50b1N0cmluZygpO1xuICAgICAgICBhY2MucHVzaChba2V5LCB2YWxDb250ZW50XSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIFtbJ0NvdW50cnknLCAnVmFsdWUnXV0pO1xuICB9XG5cbiAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCBrZXkgPSAnZGF0YSc7XG4gICAgaWYgKGNoYW5nZXNba2V5XSkge1xuXG4gICAgICBpZiAoIXRoaXMuZGF0YSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICBjb2xvckF4aXM6IHtcbiAgICAgICAgICBjb2xvcnM6IFt0aGlzLm1pbkNvbG9yLCB0aGlzLm1heENvbG9yXSxcbiAgICAgICAgICBtaW5WYWx1ZTogTnVtYmVyLmlzSW50ZWdlcih0aGlzLm1pblZhbHVlKSA/IHRoaXMubWluVmFsdWUgOiB1bmRlZmluZWQsXG4gICAgICAgICAgbWF4VmFsdWU6IE51bWJlci5pc0ludGVnZXIodGhpcy5tYXhWYWx1ZSkgPyB0aGlzLm1heFZhbHVlIDogdW5kZWZpbmVkXG4gICAgICAgIH0sXG4gICAgICAgIGRhdGFsZXNzUmVnaW9uQ29sb3I6IHRoaXMubm9EYXRhQ29sb3IsXG4gICAgICAgIGRlZmF1bHRDb2xvcjogdGhpcy5leGNlcHRpb25Db2xvcixcbiAgICAgICAgbGVnZW5kOiB0aGlzLnNob3dDYXB0aW9uLFxuICAgICAgICB0b29sdGlwOiB7IHRyaWdnZXI6ICdub25lJyB9XG4gICAgICB9O1xuXG4gICAgICB0aGlzLmxvYWRlclNlcnZpY2UubG9hZCh0aGlzLmFwaUtleSkudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMucHJvY2Vzc0lucHV0RGF0YSgpO1xuXG4gICAgICAgIHRoaXMud3JhcHBlciA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFdyYXBwZXIoe1xuICAgICAgICAgIGNoYXJ0VHlwZTogJ0dlb0NoYXJ0JyxcbiAgICAgICAgICBkYXRhVGFibGU6IHRoaXMuZ29vZ2xlRGF0YSxcbiAgICAgICAgICBvcHRpb25zOiBPYmplY3QuYXNzaWduKGRlZmF1bHRPcHRpb25zLCB0aGlzLm9wdGlvbnMpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJDaGFydFdyYXBwZXJFdmVudHMoKTtcbiAgICAgICAgdGhpcy5yZWRyYXcoKTtcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5vbkNoYXJ0ZXJyb3IoeyBpZDogQ2hhckVycm9yQ29kZS5sb2FkaW5nLCBtZXNzYWdlOiAnQ291bGQgbm90IGxvYWQnIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlZHJhdygpOiB2b2lkIHtcbiAgICB0aGlzLndyYXBwZXIuZHJhdyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmNtLW1hcC1jb250ZW50JykpO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkNoYXJ0UmVhZHkoKTogdm9pZCB7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5jaGFydFJlYWR5LmVtaXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgb25DaGFydGVycm9yKGVycm9yOiBDaGFydEVycm9yRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmNoYXJ0RXJyb3IuZW1pdChlcnJvcik7XG4gIH1cblxuICBwcml2YXRlIG9uTWFwU2VsZWN0KCk6IHZvaWQge1xuICAgIGNvbnN0IGV2ZW50OiBDaGFydFNlbGVjdEV2ZW50ID0ge1xuICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgdmFsdWU6IG51bGwsXG4gICAgICBjb3VudHJ5OiBudWxsXG4gICAgfTtcblxuICAgIGNvbnN0IHNlbGVjdGlvbjogYW55W10gPSB0aGlzLndyYXBwZXIudmlzdWFsaXphdGlvbi5nZXRTZWxlY3Rpb24oKTtcblxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgeyByb3c6IHRhYmxlUm93IH06IHsgcm93OiBudW1iZXIgfSA9IHNlbGVjdGlvblswXTtcbiAgICAgIGNvbnN0IGRhdGFUYWJsZSA9IHRoaXMud3JhcHBlci5nZXREYXRhVGFibGUoKTtcblxuICAgICAgZXZlbnQuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgZXZlbnQudmFsdWUgPSBkYXRhVGFibGUuZ2V0VmFsdWUodGFibGVSb3csIDEpO1xuICAgICAgZXZlbnQuY291bnRyeSA9IGRhdGFUYWJsZS5nZXRWYWx1ZSh0YWJsZVJvdywgMCk7XG4gICAgICB0aGlzLnNlbGVjdENvdW50cnkoZXZlbnQuY291bnRyeSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RDb3VudHJ5KG51bGwpO1xuICAgIH1cblxuICAgIHRoaXMuY2hhcnRTZWxlY3QuZW1pdChldmVudCk7XG4gIH1cblxuICBwcml2YXRlIHJlZ2lzdGVyQ2hhcnRXcmFwcGVyRXZlbnRzKCk6IHZvaWQge1xuICAgIGNvbnN0IHsgYWRkTGlzdGVuZXIgfSA9IGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cztcbiAgICBhZGRMaXN0ZW5lcih0aGlzLndyYXBwZXIsICdyZWFkeScsIHRoaXMub25DaGFydFJlYWR5LmJpbmQodGhpcykpO1xuICAgIGFkZExpc3RlbmVyKHRoaXMud3JhcHBlciwgJ2Vycm9yJywgdGhpcy5vbkNoYXJ0ZXJyb3IuYmluZCh0aGlzKSk7XG4gICAgYWRkTGlzdGVuZXIodGhpcy53cmFwcGVyLCAnc2VsZWN0JywgdGhpcy5vbk1hcFNlbGVjdC5iaW5kKHRoaXMpKTtcbiAgfVxuXG59XG4iXX0=