import { __decorate } from "tslib";
import { Component, ElementRef, OnChanges, Input, Output, OnDestroy, HostListener, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { GoogleChartsLoaderService } from './google-charts-loader.service';
import { CharErrorCode } from './chart-events.interface';
import { en as countriesEN } from '@jagomf/countrieslist';
const valueHolder = 'value';
const countryName = (countryCode) => {
    return countriesEN[countryCode];
};
const ɵ0 = countryName;
let CountriesMapComponent = class CountriesMapComponent {
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
        this.el = el;
        this.loaderService = loaderService;
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
            const defaultOptions = {
                colorAxis: {
                    colors: [this.minColor, this.maxColor],
                    minValue: Number.isInteger(this.minValue) ? this.minValue : undefined,
                    maxValue: Number.isInteger(this.maxValue) ? this.maxValue : undefined
                },
                datalessRegionColor: this.noDataColor,
                backgroundColor: this.backgroundColor,
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
                const self = this.el.nativeElement;
                this.proportion = self.clientHeight / self.clientWidth;
            }, () => {
                this.onCharterror({ id: CharErrorCode.loading, message: 'Could not load' });
            });
        }
    }
    redraw() {
        this.wrapper.draw(this.el.nativeElement.querySelector('div.cm-map-content'));
    }
    onChartReady() {
        this.innerLoading = false;
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
    ngOnDestroy() {
        const { removeListener } = google.visualization.events;
        removeListener('ready');
        removeListener('error');
        removeListener('select');
    }
};
CountriesMapComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
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
], CountriesMapComponent.prototype, "autoResize", void 0);
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
], CountriesMapComponent.prototype, "backgroundColor", void 0);
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
__decorate([
    ViewChild('mapContent', { static: false })
], CountriesMapComponent.prototype, "mapContent", void 0);
__decorate([
    HostListener('window:deviceorientation'),
    HostListener('window:resize')
], CountriesMapComponent.prototype, "screenSizeChanged", null);
CountriesMapComponent = __decorate([
    Component({
        selector: 'countries-map',
        changeDetection: ChangeDetectionStrategy.OnPush,
        template: "<div class=\"major-block loading\" *ngIf=\"loading\"><span class=\"text\">Loading map...</span></div>\r\n\r\n<div class=\"major-block cm-map-content\" #mapContent [ngClass]=\"{'goes-first': captionBelow}\"></div>\r\n\r\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\"\r\n  *ngIf=\"!loading && showCaption\">\r\n  <div class=\"cm-simple-caption\">\r\n    <div class=\"cm-country-label\">\r\n      <span class=\"cm-default-label\" *ngIf=\"!selection\">{{countryLabel}}</span>\r\n      <span class=\"cm-country-name\" *ngIf=\"selection\">{{selection?.countryName}}</span>\r\n    </div>\r\n    <div class=\"cm-value-label\">\r\n      <span class=\"cm-value-text\"\r\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}<span *ngIf=\"selection\">: </span></span>\r\n      <span class=\"cm-value-content\" *ngIf=\"selection\">{{selectionValue}}</span>\r\n    </div>\r\n  </div>\r\n  <div class=\"cm-extended-caption\" *ngIf=\"selection?.extra && selection?.extra.length > 0\">\r\n    <div *ngFor=\"let item of selection?.extra\" class=\"cm-extended-item\">\r\n      <span class=\"cm-extended-label\">{{item.key}}</span>:\r\n      <span class=\"cm-extended-value\">{{item.val}}</span>\r\n    </div>\r\n  </div>\r\n</div>\r\n",
        styles: [":host{display:flex;flex-flow:column nowrap;justify-content:space-between;align-items:stretch;align-content:stretch}.major-block.loading{flex:0 1 auto;align-self:center}.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{flex:0 1 auto;display:flex;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{flex:0 1 auto;align-self:flex-start}.cm-value-label{flex:0 1 auto;align-self:flex-end}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}"]
    })
], CountriesMapComponent);
export { CountriesMapComponent };
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9jb3VudHJpZXMtbWFwLyIsInNvdXJjZXMiOlsiYXBwL21vZHVsZXMvY291bnRyaWVzLW1hcC9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBSUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsU0FBUyxFQUNULEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULFlBQVksRUFDWixTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0UsT0FBTyxFQUFxQyxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUU1RixPQUFPLEVBQUUsRUFBRSxJQUFJLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTFELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQztBQUM1QixNQUFNLFdBQVcsR0FBRyxDQUFDLFdBQW1CLEVBQVUsRUFBRTtJQUNsRCxPQUFPLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUM7O0FBUUYsSUFBYSxxQkFBcUIsR0FBbEMsTUFBYSxxQkFBcUI7SUF1Q2hDLFlBQ21CLEtBQXdCLEVBQ3hCLEVBQWMsRUFDZCxhQUF3QztRQUZ4QyxVQUFLLEdBQUwsS0FBSyxDQUFtQjtRQUN4QixPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2Qsa0JBQWEsR0FBYixhQUFhLENBQTJCO1FBckNsRCxpQkFBWSxHQUFHLFNBQVMsQ0FBQztRQUN6QixlQUFVLEdBQUcsT0FBTyxDQUFDO1FBQ3JCLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ25CLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFDbkIsYUFBUSxHQUFHLENBQUMs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b250ZW50IjpbImRlY2xhcmUgdmFyIGdvb2dsZTogeyB2aXN1YWxpemF0aW9uOiB7IENoYXJ0V3JhcHBlciwgZXZlbnRzOiB7XHJcbiAgYWRkTGlzdGVuZXI6ICh3cmFwcGVyLCBldmVudDogc3RyaW5nLCBjYWxsYmFjazogKGFyZ3M/OiBhbnkpID0+IHZvaWQpID0+IHZvaWQsIHJlbW92ZUxpc3RlbmVyOiAoZXZlbnQ6IHN0cmluZykgPT4gdm9pZFxyXG59IH0gfTtcclxuXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBPbkRlc3Ryb3ksXHJcbiAgSG9zdExpc3RlbmVyLFxyXG4gIFZpZXdDaGlsZCxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBDaGFuZ2VEZXRlY3RvclJlZixcclxuICBFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgR29vZ2xlQ2hhcnRzTG9hZGVyU2VydmljZSB9IGZyb20gJy4vZ29vZ2xlLWNoYXJ0cy1sb2FkZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IENoYXJ0U2VsZWN0RXZlbnQsIENoYXJ0RXJyb3JFdmVudCwgQ2hhckVycm9yQ29kZSB9IGZyb20gJy4vY2hhcnQtZXZlbnRzLmludGVyZmFjZSc7XHJcbmltcG9ydCB7IENvdW50cmllc0RhdGEsIFNlbGVjdGlvbkV4dHJhLCBTZWxlY3Rpb24sIFZhbGlkQ291bnRyeURhdGEgfSBmcm9tICcuL2RhdGEtdHlwZXMuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgZW4gYXMgY291bnRyaWVzRU4gfSBmcm9tICdAamFnb21mL2NvdW50cmllc2xpc3QnO1xyXG5cclxuY29uc3QgdmFsdWVIb2xkZXIgPSAndmFsdWUnO1xyXG5jb25zdCBjb3VudHJ5TmFtZSA9IChjb3VudHJ5Q29kZTogc3RyaW5nKTogc3RyaW5nID0+IHtcclxuICByZXR1cm4gY291bnRyaWVzRU5bY291bnRyeUNvZGVdO1xyXG59O1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdjb3VudHJpZXMtbWFwJyxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxuICB0ZW1wbGF0ZVVybDogJy4vY291bnRyaWVzLW1hcC5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vY291bnRyaWVzLW1hcC5jb21wb25lbnQuY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIENvdW50cmllc01hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcclxuXHJcbiAgQElucHV0KCkgZGF0YTogQ291bnRyaWVzRGF0YTtcclxuICBASW5wdXQoKSBhcGlLZXk6IHN0cmluZztcclxuICBASW5wdXQoKSBvcHRpb25zOiBhbnk7XHJcbiAgQElucHV0KCkgY291bnRyeUxhYmVsID0gJ0NvdW50cnknO1xyXG4gIEBJbnB1dCgpIHZhbHVlTGFiZWwgPSAnVmFsdWUnO1xyXG4gIEBJbnB1dCgpIHNob3dDYXB0aW9uID0gdHJ1ZTtcclxuICBASW5wdXQoKSBjYXB0aW9uQmVsb3cgPSB0cnVlO1xyXG4gIEBJbnB1dCgpIGF1dG9SZXNpemUgPSBmYWxzZTtcclxuICBASW5wdXQoKSBtaW5WYWx1ZSA9IDA7XHJcbiAgQElucHV0KCkgbWF4VmFsdWU6IG51bWJlcjtcclxuICBASW5wdXQoKSBtaW5Db2xvciA9ICd3aGl0ZSc7XHJcbiAgQElucHV0KCkgbWF4Q29sb3IgPSAncmVkJztcclxuICBASW5wdXQoKSBiYWNrZ3JvdW5kQ29sb3IgPSAnd2hpdGUnO1xyXG4gIEBJbnB1dCgpIG5vRGF0YUNvbG9yID0gJyNDRkNGQ0YnO1xyXG4gIEBJbnB1dCgpIGV4Y2VwdGlvbkNvbG9yID0gJyNGRkVFNTgnO1xyXG5cclxuICBAT3V0cHV0KCkgcHJpdmF0ZSByZWFkb25seSBjaGFydFJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xyXG4gIEBPdXRwdXQoKSBwcml2YXRlIHJlYWRvbmx5IGNoYXJ0RXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0RXJyb3JFdmVudD4oKTtcclxuICBAT3V0cHV0KCkgcHJpdmF0ZSByZWFkb25seSBjaGFydFNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRTZWxlY3RFdmVudD4oKTtcclxuXHJcbiAgQFZpZXdDaGlsZCgnbWFwQ29udGVudCcsIHsgc3RhdGljOiBmYWxzZSB9KSBwcml2YXRlIHJlYWRvbmx5IG1hcENvbnRlbnQ6IEVsZW1lbnRSZWY7XHJcblxyXG4gIHByaXZhdGUgcHJvcG9ydGlvbjogbnVtYmVyO1xyXG4gIHByaXZhdGUgZ29vZ2xlRGF0YTogVmFsaWRDb3VudHJ5RGF0YVtdW107XHJcbiAgcHJpdmF0ZSB3cmFwcGVyOiBhbnk7XHJcblxyXG4gIHNlbGVjdGlvbjogU2VsZWN0aW9uIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gIHByaXZhdGUgaW5uZXJMb2FkaW5nID0gdHJ1ZTtcclxuICBnZXQgbG9hZGluZygpIHtcclxuICAgIHJldHVybiB0aGlzLmlubmVyTG9hZGluZztcclxuICB9XHJcblxyXG4gIGdldCBzZWxlY3Rpb25WYWx1ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5zZWxlY3Rpb24uY291bnRyeUlkXS52YWx1ZTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGVsOiBFbGVtZW50UmVmLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBsb2FkZXJTZXJ2aWNlOiBHb29nbGVDaGFydHNMb2FkZXJTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgICB0aGlzLmVsID0gZWw7XHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2UgPSBsb2FkZXJTZXJ2aWNlO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OmRldmljZW9yaWVudGF0aW9uJylcclxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6cmVzaXplJylcclxuICBzY3JlZW5TaXplQ2hhbmdlZCgpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5sb2FkaW5nICYmIHRoaXMuYXV0b1Jlc2l6ZSkge1xyXG4gICAgICBjb25zdCBtYXA6IEhUTUxFbGVtZW50ID0gdGhpcy5tYXBDb250ZW50Lm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICAgIG1hcC5zdHlsZS5zZXRQcm9wZXJ0eSgnaGVpZ2h0JywgYCR7bWFwLmNsaWVudFdpZHRoICogdGhpcy5wcm9wb3J0aW9ufXB4YCk7XHJcbiAgICAgIHRoaXMucmVkcmF3KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldEV4dHJhU2VsZWN0ZWQoY291bnRyeTogc3RyaW5nKTogU2VsZWN0aW9uRXh0cmFbXSB8IG51bGwge1xyXG4gICAgY29uc3QgeyBleHRyYSB9ID0gdGhpcy5kYXRhW2NvdW50cnldO1xyXG4gICAgcmV0dXJuIGV4dHJhICYmIE9iamVjdC5rZXlzKGV4dHJhKS5tYXAoa2V5ID0+ICh7IGtleSwgdmFsOiBleHRyYVtrZXldIH0pKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2VsZWN0Q291bnRyeShjb3VudHJ5Pzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdGlvbiA9IGNvdW50cnkgPyB7XHJcbiAgICAgIGNvdW50cnlJZDogY291bnRyeSxcclxuICAgICAgY291bnRyeU5hbWU6IGNvdW50cnlOYW1lKGNvdW50cnkpLFxyXG4gICAgICBleHRyYTogdGhpcy5nZXRFeHRyYVNlbGVjdGVkKGNvdW50cnkpXHJcbiAgICB9IDogbnVsbDtcclxuICAgIHRoaXMuY2RSZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ29udmVydCBhIHRhYmxlIChvYmplY3QpIGZvcm1hdHRlZCBhc1xyXG4gICAqIGB7IEdCOiB7IHZhbHVlOjEyMywgLi4ub3RoZXJkYXRhIH0sIEVTOiB7IHZhbHVlOjQ1NiwgLi4ud2hhdGV2ZXIgfSB9YFxyXG4gICAqIHRvIGFuIGFycmF5IGZvciBHb29nbGUgQ2hhcnRzIGZvcm1hdHRlZCBhc1xyXG4gICAqIGBbIFsnQ291bnRyeScsICdWYWx1ZSddLCBbJ0dCJywgMTIzXSwgWydFUycsIDQ1Nl0gXWBcclxuICAgKiBhbmQgc2F2ZSB0byB0aGlzLnByb2Nlc3NlZERhdGFcclxuICAgKi9cclxuICBwcml2YXRlIHByb2Nlc3NJbnB1dERhdGEoKTogdm9pZCB7XHJcbiAgICB0aGlzLmdvb2dsZURhdGEgPSBPYmplY3QuZW50cmllcyh0aGlzLmRhdGEpLnJlZHVjZSgoYWNjLCBba2V5LCB2YWxdKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJhd1ZhbENvbnRlbnQgPSB2YWxbdmFsdWVIb2xkZXJdO1xyXG4gICAgICBhY2MucHVzaChba2V5LCByYXdWYWxDb250ZW50ID09PSBudWxsID8gbnVsbCA6IHJhd1ZhbENvbnRlbnQgPyArcmF3VmFsQ29udGVudC50b1N0cmluZygpIDogMF0pO1xyXG4gICAgICByZXR1cm4gYWNjO1xyXG4gICAgfSwgW1snQ291bnRyeScsICdWYWx1ZSddXSBhcyBWYWxpZENvdW50cnlEYXRhW11bXSk7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyh7IGRhdGEgfTogeyBkYXRhOiBhbnkgfSk6IHZvaWQge1xyXG4gICAgaWYgKGRhdGEpIHtcclxuXHJcbiAgICAgIGlmICghdGhpcy5kYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcclxuICAgICAgICBjb2xvckF4aXM6IHtcclxuICAgICAgICAgIGNvbG9yczogW3RoaXMubWluQ29sb3IsIHRoaXMubWF4Q29sb3JdLFxyXG4gICAgICAgICAgbWluVmFsdWU6IE51bWJlci5pc0ludGVnZXIodGhpcy5taW5WYWx1ZSkgPyB0aGlzLm1pblZhbHVlIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgbWF4VmFsdWU6IE51bWJlci5pc0ludGVnZXIodGhpcy5tYXhWYWx1ZSkgPyB0aGlzLm1heFZhbHVlIDogdW5kZWZpbmVkXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXRhbGVzc1JlZ2lvbkNvbG9yOiB0aGlzLm5vRGF0YUNvbG9yLFxyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5iYWNrZ3JvdW5kQ29sb3IsXHJcbiAgICAgICAgZGVmYXVsdENvbG9yOiB0aGlzLmV4Y2VwdGlvbkNvbG9yLFxyXG4gICAgICAgIGxlZ2VuZDogdGhpcy5zaG93Q2FwdGlvbixcclxuICAgICAgICB0b29sdGlwOiB7IHRyaWdnZXI6ICdub25lJyB9XHJcbiAgICAgIH07XHJcblxyXG4gICAgICB0aGlzLmxvYWRlclNlcnZpY2UubG9hZCh0aGlzLmFwaUtleSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzSW5wdXREYXRhKCk7XHJcblxyXG4gICAgICAgIHRoaXMud3JhcHBlciA9IG5ldyBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFdyYXBwZXIoe1xyXG4gICAgICAgICAgY2hhcnRUeXBlOiAnR2VvQ2hhcnQnLFxyXG4gICAgICAgICAgZGF0YVRhYmxlOiB0aGlzLmdvb2dsZURhdGEsXHJcbiAgICAgICAgICBvcHRpb25zOiBPYmplY3QuYXNzaWduKGRlZmF1bHRPcHRpb25zLCB0aGlzLm9wdGlvbnMpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJDaGFydFdyYXBwZXJFdmVudHMoKTtcclxuICAgICAgICB0aGlzLnJlZHJhdygpO1xyXG5cclxuICAgICAgICBjb25zdCBzZWxmOiBIVE1MRWxlbWVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcclxuICAgICAgICB0aGlzLnByb3BvcnRpb24gPSBzZWxmLmNsaWVudEhlaWdodCAvIHNlbGYuY2xpZW50V2lkdGg7XHJcbiAgICAgIH0sICgpID0+IHtcclxuICAgICAgICB0aGlzLm9uQ2hhcnRlcnJvcih7IGlkOiBDaGFyRXJyb3JDb2RlLmxvYWRpbmcsIG1lc3NhZ2U6ICdDb3VsZCBub3QgbG9hZCcgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVkcmF3KCk6IHZvaWQge1xyXG4gICAgdGhpcy53cmFwcGVyLmRyYXcodGhpcy5lbC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5jbS1tYXAtY29udGVudCcpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25DaGFydFJlYWR5KCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbm5lckxvYWRpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuY2hhcnRSZWFkeS5lbWl0KCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9uQ2hhcnRlcnJvcihlcnJvcjogQ2hhcnRFcnJvckV2ZW50KTogdm9pZCB7XHJcbiAgICB0aGlzLmNoYXJ0RXJyb3IuZW1pdChlcnJvcik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9uTWFwU2VsZWN0KCk6IHZvaWQge1xyXG4gICAgY29uc3QgZXZlbnQ6IENoYXJ0U2VsZWN0RXZlbnQgPSB7XHJcbiAgICAgIHNlbGVjdGVkOiBmYWxzZSxcclxuICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgIGNvdW50cnk6IG51bGxcclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgc2VsZWN0aW9uOiBhbnlbXSA9IHRoaXMud3JhcHBlci52aXN1YWxpemF0aW9uLmdldFNlbGVjdGlvbigpO1xyXG5cclxuICAgIGlmIChzZWxlY3Rpb24ubGVuZ3RoID4gMCkge1xyXG4gICAgICBjb25zdCB7IHJvdzogdGFibGVSb3cgfTogeyByb3c6IG51bWJlciB9ID0gc2VsZWN0aW9uWzBdO1xyXG4gICAgICBjb25zdCBkYXRhVGFibGUgPSB0aGlzLndyYXBwZXIuZ2V0RGF0YVRhYmxlKCk7XHJcblxyXG4gICAgICBldmVudC5zZWxlY3RlZCA9IHRydWU7XHJcbiAgICAgIGV2ZW50LnZhbHVlID0gZGF0YVRhYmxlLmdldFZhbHVlKHRhYmxlUm93LCAxKTtcclxuICAgICAgZXZlbnQuY291bnRyeSA9IGRhdGFUYWJsZS5nZXRWYWx1ZSh0YWJsZVJvdywgMCk7XHJcbiAgICAgIHRoaXMuc2VsZWN0Q291bnRyeShldmVudC5jb3VudHJ5KTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNlbGVjdENvdW50cnkobnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jaGFydFNlbGVjdC5lbWl0KGV2ZW50KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVnaXN0ZXJDaGFydFdyYXBwZXJFdmVudHMoKTogdm9pZCB7XHJcbiAgICBjb25zdCB7IGFkZExpc3RlbmVyIH0gPSBnb29nbGUudmlzdWFsaXphdGlvbi5ldmVudHM7XHJcbiAgICBhZGRMaXN0ZW5lcih0aGlzLndyYXBwZXIsICdyZWFkeScsIHRoaXMub25DaGFydFJlYWR5LmJpbmQodGhpcykpO1xyXG4gICAgYWRkTGlzdGVuZXIodGhpcy53cmFwcGVyLCAnZXJyb3InLCB0aGlzLm9uQ2hhcnRlcnJvci5iaW5kKHRoaXMpKTtcclxuICAgIGFkZExpc3RlbmVyKHRoaXMud3JhcHBlciwgJ3NlbGVjdCcsIHRoaXMub25NYXBTZWxlY3QuYmluZCh0aGlzKSk7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpIHtcclxuICAgIGNvbnN0IHsgcmVtb3ZlTGlzdGVuZXIgfSA9IGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cztcclxuICAgIHJlbW92ZUxpc3RlbmVyKCdyZWFkeScpO1xyXG4gICAgcmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJyk7XHJcbiAgICByZW1vdmVMaXN0ZW5lcignc2VsZWN0Jyk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=