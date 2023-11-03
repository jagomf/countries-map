import { __awaiter } from "tslib";
import { Component, ElementRef, Input, Output, HostListener, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { GoogleChartsLoaderService } from './google-charts-loader.service';
import { CharErrorCode } from './chart-events.interface';
import { en as countriesEN } from '@jagomf/countrieslist';
const valueHolder = 'value';
const countryName = (countryCode) => {
    return countriesEN[countryCode];
};
const ɵ0 = countryName;
export class CountriesMapComponent {
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
                template: "<div class=\"major-block loading\" *ngIf=\"loading\"><span class=\"text\">Loading map...</span></div>\n\n<div class=\"major-block cm-map-content\" #mapContent [ngClass]=\"{'goes-first': captionBelow}\"></div>\n\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\"\n  *ngIf=\"!loading && showCaption\">\n  <div class=\"cm-simple-caption\">\n    <div class=\"cm-country-label\">\n      <span class=\"cm-default-label\" *ngIf=\"!selection\">{{countryLabel}}</span>\n      <span class=\"cm-country-name\" *ngIf=\"selection\">{{selection?.countryName}}</span>\n    </div>\n    <div class=\"cm-value-label\">\n      <span class=\"cm-value-text\"\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}<span *ngIf=\"selection\">: </span></span>\n      <span class=\"cm-value-content\" *ngIf=\"selection\">{{selectionValue}}</span>\n    </div>\n  </div>\n  <div class=\"cm-extended-caption\" *ngIf=\"selection?.extra && selection?.extra.length > 0\">\n    <div *ngFor=\"let item of selection?.extra\" class=\"cm-extended-item\">\n      <span class=\"cm-extended-label\">{{item.key}}</span>:\n      <span class=\"cm-extended-value\">{{item.val}}</span>\n    </div>\n  </div>\n</div>\n",
                styles: [":host{display:flex;flex-flow:column nowrap;justify-content:space-between;align-items:stretch;align-content:stretch}.major-block.loading{flex:0 1 auto;align-self:center}.major-block.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{flex:0 1 auto;display:flex;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{flex:0 1 auto;align-self:flex-start}.cm-value-label{flex:0 1 auto;align-self:flex-end}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:bold}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:bold}\n"]
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
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9saWIvc3JjL2xpYi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBRVYsS0FBSyxFQUNMLE1BQU0sRUFFTixZQUFZLEVBQ1osU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUd6RCxPQUFPLEVBQUUsRUFBRSxJQUFJLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRTFELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQztBQUM1QixNQUFNLFdBQVcsR0FBRyxDQUFDLFdBQW1CLEVBQVUsRUFBRTtJQUNsRCxPQUFPLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUM7O0FBUUYsTUFBTSxPQUFPLHFCQUFxQjtJQXVDaEMsWUFDbUIsS0FBd0IsRUFDeEIsRUFBYyxFQUNkLGFBQXdDO1FBRnhDLFVBQUssR0FBTCxLQUFLLENBQW1CO1FBQ3hCLE9BQUUsR0FBRixFQUFFLENBQVk7UUFDZCxrQkFBYSxHQUFiLGFBQWEsQ0FBMkI7UUFyQ2xELGlCQUFZLEdBQUcsU0FBUyxDQUFDO1FBQ3pCLGVBQVUsR0FBRyxPQUFPLENBQUM7UUFDckIsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFDbkIsaUJBQVksR0FBRyxJQUFJLENBQUM7UUFDcEIsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBRWIsYUFBUSxHQUFHLE9BQU8sQ0FBQztRQUNuQixhQUFRLEdBQUcs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QUFPLENBQUMsQ0FBQztRQUN4QixjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEIsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzNCLENBQUM7OztZQWpNRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxrdENBQTZDOzthQUU5Qzs7O1lBbkJDLGlCQUFpQjtZQVJqQixVQUFVO1lBV0gseUJBQXlCOzs7bUJBbUIvQixLQUFLO3FCQUNMLEtBQUs7c0JBQ0wsS0FBSzsyQkFDTCxLQUFLO3lCQUNMLEtBQUs7MEJBQ0wsS0FBSzsyQkFDTCxLQUFLO3lCQUNMLEtBQUs7dUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3VCQUNMLEtBQUs7dUJBQ0wsS0FBSzs4QkFDTCxLQUFLOzBCQUNMLEtBQUs7NkJBQ0wsS0FBSzt5QkFFTCxNQUFNO3lCQUNOLE1BQU07MEJBQ04sTUFBTTt5QkFFTixTQUFTLFNBQUMsWUFBWSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtnQ0F3QnpDLFlBQVksU0FBQywwQkFBMEIsY0FDdkMsWUFBWSxTQUFDLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIE9uQ2hhbmdlcyxcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgT25EZXN0cm95LFxuICBIb3N0TGlzdGVuZXIsXG4gIFZpZXdDaGlsZCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBFdmVudEVtaXR0ZXJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBHb29nbGVDaGFydHNMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi9nb29nbGUtY2hhcnRzLWxvYWRlci5zZXJ2aWNlJztcbmltcG9ydCB7IENoYXJFcnJvckNvZGUgfSBmcm9tICcuL2NoYXJ0LWV2ZW50cy5pbnRlcmZhY2UnO1xuaW1wb3J0IHR5cGUgeyBDaGFydFNlbGVjdEV2ZW50LCBDaGFydEVycm9yRXZlbnQgfSBmcm9tICcuL2NoYXJ0LWV2ZW50cy5pbnRlcmZhY2UnO1xuaW1wb3J0IHR5cGUgeyBDb3VudHJpZXNEYXRhLCBTZWxlY3Rpb25FeHRyYSwgU2VsZWN0aW9uLCBWYWxpZENvdW50cnlEYXRhIH0gZnJvbSAnLi9kYXRhLXR5cGVzLmludGVyZmFjZSc7XG5pbXBvcnQgeyBlbiBhcyBjb3VudHJpZXNFTiB9IGZyb20gJ0BqYWdvbWYvY291bnRyaWVzbGlzdCc7XG5cbmNvbnN0IHZhbHVlSG9sZGVyID0gJ3ZhbHVlJztcbmNvbnN0IGNvdW50cnlOYW1lID0gKGNvdW50cnlDb2RlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICByZXR1cm4gY291bnRyaWVzRU5bY291bnRyeUNvZGVdO1xufTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY291bnRyaWVzLW1hcCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB0ZW1wbGF0ZVVybDogJy4vY291bnRyaWVzLW1hcC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NvdW50cmllcy1tYXAuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBDb3VudHJpZXNNYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG5cbiAgQElucHV0KCkgZGF0YTogQ291bnRyaWVzRGF0YTtcbiAgQElucHV0KCkgYXBpS2V5OiBzdHJpbmc7XG4gIEBJbnB1dCgpIG9wdGlvbnM6IGFueTtcbiAgQElucHV0KCkgY291bnRyeUxhYmVsID0gJ0NvdW50cnknO1xuICBASW5wdXQoKSB2YWx1ZUxhYmVsID0gJ1ZhbHVlJztcbiAgQElucHV0KCkgc2hvd0NhcHRpb24gPSB0cnVlO1xuICBASW5wdXQoKSBjYXB0aW9uQmVsb3cgPSB0cnVlO1xuICBASW5wdXQoKSBhdXRvUmVzaXplID0gZmFsc2U7XG4gIEBJbnB1dCgpIG1pblZhbHVlID0gMDtcbiAgQElucHV0KCkgbWF4VmFsdWU6IG51bWJlcjtcbiAgQElucHV0KCkgbWluQ29sb3IgPSAnd2hpdGUnO1xuICBASW5wdXQoKSBtYXhDb2xvciA9ICdyZWQnO1xuICBASW5wdXQoKSBiYWNrZ3JvdW5kQ29sb3IgPSAnd2hpdGUnO1xuICBASW5wdXQoKSBub0RhdGFDb2xvciA9ICcjQ0ZDRkNGJztcbiAgQElucHV0KCkgZXhjZXB0aW9uQ29sb3IgPSAnI0ZGRUU1OCc7XG5cbiAgQE91dHB1dCgpIHByaXZhdGUgcmVhZG9ubHkgY2hhcnRSZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgQE91dHB1dCgpIHByaXZhdGUgcmVhZG9ubHkgY2hhcnRFcnJvciA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRFcnJvckV2ZW50PigpO1xuICBAT3V0cHV0KCkgcHJpdmF0ZSByZWFkb25seSBjaGFydFNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRTZWxlY3RFdmVudD4oKTtcblxuICBAVmlld0NoaWxkKCdtYXBDb250ZW50JywgeyBzdGF0aWM6IGZhbHNlIH0pIHByaXZhdGUgcmVhZG9ubHkgbWFwQ29udGVudDogRWxlbWVudFJlZjtcblxuICBwcml2YXRlIHByb3BvcnRpb246IG51bWJlcjtcbiAgcHJpdmF0ZSBnb29nbGVEYXRhOiBWYWxpZENvdW50cnlEYXRhW11bXTtcbiAgcHJpdmF0ZSB3cmFwcGVyOiBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFdyYXBwZXI7XG5cbiAgc2VsZWN0aW9uOiBTZWxlY3Rpb24gfCBudWxsID0gbnVsbDtcblxuICBwcml2YXRlIGlubmVyTG9hZGluZyA9IHRydWU7XG4gIGdldCBsb2FkaW5nKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlubmVyTG9hZGluZztcbiAgfVxuXG4gIGdldCBzZWxlY3Rpb25WYWx1ZSgpOiBWYWxpZENvdW50cnlEYXRhIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuc2VsZWN0aW9uLmNvdW50cnlJZF0udmFsdWU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNkUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIHJlYWRvbmx5IGVsOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgbG9hZGVyU2VydmljZTogR29vZ2xlQ2hhcnRzTG9hZGVyU2VydmljZVxuICApIHtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpkZXZpY2VvcmllbnRhdGlvbicpXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKVxuICBzY3JlZW5TaXplQ2hhbmdlZCgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubG9hZGluZyAmJiB0aGlzLmF1dG9SZXNpemUpIHtcbiAgICAgIGNvbnN0IG1hcDogSFRNTEVsZW1lbnQgPSB0aGlzLm1hcENvbnRlbnQubmF0aXZlRWxlbWVudDtcbiAgICAgIG1hcC5zdHlsZS5zZXRQcm9wZXJ0eSgnaGVpZ2h0JywgYCR7bWFwLmNsaWVudFdpZHRoICogdGhpcy5wcm9wb3J0aW9ufXB4YCk7XG4gICAgICB0aGlzLnJlZHJhdygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0RXh0cmFTZWxlY3RlZChjb3VudHJ5OiBzdHJpbmcpOiBTZWxlY3Rpb25FeHRyYVtdIHwgbnVsbCB7XG4gICAgY29uc3QgeyBleHRyYSB9ID0gdGhpcy5kYXRhW2NvdW50cnldO1xuICAgIHJldHVybiBleHRyYSAmJiBPYmplY3Qua2V5cyhleHRyYSkubWFwKGtleSA9PiAoeyBrZXksIHZhbDogZXh0cmFba2V5XSB9KSk7XG4gIH1cblxuICBwcml2YXRlIHNlbGVjdENvdW50cnkoY291bnRyeT86IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0aW9uID0gY291bnRyeSA/IHtcbiAgICAgIGNvdW50cnlJZDogY291bnRyeSxcbiAgICAgIGNvdW50cnlOYW1lOiBjb3VudHJ5TmFtZShjb3VudHJ5KSxcbiAgICAgIGV4dHJhOiB0aGlzLmdldEV4dHJhU2VsZWN0ZWQoY291bnRyeSlcbiAgICB9IDogbnVsbDtcbiAgICB0aGlzLmNkUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0IGEgdGFibGUgKG9iamVjdCkgZm9ybWF0dGVkIGFzXG4gICAqIGB7IEdCOiB7IHZhbHVlOjEyMywgLi4ub3RoZXJkYXRhIH0sIEVTOiB7IHZhbHVlOjQ1NiwgLi4ud2hhdGV2ZXIgfSB9YFxuICAgKiB0byBhbiBhcnJheSBmb3IgR29vZ2xlIENoYXJ0cyBmb3JtYXR0ZWQgYXNcbiAgICogYFsgWydDb3VudHJ5JywgJ1ZhbHVlJ10sIFsnR0InLCAxMjNdLCBbJ0VTJywgNDU2XSBdYFxuICAgKiBhbmQgc2F2ZSB0byB0aGlzLnByb2Nlc3NlZERhdGFcbiAgICovXG4gIHByaXZhdGUgcHJvY2Vzc0lucHV0RGF0YSgpOiB2b2lkIHtcbiAgICB0aGlzLmdvb2dsZURhdGEgPSBPYmplY3QuZW50cmllcyh0aGlzLmRhdGEpLnJlZHVjZSgoYWNjLCBba2V5LCB2YWxdKSA9PiB7XG4gICAgICBjb25zdCByYXdWYWxDb250ZW50ID0gdmFsW3ZhbHVlSG9sZGVyXTtcbiAgICAgIGFjYy5wdXNoKFtrZXksIHJhd1ZhbENvbnRlbnQgPT09IG51bGwgPyBudWxsIDogcmF3VmFsQ29udGVudCA/ICtyYXdWYWxDb250ZW50LnRvU3RyaW5nKCkgOiAwXSk7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIFtbJ0NvdW50cnknLCAnVmFsdWUnXV0gYXMgVmFsaWRDb3VudHJ5RGF0YVtdW10pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoeyBkYXRhIH06IHsgZGF0YTogYW55IH0pOiB2b2lkIHtcbiAgICBpZiAoZGF0YSkge1xuXG4gICAgICBpZiAoIXRoaXMuZGF0YSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaW5pdGlhbGl6ZU1hcCh7XG4gICAgICAgIC8vI3JlZ2lvbiBERUZBVUxUUyAoYXV0b21hdGljYWxseSBzZXQpOlxuICAgICAgICAvLyBkaXNwbGF5TW9kZTogJ3JlZ2lvbnMnLFxuICAgICAgICAvLyByZWdpb246ICd3b3JsZCcsXG4gICAgICAgIC8vIGVuYWJsZVJlZ2lvbkludGVyYWN0aXZpdHk6IHRydWUsXG4gICAgICAgIC8vIGtlZXBBc3BlY3RSYXRpbzogdHJ1ZSxcbiAgICAgICAgLy8jZW5kcmVnaW9uXG4gICAgICAgIGNvbG9yQXhpczoge1xuICAgICAgICAgIGNvbG9yczogW3RoaXMubWluQ29sb3IsIHRoaXMubWF4Q29sb3JdLFxuICAgICAgICAgIG1pblZhbHVlOiBOdW1iZXIuaXNJbnRlZ2VyKHRoaXMubWluVmFsdWUpID8gdGhpcy5taW5WYWx1ZSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBtYXhWYWx1ZTogTnVtYmVyLmlzSW50ZWdlcih0aGlzLm1heFZhbHVlKSA/IHRoaXMubWF4VmFsdWUgOiB1bmRlZmluZWRcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YWxlc3NSZWdpb25Db2xvcjogdGhpcy5ub0RhdGFDb2xvcixcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLmJhY2tncm91bmRDb2xvcixcbiAgICAgICAgZGVmYXVsdENvbG9yOiB0aGlzLmV4Y2VwdGlvbkNvbG9yLFxuICAgICAgICBsZWdlbmQ6ICdub25lJyxcbiAgICAgICAgdG9vbHRpcDogeyB0cmlnZ2VyOiAnbm9uZScgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBpbml0aWFsaXplTWFwKGRlZmF1bHRPcHRpb25zOiBnb29nbGUudmlzdWFsaXphdGlvbi5HZW9DaGFydE9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgdGhpcy5sb2FkZXJTZXJ2aWNlLmxvYWQodGhpcy5hcGlLZXkpO1xuXG4gICAgICB0aGlzLnByb2Nlc3NJbnB1dERhdGEoKTtcblxuICAgICAgdGhpcy53cmFwcGVyID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcih7XG4gICAgICAgIGNoYXJ0VHlwZTogJ0dlb0NoYXJ0JyxcbiAgICAgICAgZGF0YVRhYmxlOiB0aGlzLmdvb2dsZURhdGEsXG4gICAgICAgIG9wdGlvbnM6IE9iamVjdC5hc3NpZ24oZGVmYXVsdE9wdGlvbnMsIHRoaXMub3B0aW9ucylcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnJlZ2lzdGVyQ2hhcnRXcmFwcGVyRXZlbnRzKCk7XG4gICAgICB0aGlzLnJlZHJhdygpO1xuXG4gICAgICBjb25zdCBzZWxmOiBIVE1MRWxlbWVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgICAgIHRoaXMucHJvcG9ydGlvbiA9IHNlbGYuY2xpZW50SGVpZ2h0IC8gc2VsZi5jbGllbnRXaWR0aDtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLm9uQ2hhcnRlcnJvcih7IGlkOiBDaGFyRXJyb3JDb2RlLmxvYWRpbmcsIG1lc3NhZ2U6ICdDb3VsZCBub3QgbG9hZCcgfSk7XG4gICAgfVxuICB9XG5cbiAgcmVkcmF3KCk6IHZvaWQge1xuICAgIHRoaXMud3JhcHBlci5kcmF3KHRoaXMuZWwubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYuY20tbWFwLWNvbnRlbnQnKSk7XG4gIH1cblxuICBwcml2YXRlIG9uQ2hhcnRSZWFkeSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pbm5lckxvYWRpbmcpIHtcbiAgICAgIHRoaXMuaW5uZXJMb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLmNoYXJ0UmVhZHkuZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25DaGFydGVycm9yKGVycm9yOiBDaGFydEVycm9yRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmNoYXJ0RXJyb3IuZW1pdChlcnJvcik7XG4gIH1cblxuICBwcml2YXRlIG9uTWFwU2VsZWN0KCk6IHZvaWQge1xuICAgIGNvbnN0IGV2ZW50OiBDaGFydFNlbGVjdEV2ZW50ID0ge1xuICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgdmFsdWU6IG51bGwsXG4gICAgICBjb3VudHJ5OiBudWxsXG4gICAgfTtcblxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHRoaXMud3JhcHBlci5nZXRDaGFydCgpLmdldFNlbGVjdGlvbigpO1xuXG4gICAgaWYgKHNlbGVjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCB7IHJvdzogdGFibGVSb3cgfSA9IHNlbGVjdGlvblswXTtcbiAgICAgIGNvbnN0IGRhdGFUYWJsZSA9IHRoaXMud3JhcHBlci5nZXREYXRhVGFibGUoKTtcblxuICAgICAgZXZlbnQuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgZXZlbnQudmFsdWUgPSBkYXRhVGFibGUuZ2V0VmFsdWUodGFibGVSb3csIDEpO1xuICAgICAgZXZlbnQuY291bnRyeSA9IGRhdGFUYWJsZS5nZXRWYWx1ZSh0YWJsZVJvdywgMCk7XG4gICAgICB0aGlzLnNlbGVjdENvdW50cnkoZXZlbnQuY291bnRyeSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RDb3VudHJ5KG51bGwpO1xuICAgIH1cblxuICAgIHRoaXMuY2hhcnRTZWxlY3QuZW1pdChldmVudCk7XG4gIH1cblxuICBwcml2YXRlIHJlZ2lzdGVyQ2hhcnRXcmFwcGVyRXZlbnRzKCk6IHZvaWQge1xuICAgIGNvbnN0IHsgYWRkTGlzdGVuZXIgfSA9IGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cztcbiAgICBhZGRMaXN0ZW5lcih0aGlzLndyYXBwZXIsICdyZWFkeScsIHRoaXMub25DaGFydFJlYWR5LmJpbmQodGhpcykpO1xuICAgIGFkZExpc3RlbmVyKHRoaXMud3JhcHBlciwgJ2Vycm9yJywgdGhpcy5vbkNoYXJ0ZXJyb3IuYmluZCh0aGlzKSk7XG4gICAgYWRkTGlzdGVuZXIodGhpcy53cmFwcGVyLCAnc2VsZWN0JywgdGhpcy5vbk1hcFNlbGVjdC5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGNvbnN0IHsgcmVtb3ZlTGlzdGVuZXIgfSA9IGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cztcbiAgICByZW1vdmVMaXN0ZW5lcigncmVhZHknKTtcbiAgICByZW1vdmVMaXN0ZW5lcignZXJyb3InKTtcbiAgICByZW1vdmVMaXN0ZW5lcignc2VsZWN0Jyk7XG4gIH1cblxufVxuIl19