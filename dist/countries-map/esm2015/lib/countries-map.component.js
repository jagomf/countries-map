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
                template: "<div class=\"major-block loading\" *ngIf=\"loading\"><span class=\"text\">Loading map...</span></div>\r\n\r\n<div class=\"major-block cm-map-content\" #mapContent [ngClass]=\"{'goes-first': captionBelow}\"></div>\r\n\r\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\"\r\n  *ngIf=\"!loading && showCaption\">\r\n  <div class=\"cm-simple-caption\">\r\n    <div class=\"cm-country-label\">\r\n      <span class=\"cm-default-label\" *ngIf=\"!selection\">{{countryLabel}}</span>\r\n      <span class=\"cm-country-name\" *ngIf=\"selection\">{{selection?.countryName}}</span>\r\n    </div>\r\n    <div class=\"cm-value-label\">\r\n      <span class=\"cm-value-text\"\r\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}<span *ngIf=\"selection\">: </span></span>\r\n      <span class=\"cm-value-content\" *ngIf=\"selection\">{{selectionValue}}</span>\r\n    </div>\r\n  </div>\r\n  <div class=\"cm-extended-caption\" *ngIf=\"selection?.extra && selection?.extra.length > 0\">\r\n    <div *ngFor=\"let item of selection?.extra\" class=\"cm-extended-item\">\r\n      <span class=\"cm-extended-label\">{{item.key}}</span>:\r\n      <span class=\"cm-extended-value\">{{item.val}}</span>\r\n    </div>\r\n  </div>\r\n</div>\r\n",
                styles: [":host{align-content:stretch;align-items:stretch;display:flex;flex-flow:column nowrap;justify-content:space-between}.major-block.loading{align-self:center;flex:0 1 auto}.major-block.loading .text{color:grey;font-family:sans-serif;font-style:italic}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{display:flex;flex:0 1 auto;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{align-self:flex-start;flex:0 1 auto}.cm-value-label{align-self:flex-end;flex:0 1 auto}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){color:#777;font-style:italic}.cm-extended-caption{display:grid;grid-gap:5px;grid-template-columns:repeat(auto-fill,minmax(120px,1fr))}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiTTovSmFnby9Eb2N1bWVudHMvY291bnRyaWVzLW1hcC9wcm9qZWN0cy9saWIvc3JjLyIsInNvdXJjZXMiOlsibGliL2NvdW50cmllcy1tYXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFFVixLQUFLLEVBQ0wsTUFBTSxFQUVOLFlBQVksRUFDWixTQUFTLEVBQ1QsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDM0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBR3pELE9BQU8sRUFBRSxFQUFFLElBQUksV0FBVyxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFMUQsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDO0FBQzVCLE1BQU0sV0FBVyxHQUFHLENBQUMsV0FBbUIsRUFBVSxFQUFFO0lBQ2xELE9BQU8sV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2xDLENBQUMsQ0FBQzs7QUFRRixNQUFNLE9BQU8scUJBQXFCO0lBdUNoQyxZQUNtQixLQUF3QixFQUN4QixFQUFjLEVBQ2QsYUFBd0M7UUFGeEMsVUFBSyxHQUFMLEtBQUssQ0FBbUI7UUFDeEIsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGtCQUFhLEdBQWIsYUFBYSxDQUEyQjtRQXJDbEQsaUJBQVksR0FBRyxTQUFTLENBQUM7UUFDekIsZUFBVSxHQUFHLE9BQU8sQ0FBQztRQUNyQixnQkFBVyxHQUFHLElBQUksQ0FBQztRQUNuQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixlQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ25CLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFFYixhQUFRLEdBQUcsT0FBTyxD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QUM7UUFDdkQsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hCLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QixjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDM0IsQ0FBQzs7O1lBak1GLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLGt3Q0FBNkM7O2FBRTlDOzs7WUFuQkMsaUJBQWlCO1lBUmpCLFVBQVU7WUFXSCx5QkFBeUI7OzttQkFtQi9CLEtBQUs7cUJBQ0wsS0FBSztzQkFDTCxLQUFLOzJCQUNMLEtBQUs7eUJBQ0wsS0FBSzswQkFDTCxLQUFLOzJCQUNMLEtBQUs7eUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3VCQUNMLEtBQUs7dUJBQ0wsS0FBSzt1QkFDTCxLQUFLOzhCQUNMLEtBQUs7MEJBQ0wsS0FBSzs2QkFDTCxLQUFLO3lCQUVMLE1BQU07eUJBQ04sTUFBTTswQkFDTixNQUFNO3lCQUVOLFNBQVMsU0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2dDQXdCekMsWUFBWSxTQUFDLDBCQUEwQixjQUN2QyxZQUFZLFNBQUMsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBPbkRlc3Ryb3ksXHJcbiAgSG9zdExpc3RlbmVyLFxyXG4gIFZpZXdDaGlsZCxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBDaGFuZ2VEZXRlY3RvclJlZixcclxuICBFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgR29vZ2xlQ2hhcnRzTG9hZGVyU2VydmljZSB9IGZyb20gJy4vZ29vZ2xlLWNoYXJ0cy1sb2FkZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IENoYXJFcnJvckNvZGUgfSBmcm9tICcuL2NoYXJ0LWV2ZW50cy5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgdHlwZSB7IENoYXJ0U2VsZWN0RXZlbnQsIENoYXJ0RXJyb3JFdmVudCB9IGZyb20gJy4vY2hhcnQtZXZlbnRzLmludGVyZmFjZSc7XHJcbmltcG9ydCB0eXBlIHsgQ291bnRyaWVzRGF0YSwgU2VsZWN0aW9uRXh0cmEsIFNlbGVjdGlvbiwgVmFsaWRDb3VudHJ5RGF0YSB9IGZyb20gJy4vZGF0YS10eXBlcy5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBlbiBhcyBjb3VudHJpZXNFTiB9IGZyb20gJ0BqYWdvbWYvY291bnRyaWVzbGlzdCc7XHJcblxyXG5jb25zdCB2YWx1ZUhvbGRlciA9ICd2YWx1ZSc7XHJcbmNvbnN0IGNvdW50cnlOYW1lID0gKGNvdW50cnlDb2RlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG4gIHJldHVybiBjb3VudHJpZXNFTltjb3VudHJ5Q29kZV07XHJcbn07XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2NvdW50cmllcy1tYXAnLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIENvdW50cmllc01hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcclxuXHJcbiAgQElucHV0KCkgZGF0YTogQ291bnRyaWVzRGF0YTtcclxuICBASW5wdXQoKSBhcGlLZXk6IHN0cmluZztcclxuICBASW5wdXQoKSBvcHRpb25zOiBhbnk7XHJcbiAgQElucHV0KCkgY291bnRyeUxhYmVsID0gJ0NvdW50cnknO1xyXG4gIEBJbnB1dCgpIHZhbHVlTGFiZWwgPSAnVmFsdWUnO1xyXG4gIEBJbnB1dCgpIHNob3dDYXB0aW9uID0gdHJ1ZTtcclxuICBASW5wdXQoKSBjYXB0aW9uQmVsb3cgPSB0cnVlO1xyXG4gIEBJbnB1dCgpIGF1dG9SZXNpemUgPSBmYWxzZTtcclxuICBASW5wdXQoKSBtaW5WYWx1ZSA9IDA7XHJcbiAgQElucHV0KCkgbWF4VmFsdWU6IG51bWJlcjtcclxuICBASW5wdXQoKSBtaW5Db2xvciA9ICd3aGl0ZSc7XHJcbiAgQElucHV0KCkgbWF4Q29sb3IgPSAncmVkJztcclxuICBASW5wdXQoKSBiYWNrZ3JvdW5kQ29sb3IgPSAnd2hpdGUnO1xyXG4gIEBJbnB1dCgpIG5vRGF0YUNvbG9yID0gJyNDRkNGQ0YnO1xyXG4gIEBJbnB1dCgpIGV4Y2VwdGlvbkNvbG9yID0gJyNGRkVFNTgnO1xyXG5cclxuICBAT3V0cHV0KCkgcHJpdmF0ZSByZWFkb25seSBjaGFydFJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xyXG4gIEBPdXRwdXQoKSBwcml2YXRlIHJlYWRvbmx5IGNoYXJ0RXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0RXJyb3JFdmVudD4oKTtcclxuICBAT3V0cHV0KCkgcHJpdmF0ZSByZWFkb25seSBjaGFydFNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRTZWxlY3RFdmVudD4oKTtcclxuXHJcbiAgQFZpZXdDaGlsZCgnbWFwQ29udGVudCcsIHsgc3RhdGljOiBmYWxzZSB9KSBwcml2YXRlIHJlYWRvbmx5IG1hcENvbnRlbnQ6IEVsZW1lbnRSZWY7XHJcblxyXG4gIHByaXZhdGUgcHJvcG9ydGlvbjogbnVtYmVyO1xyXG4gIHByaXZhdGUgZ29vZ2xlRGF0YTogVmFsaWRDb3VudHJ5RGF0YVtdW107XHJcbiAgcHJpdmF0ZSB3cmFwcGVyOiBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFdyYXBwZXI7XHJcblxyXG4gIHNlbGVjdGlvbjogU2VsZWN0aW9uIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gIHByaXZhdGUgaW5uZXJMb2FkaW5nID0gdHJ1ZTtcclxuICBnZXQgbG9hZGluZygpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmlubmVyTG9hZGluZztcclxuICB9XHJcblxyXG4gIGdldCBzZWxlY3Rpb25WYWx1ZSgpOiBWYWxpZENvdW50cnlEYXRhIHtcclxuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5zZWxlY3Rpb24uY291bnRyeUlkXS52YWx1ZTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBjZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGVsOiBFbGVtZW50UmVmLFxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBsb2FkZXJTZXJ2aWNlOiBHb29nbGVDaGFydHNMb2FkZXJTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6ZGV2aWNlb3JpZW50YXRpb24nKVxyXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnKVxyXG4gIHNjcmVlblNpemVDaGFuZ2VkKCk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLmxvYWRpbmcgJiYgdGhpcy5hdXRvUmVzaXplKSB7XHJcbiAgICAgIGNvbnN0IG1hcDogSFRNTEVsZW1lbnQgPSB0aGlzLm1hcENvbnRlbnQubmF0aXZlRWxlbWVudDtcclxuICAgICAgbWFwLnN0eWxlLnNldFByb3BlcnR5KCdoZWlnaHQnLCBgJHttYXAuY2xpZW50V2lkdGggKiB0aGlzLnByb3BvcnRpb259cHhgKTtcclxuICAgICAgdGhpcy5yZWRyYXcoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0RXh0cmFTZWxlY3RlZChjb3VudHJ5OiBzdHJpbmcpOiBTZWxlY3Rpb25FeHRyYVtdIHwgbnVsbCB7XHJcbiAgICBjb25zdCB7IGV4dHJhIH0gPSB0aGlzLmRhdGFbY291bnRyeV07XHJcbiAgICByZXR1cm4gZXh0cmEgJiYgT2JqZWN0LmtleXMoZXh0cmEpLm1hcChrZXkgPT4gKHsga2V5LCB2YWw6IGV4dHJhW2tleV0gfSkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZWxlY3RDb3VudHJ5KGNvdW50cnk/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0aW9uID0gY291bnRyeSA/IHtcclxuICAgICAgY291bnRyeUlkOiBjb3VudHJ5LFxyXG4gICAgICBjb3VudHJ5TmFtZTogY291bnRyeU5hbWUoY291bnRyeSksXHJcbiAgICAgIGV4dHJhOiB0aGlzLmdldEV4dHJhU2VsZWN0ZWQoY291bnRyeSlcclxuICAgIH0gOiBudWxsO1xyXG4gICAgdGhpcy5jZFJlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDb252ZXJ0IGEgdGFibGUgKG9iamVjdCkgZm9ybWF0dGVkIGFzXHJcbiAgICogYHsgR0I6IHsgdmFsdWU6MTIzLCAuLi5vdGhlcmRhdGEgfSwgRVM6IHsgdmFsdWU6NDU2LCAuLi53aGF0ZXZlciB9IH1gXHJcbiAgICogdG8gYW4gYXJyYXkgZm9yIEdvb2dsZSBDaGFydHMgZm9ybWF0dGVkIGFzXHJcbiAgICogYFsgWydDb3VudHJ5JywgJ1ZhbHVlJ10sIFsnR0InLCAxMjNdLCBbJ0VTJywgNDU2XSBdYFxyXG4gICAqIGFuZCBzYXZlIHRvIHRoaXMucHJvY2Vzc2VkRGF0YVxyXG4gICAqL1xyXG4gIHByaXZhdGUgcHJvY2Vzc0lucHV0RGF0YSgpOiB2b2lkIHtcclxuICAgIHRoaXMuZ29vZ2xlRGF0YSA9IE9iamVjdC5lbnRyaWVzKHRoaXMuZGF0YSkucmVkdWNlKChhY2MsIFtrZXksIHZhbF0pID0+IHtcclxuICAgICAgY29uc3QgcmF3VmFsQ29udGVudCA9IHZhbFt2YWx1ZUhvbGRlcl07XHJcbiAgICAgIGFjYy5wdXNoKFtrZXksIHJhd1ZhbENvbnRlbnQgPT09IG51bGwgPyBudWxsIDogcmF3VmFsQ29udGVudCA/ICtyYXdWYWxDb250ZW50LnRvU3RyaW5nKCkgOiAwXSk7XHJcbiAgICAgIHJldHVybiBhY2M7XHJcbiAgICB9LCBbWydDb3VudHJ5JywgJ1ZhbHVlJ11dIGFzIFZhbGlkQ291bnRyeURhdGFbXVtdKTtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKHsgZGF0YSB9OiB7IGRhdGE6IGFueSB9KTogdm9pZCB7XHJcbiAgICBpZiAoZGF0YSkge1xyXG5cclxuICAgICAgaWYgKCF0aGlzLmRhdGEpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZU1hcCh7XHJcbiAgICAgICAgLy8jcmVnaW9uIERFRkFVTFRTIChhdXRvbWF0aWNhbGx5IHNldCk6XHJcbiAgICAgICAgLy8gZGlzcGxheU1vZGU6ICdyZWdpb25zJyxcclxuICAgICAgICAvLyByZWdpb246ICd3b3JsZCcsXHJcbiAgICAgICAgLy8gZW5hYmxlUmVnaW9uSW50ZXJhY3Rpdml0eTogdHJ1ZSxcclxuICAgICAgICAvLyBrZWVwQXNwZWN0UmF0aW86IHRydWUsXHJcbiAgICAgICAgLy8jZW5kcmVnaW9uXHJcbiAgICAgICAgY29sb3JBeGlzOiB7XHJcbiAgICAgICAgICBjb2xvcnM6IFt0aGlzLm1pbkNvbG9yLCB0aGlzLm1heENvbG9yXSxcclxuICAgICAgICAgIG1pblZhbHVlOiBOdW1iZXIuaXNJbnRlZ2VyKHRoaXMubWluVmFsdWUpID8gdGhpcy5taW5WYWx1ZSA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgIG1heFZhbHVlOiBOdW1iZXIuaXNJbnRlZ2VyKHRoaXMubWF4VmFsdWUpID8gdGhpcy5tYXhWYWx1ZSA6IHVuZGVmaW5lZFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZGF0YWxlc3NSZWdpb25Db2xvcjogdGhpcy5ub0RhdGFDb2xvcixcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuYmFja2dyb3VuZENvbG9yLFxyXG4gICAgICAgIGRlZmF1bHRDb2xvcjogdGhpcy5leGNlcHRpb25Db2xvcixcclxuICAgICAgICBsZWdlbmQ6ICdub25lJyxcclxuICAgICAgICB0b29sdGlwOiB7IHRyaWdnZXI6ICdub25lJyB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhc3luYyBpbml0aWFsaXplTWFwKGRlZmF1bHRPcHRpb25zOiBnb29nbGUudmlzdWFsaXphdGlvbi5HZW9DaGFydE9wdGlvbnMpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGF3YWl0IHRoaXMubG9hZGVyU2VydmljZS5sb2FkKHRoaXMuYXBpS2V5KTtcclxuXHJcbiAgICAgIHRoaXMucHJvY2Vzc0lucHV0RGF0YSgpO1xyXG5cclxuICAgICAgdGhpcy53cmFwcGVyID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcih7XHJcbiAgICAgICAgY2hhcnRUeXBlOiAnR2VvQ2hhcnQnLFxyXG4gICAgICAgIGRhdGFUYWJsZTogdGhpcy5nb29nbGVEYXRhLFxyXG4gICAgICAgIG9wdGlvbnM6IE9iamVjdC5hc3NpZ24oZGVmYXVsdE9wdGlvbnMsIHRoaXMub3B0aW9ucylcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLnJlZ2lzdGVyQ2hhcnRXcmFwcGVyRXZlbnRzKCk7XHJcbiAgICAgIHRoaXMucmVkcmF3KCk7XHJcblxyXG4gICAgICBjb25zdCBzZWxmOiBIVE1MRWxlbWVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcclxuICAgICAgdGhpcy5wcm9wb3J0aW9uID0gc2VsZi5jbGllbnRIZWlnaHQgLyBzZWxmLmNsaWVudFdpZHRoO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICB0aGlzLm9uQ2hhcnRlcnJvcih7IGlkOiBDaGFyRXJyb3JDb2RlLmxvYWRpbmcsIG1lc3NhZ2U6ICdDb3VsZCBub3QgbG9hZCcgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZWRyYXcoKTogdm9pZCB7XHJcbiAgICB0aGlzLndyYXBwZXIuZHJhdyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmNtLW1hcC1jb250ZW50JykpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvbkNoYXJ0UmVhZHkoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5pbm5lckxvYWRpbmcpIHtcclxuICAgICAgdGhpcy5pbm5lckxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgdGhpcy5jaGFydFJlYWR5LmVtaXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25DaGFydGVycm9yKGVycm9yOiBDaGFydEVycm9yRXZlbnQpOiB2b2lkIHtcclxuICAgIHRoaXMuY2hhcnRFcnJvci5lbWl0KGVycm9yKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25NYXBTZWxlY3QoKTogdm9pZCB7XHJcbiAgICBjb25zdCBldmVudDogQ2hhcnRTZWxlY3RFdmVudCA9IHtcclxuICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxyXG4gICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgY291bnRyeTogbnVsbFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLndyYXBwZXIuZ2V0Q2hhcnQoKS5nZXRTZWxlY3Rpb24oKTtcclxuXHJcbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA+IDApIHtcclxuICAgICAgY29uc3QgeyByb3c6IHRhYmxlUm93IH0gPSBzZWxlY3Rpb25bMF07XHJcbiAgICAgIGNvbnN0IGRhdGFUYWJsZSA9IHRoaXMud3JhcHBlci5nZXREYXRhVGFibGUoKTtcclxuXHJcbiAgICAgIGV2ZW50LnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgZXZlbnQudmFsdWUgPSBkYXRhVGFibGUuZ2V0VmFsdWUodGFibGVSb3csIDEpO1xyXG4gICAgICBldmVudC5jb3VudHJ5ID0gZGF0YVRhYmxlLmdldFZhbHVlKHRhYmxlUm93LCAwKTtcclxuICAgICAgdGhpcy5zZWxlY3RDb3VudHJ5KGV2ZW50LmNvdW50cnkpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2VsZWN0Q291bnRyeShudWxsKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNoYXJ0U2VsZWN0LmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZWdpc3RlckNoYXJ0V3JhcHBlckV2ZW50cygpOiB2b2lkIHtcclxuICAgIGNvbnN0IHsgYWRkTGlzdGVuZXIgfSA9IGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cztcclxuICAgIGFkZExpc3RlbmVyKHRoaXMud3JhcHBlciwgJ3JlYWR5JywgdGhpcy5vbkNoYXJ0UmVhZHkuYmluZCh0aGlzKSk7XHJcbiAgICBhZGRMaXN0ZW5lcih0aGlzLndyYXBwZXIsICdlcnJvcicsIHRoaXMub25DaGFydGVycm9yLmJpbmQodGhpcykpO1xyXG4gICAgYWRkTGlzdGVuZXIodGhpcy53cmFwcGVyLCAnc2VsZWN0JywgdGhpcy5vbk1hcFNlbGVjdC5iaW5kKHRoaXMpKTtcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgY29uc3QgeyByZW1vdmVMaXN0ZW5lciB9ID0gZ29vZ2xlLnZpc3VhbGl6YXRpb24uZXZlbnRzO1xyXG4gICAgcmVtb3ZlTGlzdGVuZXIoJ3JlYWR5Jyk7XHJcbiAgICByZW1vdmVMaXN0ZW5lcignZXJyb3InKTtcclxuICAgIHJlbW92ZUxpc3RlbmVyKCdzZWxlY3QnKTtcclxuICB9XHJcblxyXG59XHJcbiJdfQ==