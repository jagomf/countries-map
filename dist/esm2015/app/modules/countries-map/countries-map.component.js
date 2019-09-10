import * as tslib_1 from "tslib";
import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { GoogleChartsLoaderService } from './google-charts-loader.service';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9jb3VudHJpZXMtbWFwLyIsInNvdXJjZXMiOlsiYXBwL21vZHVsZXMvY291bnRyaWVzLW1hcC9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBRVYsS0FBSyxFQUNMLE1BQU0sRUFFTixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFHM0UsT0FBTyxFQUFFLEVBQUUsSUFBSSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUUxRCxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUM7QUFDNUIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxXQUFtQixFQUFVLEVBQUU7SUFDbEQsT0FBTyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbEMsQ0FBQyxDQUFDOztBQU9GLElBQWEscUJBQXFCLEdBQWxDLE1BQWEscUJBQXFCO0lBNEJoQyxZQUNVLEVBQWMsRUFDZCxhQUF3QztRQUR4QyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2Qsa0JBQWEsR0FBYixhQUFhLENBQTJCO1FBekJsQyxpQkFBWSxHQUFHLFNBQVMsQ0FBQztRQUN6QixlQUFVLEdBQUcsT0FBTyxDQUFDO1FBQ3JCLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBQ25CLGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFFYixhQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ25CLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsZ0JBQVcsR0FBRyxTQUFTLENBQUM7UUFDeEIsbUJBQWMsR0FBRyxTQUFTLENBQUM7UUFRM0MsY0FBUyxHQUFxQixJQUFJLENBQUM7UUFDbkMsWUFBTyxHQUFHLElBQUksQ0FBQztRQVNiLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQWJELElBQUksY0FBYztRQUNoQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDbkQsQ0FBQztJQWFPLGdCQUFnQixDQUFDLE9BQWU7UUFDdEMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsT0FBTyxLQUFLLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVPLGFBQWEsQ0FBQyxPQUFnQjtRQUNwQyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDekIsU0FBUyxFQUFFLE9BQU87WUFDbEIsV0FBVyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUM7WUFDakMsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7U0FDdEMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ1gsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNLLGdCQUFnQjtRQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUMvRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2hELEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQVUsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNyQyxPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRU0sV0FBVyxDQUFDLE9BQXNCO1FBQ3ZDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQztRQUNuQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUVoQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTtnQkFDZCxPQUFPO2FBQ1I7WUFFRCxNQUFNLGNBQWMsR0FBRztnQkFDckIsU0FBUyxFQUFFO29CQUNULE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDdEMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTO29CQUNyRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVM7aUJBQ3RFO2dCQUNELG1CQUFtQixFQUFFLElBQUksQ0FBQyxXQUFXO2dCQUNyQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGNBQWM7Z0JBQ2pDLE1BQU0sRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDeEIsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTthQUM3QixDQUFDO1lBRUYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQzdDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2dCQUV4QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUM7b0JBQ25ELFNBQVMsRUFBRSxVQUFVO29CQUNyQixTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVU7b0JBQzFCLE9BQU8sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDO2lCQUNyRCxDQUFDLENBQUM7Z0JBRUgsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNoQixDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVNLE1BQU07UUFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFTyxZQUFZO1FBQ2xCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVPLFlBQVksQ0FBQyxLQUFVO1FBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQXdCLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRU8sV0FBVztRQUNqQixNQUFNLEtBQUssR0FBcUI7WUFDOUIsUUFBUSxFQUFFLEtBQUs7WUFDZixLQUFLLEVBQUUsSUFBSTtZQUNYLE9BQU8sRUFBRSxJQUFJO1NBQ2QsQ0FBQztRQUVGLE1BQU0sU0FBUyxHQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBRW5FLElBQUksU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDeEIsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBb0IsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLENBQUM7WUFFOUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7WUFDdEIsS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM5QyxLQUFLLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBRW5DO2FBQU07WUFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFCO1FBRUQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVPLDBCQUEwQjtRQUNoQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUM7UUFDcEQsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakUsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDakUsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbkUsQ0FBQztDQUVGLENBQUE7QUFqSlU7SUFBUixLQUFLLEVBQUU7O21EQUE0QjtBQUMzQjtJQUFSLEtBQUssRUFBRTs7cURBQXVCO0FBQ3RCO0lBQVIsS0FBSyxFQUFFOztzREFBcUI7QUFDcEI7SUFBUixLQUFLLEVBQUU7OzJEQUFpQztBQUNoQztJQUFSLEtBQUssRUFBRTs7eURBQTZCO0FBQzVCO0lBQVIsS0FBSyxFQUFFOzswREFBMkI7QUFDMUI7SUFBUixLQUFLLEVBQUU7OzJEQUE0QjtBQUMzQjtJQUFSLEtBQUssRUFBRTs7dURBQXFCO0FBQ3BCO0lBQVIsS0FBSyxFQUFFOzt1REFBeUI7QUFDeEI7SUFBUixLQUFLLEVBQUU7O3VEQUEyQjtBQUMxQjtJQUFSLEtBQUssRUFBRTs7dURBQXlCO0FBQ3hCO0lBQVIsS0FBSyxFQUFFOzswREFBZ0M7QUFDL0I7SUFBUixLQUFLLEVBQUU7OzZEQUFtQztBQUVqQztJQUFULE1BQU0sRUFBRTtzQ0FBb0IsWUFBWTt5REFBTztBQUN0QztJQUFULE1BQU0sRUFBRTtzQ0FBb0IsWUFBWTt5REFBa0I7QUFDakQ7SUFBVCxNQUFNLEVBQUU7c0NBQXFCLFlBQVk7MERBQW1CO0FBbEJsRCxxQkFBcUI7SUFMakMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGVBQWU7UUFDekIsc3NDQUE2Qzs7S0FFOUMsQ0FBQzs2Q0E4QmMsVUFBVTtRQUNDLHlCQUF5QjtHQTlCdkMscUJBQXFCLENBbUpqQztTQW5KWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIHZhciBnb29nbGU6IGFueTtcblxuaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBPbkNoYW5nZXMsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIEV2ZW50RW1pdHRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEdvb2dsZUNoYXJ0c0xvYWRlclNlcnZpY2UgfSBmcm9tICcuL2dvb2dsZS1jaGFydHMtbG9hZGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2hhcnRTZWxlY3RFdmVudCwgQ2hhcnRFcnJvckV2ZW50IH0gZnJvbSAnLi9jaGFydC1ldmVudHMuaW50ZXJmYWNlJztcbmltcG9ydCB7IENvdW50cmllc0RhdGEsIFNlbGVjdGlvbkV4dHJhLCBTZWxlY3Rpb24gfSBmcm9tICcuL2RhdGEtdHlwZXMuaW50ZXJmYWNlJztcbmltcG9ydCB7IGVuIGFzIGNvdW50cmllc0VOIH0gZnJvbSAnQGphZ29tZi9jb3VudHJpZXNsaXN0JztcblxuY29uc3QgdmFsdWVIb2xkZXIgPSAndmFsdWUnO1xuY29uc3QgY291bnRyeU5hbWUgPSAoY291bnRyeUNvZGU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIHJldHVybiBjb3VudHJpZXNFTltjb3VudHJ5Q29kZV07XG59O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjb3VudHJpZXMtbWFwJyxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvdW50cmllcy1tYXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBDb3VudHJpZXNNYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuXG4gIEBJbnB1dCgpIHB1YmxpYyBkYXRhOiBDb3VudHJpZXNEYXRhO1xuICBASW5wdXQoKSBwdWJsaWMgYXBpS2V5OiBzdHJpbmc7XG4gIEBJbnB1dCgpIHB1YmxpYyBvcHRpb25zOiBhbnk7XG4gIEBJbnB1dCgpIHB1YmxpYyBjb3VudHJ5TGFiZWwgPSAnQ291bnRyeSc7XG4gIEBJbnB1dCgpIHB1YmxpYyB2YWx1ZUxhYmVsID0gJ1ZhbHVlJztcbiAgQElucHV0KCkgcHVibGljIHNob3dDYXB0aW9uID0gdHJ1ZTtcbiAgQElucHV0KCkgcHVibGljIGNhcHRpb25CZWxvdyA9IHRydWU7XG4gIEBJbnB1dCgpIHB1YmxpYyBtaW5WYWx1ZSA9IDA7XG4gIEBJbnB1dCgpIHB1YmxpYyBtYXhWYWx1ZTogbnVtYmVyO1xuICBASW5wdXQoKSBwdWJsaWMgbWluQ29sb3IgPSAnd2hpdGUnO1xuICBASW5wdXQoKSBwdWJsaWMgbWF4Q29sb3IgPSAncmVkJztcbiAgQElucHV0KCkgcHVibGljIG5vRGF0YUNvbG9yID0gJyNDRkNGQ0YnO1xuICBASW5wdXQoKSBwdWJsaWMgZXhjZXB0aW9uQ29sb3IgPSAnI0ZGRUU1OCc7XG5cbiAgQE91dHB1dCgpIHB1YmxpYyBjaGFydFJlYWR5OiBFdmVudEVtaXR0ZXI8dm9pZD47XG4gIEBPdXRwdXQoKSBwdWJsaWMgY2hhcnRFcnJvcjogRXZlbnRFbWl0dGVyPENoYXJ0RXJyb3JFdmVudD47XG4gIEBPdXRwdXQoKSBwdWJsaWMgY2hhcnRTZWxlY3Q6IEV2ZW50RW1pdHRlcjxDaGFydFNlbGVjdEV2ZW50PjtcblxuICBnb29nbGVEYXRhOiBzdHJpbmdbXVtdO1xuICB3cmFwcGVyOiBhbnk7XG4gIHNlbGVjdGlvbjogU2VsZWN0aW9uIHwgbnVsbCA9IG51bGw7XG4gIGxvYWRpbmcgPSB0cnVlO1xuICBnZXQgc2VsZWN0aW9uVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLnNlbGVjdGlvbi5jb3VudHJ5SWRdLnZhbHVlO1xuICB9XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBsb2FkZXJTZXJ2aWNlOiBHb29nbGVDaGFydHNMb2FkZXJTZXJ2aWNlXG4gICkge1xuICAgIHRoaXMuZWwgPSBlbDtcbiAgICB0aGlzLmxvYWRlclNlcnZpY2UgPSBsb2FkZXJTZXJ2aWNlO1xuICAgIHRoaXMuY2hhcnRTZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgdGhpcy5jaGFydFJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIHRoaXMuY2hhcnRFcnJvciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0RXh0cmFTZWxlY3RlZChjb3VudHJ5OiBzdHJpbmcpOiBTZWxlY3Rpb25FeHRyYVtdIHwgbnVsbCB7XG4gICAgY29uc3QgeyBleHRyYSB9ID0gdGhpcy5kYXRhW2NvdW50cnldO1xuICAgIHJldHVybiBleHRyYSAmJiBPYmplY3Qua2V5cyhleHRyYSkubWFwKGtleSA9PiAoeyBrZXksIHZhbDogZXh0cmFba2V5XSB9KSk7XG4gIH1cblxuICBwcml2YXRlIHNlbGVjdENvdW50cnkoY291bnRyeT86IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0aW9uID0gY291bnRyeSA/IHtcbiAgICAgIGNvdW50cnlJZDogY291bnRyeSxcbiAgICAgIGNvdW50cnlOYW1lOiBjb3VudHJ5TmFtZShjb3VudHJ5KSxcbiAgICAgIGV4dHJhOiB0aGlzLmdldEV4dHJhU2VsZWN0ZWQoY291bnRyeSlcbiAgICB9IDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXNhciBkZSB1bmEgdGFibGEgZW4gZm9ybWFcbiAgICogeyBHQjogeyB2YWx1ZToxMjMsIC4uLm90aGVyZGF0YSB9LCBFUzogeyB2YWx1ZTo0NTYsIC4uLndoYXRldmVyIH0gfVxuICAgKiBhIHVuIGFycmF5IHBhcmEgR29vZ2xlIENoYXJ0cyBlbiBmb3JtYVxuICAgKiBbIFsnQ291bnRyeScsICdWYWx1ZSddLCBbJ0dCJywgMTIzXSwgWydFUycsIDQ1Nl0gXVxuICAgKiB5IGFsbWFjZXJuYXJsbyBlbiB0aGlzLnByb2Nlc3NlZERhdGFcbiAgICovXG4gIHByaXZhdGUgcHJvY2Vzc0lucHV0RGF0YSgpOiB2b2lkIHtcbiAgICB0aGlzLmdvb2dsZURhdGEgPSBPYmplY3Qua2V5cyh0aGlzLmRhdGEpLnJlZHVjZSgoYWNjLCBjdXJyS2V5KSA9PiB7XG4gICAgICBjb25zdCBjdXJyVmFsID0gdGhpcy5kYXRhW2N1cnJLZXldW3ZhbHVlSG9sZGVyXTtcbiAgICAgIGFjYy5wdXNoKFtjdXJyS2V5LCA8c3RyaW5nPmN1cnJWYWxdKTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwgW1snQ291bnRyeScsICdWYWx1ZSddXSk7XG4gIH1cblxuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGNvbnN0IGtleSA9ICdkYXRhJztcbiAgICBpZiAoY2hhbmdlc1trZXldKSB7XG5cbiAgICAgIGlmICghdGhpcy5kYXRhKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgIGNvbG9yQXhpczoge1xuICAgICAgICAgIGNvbG9yczogW3RoaXMubWluQ29sb3IsIHRoaXMubWF4Q29sb3JdLFxuICAgICAgICAgIG1pblZhbHVlOiBOdW1iZXIuaXNJbnRlZ2VyKHRoaXMubWluVmFsdWUpID8gdGhpcy5taW5WYWx1ZSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICBtYXhWYWx1ZTogTnVtYmVyLmlzSW50ZWdlcih0aGlzLm1heFZhbHVlKSA/IHRoaXMubWF4VmFsdWUgOiB1bmRlZmluZWRcbiAgICAgICAgfSxcbiAgICAgICAgZGF0YWxlc3NSZWdpb25Db2xvcjogdGhpcy5ub0RhdGFDb2xvcixcbiAgICAgICAgZGVmYXVsdENvbG9yOiB0aGlzLmV4Y2VwdGlvbkNvbG9yLFxuICAgICAgICBsZWdlbmQ6IHRoaXMuc2hvd0NhcHRpb24sXG4gICAgICAgIHRvb2x0aXA6IHsgdHJpZ2dlcjogJ25vbmUnIH1cbiAgICAgIH07XG5cbiAgICAgIHRoaXMubG9hZGVyU2VydmljZS5sb2FkKHRoaXMuYXBpS2V5KS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5wcm9jZXNzSW5wdXREYXRhKCk7XG5cbiAgICAgICAgdGhpcy53cmFwcGVyID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcih7XG4gICAgICAgICAgY2hhcnRUeXBlOiAnR2VvQ2hhcnQnLFxuICAgICAgICAgIGRhdGFUYWJsZTogdGhpcy5nb29nbGVEYXRhLFxuICAgICAgICAgIG9wdGlvbnM6IE9iamVjdC5hc3NpZ24oZGVmYXVsdE9wdGlvbnMsIHRoaXMub3B0aW9ucylcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlckNoYXJ0V3JhcHBlckV2ZW50cygpO1xuICAgICAgICB0aGlzLnJlZHJhdygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJlZHJhdygpOiB2b2lkIHtcbiAgICB0aGlzLndyYXBwZXIuZHJhdyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3RvcignZGl2LmNtLW1hcC1jb250ZW50JykpO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkNoYXJ0UmVhZHkoKTogdm9pZCB7XG4gICAgdGhpcy5sb2FkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5jaGFydFJlYWR5LmVtaXQoKTtcbiAgfVxuXG4gIHByaXZhdGUgb25DaGFydGVycm9yKGVycm9yOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmNoYXJ0RXJyb3IuZW1pdChlcnJvciBhcyBDaGFydEVycm9yRXZlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBvbk1hcFNlbGVjdCgpOiB2b2lkIHtcbiAgICBjb25zdCBldmVudDogQ2hhcnRTZWxlY3RFdmVudCA9IHtcbiAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgY291bnRyeTogbnVsbFxuICAgIH07XG5cbiAgICBjb25zdCBzZWxlY3Rpb246IGFueVtdID0gdGhpcy53cmFwcGVyLnZpc3VhbGl6YXRpb24uZ2V0U2VsZWN0aW9uKCk7XG5cbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHsgcm93OiB0YWJsZVJvdyB9OiB7IHJvdzogbnVtYmVyIH0gPSBzZWxlY3Rpb25bMF07XG4gICAgICBjb25zdCBkYXRhVGFibGUgPSB0aGlzLndyYXBwZXIuZ2V0RGF0YVRhYmxlKCk7XG5cbiAgICAgIGV2ZW50LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIGV2ZW50LnZhbHVlID0gZGF0YVRhYmxlLmdldFZhbHVlKHRhYmxlUm93LCAxKTtcbiAgICAgIGV2ZW50LmNvdW50cnkgPSBkYXRhVGFibGUuZ2V0VmFsdWUodGFibGVSb3csIDApO1xuICAgICAgdGhpcy5zZWxlY3RDb3VudHJ5KGV2ZW50LmNvdW50cnkpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0Q291bnRyeShudWxsKTtcbiAgICB9XG5cbiAgICB0aGlzLmNoYXJ0U2VsZWN0LmVtaXQoZXZlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWdpc3RlckNoYXJ0V3JhcHBlckV2ZW50cygpOiB2b2lkIHtcbiAgICBjb25zdCB7IGFkZExpc3RlbmVyIH0gPSBnb29nbGUudmlzdWFsaXphdGlvbi5ldmVudHM7XG4gICAgYWRkTGlzdGVuZXIodGhpcy53cmFwcGVyLCAncmVhZHknLCB0aGlzLm9uQ2hhcnRSZWFkeS5iaW5kKHRoaXMpKTtcbiAgICBhZGRMaXN0ZW5lcih0aGlzLndyYXBwZXIsICdlcnJvcicsIHRoaXMub25DaGFydGVycm9yLmJpbmQodGhpcykpO1xuICAgIGFkZExpc3RlbmVyKHRoaXMud3JhcHBlciwgJ3NlbGVjdCcsIHRoaXMub25NYXBTZWxlY3QuYmluZCh0aGlzKSk7XG4gIH1cblxufVxuIl19