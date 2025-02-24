import { Component, Input, Output, HostListener, ViewChild, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { CharErrorCode } from './chart-events.interface';
import { en as countriesEN } from '@jagomf/countrieslist';
import * as i0 from "@angular/core";
import * as i1 from "./google-charts-loader.service";
import * as i2 from "@angular/common";
const valueHolder = 'value';
const countryName = (countryCode) => {
    return countriesEN[countryCode];
};
export class CountriesMapComponent {
    get loading() {
        return this.innerLoading;
    }
    get selectionValue() {
        return this.data[this.selection.countryId].value;
    }
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
    async initializeMap(defaultOptions) {
        try {
            await this.loaderService.load(this.apiKey);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CountriesMapComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.ElementRef }, { token: i1.GoogleChartsLoaderService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: CountriesMapComponent, selector: "countries-map", inputs: { data: "data", apiKey: "apiKey", options: "options", countryLabel: "countryLabel", valueLabel: "valueLabel", showCaption: "showCaption", captionBelow: "captionBelow", autoResize: "autoResize", minValue: "minValue", maxValue: "maxValue", minColor: "minColor", maxColor: "maxColor", backgroundColor: "backgroundColor", noDataColor: "noDataColor", exceptionColor: "exceptionColor" }, outputs: { chartReady: "chartReady", chartError: "chartError", chartSelect: "chartSelect" }, host: { listeners: { "window:deviceorientation": "screenSizeChanged()", "window:resize": "screenSizeChanged()" } }, viewQueries: [{ propertyName: "mapContent", first: true, predicate: ["mapContent"], descendants: true }], usesOnChanges: true, ngImport: i0, template: "@if (loading) {\n<div class=\"major-block loading\"><span class=\"text\">Loading map...</span></div>\n}\n\n<div class=\"major-block cm-map-content\" #mapContent [ngClass]=\"{'goes-first': captionBelow}\"></div>\n\n@if (!loading && showCaption) {\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\">\n  <div class=\"cm-simple-caption\">\n    <div class=\"cm-country-label\">\n      @if (selection) {\n        <span class=\"cm-country-name\">{{selection?.countryName}}</span>\n      } @else {\n        <span class=\"cm-default-label\">{{countryLabel}}</span>\n      }\n    </div>\n    <div class=\"cm-value-label\">\n      <span class=\"cm-value-text\"\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}@if (selection) {<span>: </span>}</span>\n      @if (selection) {\n        <span class=\"cm-value-content\">{{selectionValue}}</span>\n      }\n    </div>\n  </div>\n  @if (selection?.extra?.length > 0) {\n    <div class=\"cm-extended-caption\">\n      @for (item of selection?.extra; track item.key) {\n        <div class=\"cm-extended-item\">\n          <span class=\"cm-extended-label\">{{item.key}}</span>:\n          <span class=\"cm-extended-value\">{{item.val}}</span>\n        </div>\n      }\n    </div>\n  }\n</div>\n}\n", styles: [":host{display:flex;flex-flow:column nowrap;justify-content:space-between;align-items:stretch;align-content:stretch}.major-block.loading{flex:0 1 auto;align-self:center}.major-block.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{flex:0 1 auto;display:flex;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{flex:0 1 auto;align-self:flex-start}.cm-value-label{flex:0 1 auto;align-self:flex-end}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CountriesMapComponent, decorators: [{
            type: Component,
            args: [{ selector: 'countries-map', changeDetection: ChangeDetectionStrategy.OnPush, template: "@if (loading) {\n<div class=\"major-block loading\"><span class=\"text\">Loading map...</span></div>\n}\n\n<div class=\"major-block cm-map-content\" #mapContent [ngClass]=\"{'goes-first': captionBelow}\"></div>\n\n@if (!loading && showCaption) {\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\">\n  <div class=\"cm-simple-caption\">\n    <div class=\"cm-country-label\">\n      @if (selection) {\n        <span class=\"cm-country-name\">{{selection?.countryName}}</span>\n      } @else {\n        <span class=\"cm-default-label\">{{countryLabel}}</span>\n      }\n    </div>\n    <div class=\"cm-value-label\">\n      <span class=\"cm-value-text\"\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}@if (selection) {<span>: </span>}</span>\n      @if (selection) {\n        <span class=\"cm-value-content\">{{selectionValue}}</span>\n      }\n    </div>\n  </div>\n  @if (selection?.extra?.length > 0) {\n    <div class=\"cm-extended-caption\">\n      @for (item of selection?.extra; track item.key) {\n        <div class=\"cm-extended-item\">\n          <span class=\"cm-extended-label\">{{item.key}}</span>:\n          <span class=\"cm-extended-value\">{{item.val}}</span>\n        </div>\n      }\n    </div>\n  }\n</div>\n}\n", styles: [":host{display:flex;flex-flow:column nowrap;justify-content:space-between;align-items:stretch;align-content:stretch}.major-block.loading{flex:0 1 auto;align-self:center}.major-block.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{flex:0 1 auto;display:flex;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{flex:0 1 auto;align-self:flex-start}.cm-value-label{flex:0 1 auto;align-self:flex-end}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i0.ElementRef }, { type: i1.GoogleChartsLoaderService }], propDecorators: { data: [{
                type: Input,
                args: [{ required: true }]
            }], apiKey: [{
                type: Input
            }], options: [{
                type: Input
            }], countryLabel: [{
                type: Input
            }], valueLabel: [{
                type: Input
            }], showCaption: [{
                type: Input
            }], captionBelow: [{
                type: Input
            }], autoResize: [{
                type: Input
            }], minValue: [{
                type: Input
            }], maxValue: [{
                type: Input
            }], minColor: [{
                type: Input
            }], maxColor: [{
                type: Input
            }], backgroundColor: [{
                type: Input
            }], noDataColor: [{
                type: Input
            }], exceptionColor: [{
                type: Input
            }], chartReady: [{
                type: Output
            }], chartError: [{
                type: Output
            }], chartSelect: [{
                type: Output
            }], mapContent: [{
                type: ViewChild,
                args: ['mapContent', { static: false }]
            }], screenSizeChanged: [{
                type: HostListener,
                args: ['window:deviceorientation']
            }, {
                type: HostListener,
                args: ['window:resize']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9saWIvc3JjL2xpYi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvbGliL2NvdW50cmllcy1tYXAuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFHVCxLQUFLLEVBQ0wsTUFBTSxFQUVOLFlBQVksRUFDWixTQUFTLEVBQ1QsdUJBQXVCLEVBRXZCLFlBQVksRUFDYixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFHekQsT0FBTyxFQUFFLEVBQUUsSUFBSSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQzs7OztBQUUxRCxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUM7QUFDNUIsTUFBTSxXQUFXLEdBQUcsQ0FBQyxXQUFtQixFQUFVLEVBQUU7SUFDbEQsT0FBTyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbEMsQ0FBQyxDQUFDO0FBUUYsTUFBTSxPQUFPLHFCQUFxQjtJQStCaEMsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO0lBQzNCLENBQUM7SUFFRCxJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ25ELENBQUM7SUFFRCxZQUNtQixLQUF3QixFQUN4QixFQUFjLEVBQ2QsYUFBd0M7UUFGeEMsVUFBSyxHQUFMLEtBQUssQ0FBbUI7UUFDeEIsT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUNkLGtCQUFhLEdBQWIsYUFBYSxDQUEyQjtRQXJDbEQsaUJBQVksR0FBRyxTQUFTLENBQUM7UUFDekIsZUFBVSxHQUFHLE9BQU8sQ0FBQztRQUNyQixnQkFBVyxHQUFHLElBQUksQ0FBQztRQUNuQixpQkFBWSxHQUFHLElBQUksQ0FBQztRQUNwQixlQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ25CLGFBQVEsR0FBRyxDQUFDLENBQUM7UUFFYixhQUFRLEdBQUcsT0FBTyxDQUFDO1FBQ25CLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFDakIsb0JBQWUsR0FBRyxPQUFPLENBQUM7UUFDMUIsZ0JBQVcsR0FBRyxTQUFTLENBQUM7UUFDeEIsbUJBQWMsR0FBRyxTQUFTLENBQUM7UUFFVCxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQVEsQ0FBQztRQUN0QyxlQUFVLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFDakQsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBb0IsQ0FBQztRQVE5RSxjQUFTLEdBQXFCLElBQUksQ0FBQztRQUUzQixpQkFBWSxHQUFHLElBQUksQ0FBQztJQWM1QixDQUFDO0lBSUQsaUJBQWlCO1FBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ3JDLE1BQU0sR0FBRyxHQUFnQixJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQztZQUN2RCxHQUFHLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNoQixDQUFDO0lBQ0gsQ0FBQztJQUVPLGdCQUFnQixDQUFDLE9BQWU7UUFDdEMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsT0FBTyxLQUFLLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVPLGFBQWEsQ0FBQyxPQUFnQjtRQUNwQyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDekIsU0FBUyxFQUFFLE9BQU87WUFDbEIsV0FBVyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUM7WUFDakMsS0FBSyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7U0FDdEMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ1QsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ssZ0JBQWdCO1FBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUU7WUFDckUsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3ZDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsYUFBYSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9GLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQXlCLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsV0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFpQjtRQUNqQyxJQUFJLElBQUksRUFBRSxDQUFDO1lBRVQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDZixPQUFPO1lBQ1QsQ0FBQztZQUVELElBQUksQ0FBQyxhQUFhLENBQUM7Z0JBQ2pCLHVDQUF1QztnQkFDdkMsMEJBQTBCO2dCQUMxQixtQkFBbUI7Z0JBQ25CLG1DQUFtQztnQkFDbkMseUJBQXlCO2dCQUN6QixZQUFZO2dCQUNaLFNBQVMsRUFBRTtvQkFDVCxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQ3RDLFFBQVEsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUztvQkFDckUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTO2lCQUN0RTtnQkFDRCxtQkFBbUIsRUFBRSxJQUFJLENBQUMsV0FBVztnQkFDckMsZUFBZSxFQUFFLElBQUksQ0FBQyxlQUFlO2dCQUNyQyxZQUFZLEVBQUUsSUFBSSxDQUFDLGNBQWM7Z0JBQ2pDLE1BQU0sRUFBRSxNQUFNO2dCQUNkLE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7YUFDN0IsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztJQUNILENBQUM7SUFFTyxLQUFLLENBQUMsYUFBYSxDQUFDLGNBQW9EO1FBQzlFLElBQUksQ0FBQztZQUNILE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBRTNDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBRXhCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQztnQkFDbkQsU0FBUyxFQUFFLFVBQVU7Z0JBQ3JCLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVTtnQkFDMUIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUM7YUFDckQsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7WUFDbEMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBRWQsTUFBTSxJQUFJLEdBQWdCLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDO1lBQ2hELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3pELENBQUM7UUFBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQ1gsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsRUFBRSxhQUFhLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7UUFDOUUsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRU8sWUFBWTtRQUNsQixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztZQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3pCLENBQUM7SUFDSCxDQUFDO0lBRU8sWUFBWSxDQUFDLEtBQXNCO1FBQ3pDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTyxXQUFXO1FBQ2pCLE1BQU0sS0FBSyxHQUFxQjtZQUM5QixRQUFRLEVBQUUsS0FBSztZQUNmLEtBQUssRUFBRSxJQUFJO1lBQ1gsT0FBTyxFQUFFLElBQUk7U0FDZCxDQUFDO1FBRUYsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUV6RCxJQUFJLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDekIsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUU5QyxLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUN0QixLQUFLLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlDLEtBQUssQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFcEMsQ0FBQzthQUFNLENBQUM7WUFDTixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLENBQUM7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRU8sMEJBQTBCO1FBQ2hDLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUNwRCxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNqRSxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNqRSxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNuRSxDQUFDO0lBRUQsV0FBVztRQUNULE1BQU0sRUFBRSxjQUFjLEVBQUUsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQztRQUN2RCxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEIsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hCLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMzQixDQUFDOytHQTNMVSxxQkFBcUI7bUdBQXJCLHFCQUFxQiwyd0JDOUJsQyxzd0NBb0NBOzs0RkROYSxxQkFBcUI7a0JBTmpDLFNBQVM7K0JBQ0UsZUFBZSxtQkFDUix1QkFBdUIsQ0FBQyxNQUFNO3VKQU1wQixJQUFJO3NCQUE5QixLQUFLO3VCQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtnQkFDaEIsTUFBTTtzQkFBZCxLQUFLO2dCQUNHLE9BQU87c0JBQWYsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxlQUFlO3NCQUF2QixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csY0FBYztzQkFBdEIsS0FBSztnQkFFcUIsVUFBVTtzQkFBcEMsTUFBTTtnQkFDb0IsVUFBVTtzQkFBcEMsTUFBTTtnQkFDb0IsV0FBVztzQkFBckMsTUFBTTtnQkFFc0QsVUFBVTtzQkFBdEUsU0FBUzt1QkFBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO2dCQTBCMUMsaUJBQWlCO3NCQUZoQixZQUFZO3VCQUFDLDBCQUEwQjs7c0JBQ3ZDLFlBQVk7dUJBQUMsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgT25DaGFuZ2VzLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBPbkRlc3Ryb3ksXG4gIEhvc3RMaXN0ZW5lcixcbiAgVmlld0NoaWxkLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIEV2ZW50RW1pdHRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEdvb2dsZUNoYXJ0c0xvYWRlclNlcnZpY2UgfSBmcm9tICcuL2dvb2dsZS1jaGFydHMtbG9hZGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgQ2hhckVycm9yQ29kZSB9IGZyb20gJy4vY2hhcnQtZXZlbnRzLmludGVyZmFjZSc7XG5pbXBvcnQgdHlwZSB7IENoYXJ0U2VsZWN0RXZlbnQsIENoYXJ0RXJyb3JFdmVudCB9IGZyb20gJy4vY2hhcnQtZXZlbnRzLmludGVyZmFjZSc7XG5pbXBvcnQgdHlwZSB7IENvdW50cmllc0RhdGEsIFNlbGVjdGlvbkV4dHJhLCBTZWxlY3Rpb24sIFZhbGlkQ291bnRyeURhdGEgfSBmcm9tICcuL2RhdGEtdHlwZXMuaW50ZXJmYWNlJztcbmltcG9ydCB7IGVuIGFzIGNvdW50cmllc0VOIH0gZnJvbSAnQGphZ29tZi9jb3VudHJpZXNsaXN0JztcblxuY29uc3QgdmFsdWVIb2xkZXIgPSAndmFsdWUnO1xuY29uc3QgY291bnRyeU5hbWUgPSAoY291bnRyeUNvZGU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIHJldHVybiBjb3VudHJpZXNFTltjb3VudHJ5Q29kZV07XG59O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjb3VudHJpZXMtbWFwJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlVXJsOiAnLi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vY291bnRyaWVzLW1hcC5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIENvdW50cmllc01hcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcblxuICBASW5wdXQoeyByZXF1aXJlZDogdHJ1ZSB9KSBkYXRhOiBDb3VudHJpZXNEYXRhO1xuICBASW5wdXQoKSBhcGlLZXk6IHN0cmluZztcbiAgQElucHV0KCkgb3B0aW9uczogYW55O1xuICBASW5wdXQoKSBjb3VudHJ5TGFiZWwgPSAnQ291bnRyeSc7XG4gIEBJbnB1dCgpIHZhbHVlTGFiZWwgPSAnVmFsdWUnO1xuICBASW5wdXQoKSBzaG93Q2FwdGlvbiA9IHRydWU7XG4gIEBJbnB1dCgpIGNhcHRpb25CZWxvdyA9IHRydWU7XG4gIEBJbnB1dCgpIGF1dG9SZXNpemUgPSBmYWxzZTtcbiAgQElucHV0KCkgbWluVmFsdWUgPSAwO1xuICBASW5wdXQoKSBtYXhWYWx1ZTogbnVtYmVyO1xuICBASW5wdXQoKSBtaW5Db2xvciA9ICd3aGl0ZSc7XG4gIEBJbnB1dCgpIG1heENvbG9yID0gJ3JlZCc7XG4gIEBJbnB1dCgpIGJhY2tncm91bmRDb2xvciA9ICd3aGl0ZSc7XG4gIEBJbnB1dCgpIG5vRGF0YUNvbG9yID0gJyNDRkNGQ0YnO1xuICBASW5wdXQoKSBleGNlcHRpb25Db2xvciA9ICcjRkZFRTU4JztcblxuICBAT3V0cHV0KCkgcHJpdmF0ZSByZWFkb25seSBjaGFydFJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICBAT3V0cHV0KCkgcHJpdmF0ZSByZWFkb25seSBjaGFydEVycm9yID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydEVycm9yRXZlbnQ+KCk7XG4gIEBPdXRwdXQoKSBwcml2YXRlIHJlYWRvbmx5IGNoYXJ0U2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydFNlbGVjdEV2ZW50PigpO1xuXG4gIEBWaWV3Q2hpbGQoJ21hcENvbnRlbnQnLCB7IHN0YXRpYzogZmFsc2UgfSkgcHJpdmF0ZSByZWFkb25seSBtYXBDb250ZW50OiBFbGVtZW50UmVmO1xuXG4gIHByaXZhdGUgcHJvcG9ydGlvbjogbnVtYmVyO1xuICBwcml2YXRlIGdvb2dsZURhdGE6IFZhbGlkQ291bnRyeURhdGFbXVtdO1xuICBwcml2YXRlIHdyYXBwZXI6IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcjtcblxuICBzZWxlY3Rpb246IFNlbGVjdGlvbiB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgaW5uZXJMb2FkaW5nID0gdHJ1ZTtcbiAgZ2V0IGxvYWRpbmcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJMb2FkaW5nO1xuICB9XG5cbiAgZ2V0IHNlbGVjdGlvblZhbHVlKCk6IFZhbGlkQ291bnRyeURhdGEge1xuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5zZWxlY3Rpb24uY291bnRyeUlkXS52YWx1ZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2RSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgZWw6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSByZWFkb25seSBsb2FkZXJTZXJ2aWNlOiBHb29nbGVDaGFydHNMb2FkZXJTZXJ2aWNlXG4gICkge1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OmRldmljZW9yaWVudGF0aW9uJylcbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScpXG4gIHNjcmVlblNpemVDaGFuZ2VkKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5sb2FkaW5nICYmIHRoaXMuYXV0b1Jlc2l6ZSkge1xuICAgICAgY29uc3QgbWFwOiBIVE1MRWxlbWVudCA9IHRoaXMubWFwQ29udGVudC5uYXRpdmVFbGVtZW50O1xuICAgICAgbWFwLnN0eWxlLnNldFByb3BlcnR5KCdoZWlnaHQnLCBgJHttYXAuY2xpZW50V2lkdGggKiB0aGlzLnByb3BvcnRpb259cHhgKTtcbiAgICAgIHRoaXMucmVkcmF3KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRFeHRyYVNlbGVjdGVkKGNvdW50cnk6IHN0cmluZyk6IFNlbGVjdGlvbkV4dHJhW10gfCBudWxsIHtcbiAgICBjb25zdCB7IGV4dHJhIH0gPSB0aGlzLmRhdGFbY291bnRyeV07XG4gICAgcmV0dXJuIGV4dHJhICYmIE9iamVjdC5rZXlzKGV4dHJhKS5tYXAoa2V5ID0+ICh7IGtleSwgdmFsOiBleHRyYVtrZXldIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VsZWN0Q291bnRyeShjb3VudHJ5Pzogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3Rpb24gPSBjb3VudHJ5ID8ge1xuICAgICAgY291bnRyeUlkOiBjb3VudHJ5LFxuICAgICAgY291bnRyeU5hbWU6IGNvdW50cnlOYW1lKGNvdW50cnkpLFxuICAgICAgZXh0cmE6IHRoaXMuZ2V0RXh0cmFTZWxlY3RlZChjb3VudHJ5KVxuICAgIH0gOiBudWxsO1xuICAgIHRoaXMuY2RSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgYSB0YWJsZSAob2JqZWN0KSBmb3JtYXR0ZWQgYXNcbiAgICogYHsgR0I6IHsgdmFsdWU6MTIzLCAuLi5vdGhlcmRhdGEgfSwgRVM6IHsgdmFsdWU6NDU2LCAuLi53aGF0ZXZlciB9IH1gXG4gICAqIHRvIGFuIGFycmF5IGZvciBHb29nbGUgQ2hhcnRzIGZvcm1hdHRlZCBhc1xuICAgKiBgWyBbJ0NvdW50cnknLCAnVmFsdWUnXSwgWydHQicsIDEyM10sIFsnRVMnLCA0NTZdIF1gXG4gICAqIGFuZCBzYXZlIHRvIHRoaXMucHJvY2Vzc2VkRGF0YVxuICAgKi9cbiAgcHJpdmF0ZSBwcm9jZXNzSW5wdXREYXRhKCk6IHZvaWQge1xuICAgIHRoaXMuZ29vZ2xlRGF0YSA9IE9iamVjdC5lbnRyaWVzKHRoaXMuZGF0YSkucmVkdWNlKChhY2MsIFtrZXksIHZhbF0pID0+IHtcbiAgICAgIGNvbnN0IHJhd1ZhbENvbnRlbnQgPSB2YWxbdmFsdWVIb2xkZXJdO1xuICAgICAgYWNjLnB1c2goW2tleSwgcmF3VmFsQ29udGVudCA9PT0gbnVsbCA/IG51bGwgOiByYXdWYWxDb250ZW50ID8gK3Jhd1ZhbENvbnRlbnQudG9TdHJpbmcoKSA6IDBdKTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwgW1snQ291bnRyeScsICdWYWx1ZSddXSBhcyBWYWxpZENvdW50cnlEYXRhW11bXSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyh7IGRhdGEgfTogeyBkYXRhOiBhbnkgfSk6IHZvaWQge1xuICAgIGlmIChkYXRhKSB7XG5cbiAgICAgIGlmICghdGhpcy5kYXRhKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pbml0aWFsaXplTWFwKHtcbiAgICAgICAgLy8jcmVnaW9uIERFRkFVTFRTIChhdXRvbWF0aWNhbGx5IHNldCk6XG4gICAgICAgIC8vIGRpc3BsYXlNb2RlOiAncmVnaW9ucycsXG4gICAgICAgIC8vIHJlZ2lvbjogJ3dvcmxkJyxcbiAgICAgICAgLy8gZW5hYmxlUmVnaW9uSW50ZXJhY3Rpdml0eTogdHJ1ZSxcbiAgICAgICAgLy8ga2VlcEFzcGVjdFJhdGlvOiB0cnVlLFxuICAgICAgICAvLyNlbmRyZWdpb25cbiAgICAgICAgY29sb3JBeGlzOiB7XG4gICAgICAgICAgY29sb3JzOiBbdGhpcy5taW5Db2xvciwgdGhpcy5tYXhDb2xvcl0sXG4gICAgICAgICAgbWluVmFsdWU6IE51bWJlci5pc0ludGVnZXIodGhpcy5taW5WYWx1ZSkgPyB0aGlzLm1pblZhbHVlIDogdW5kZWZpbmVkLFxuICAgICAgICAgIG1heFZhbHVlOiBOdW1iZXIuaXNJbnRlZ2VyKHRoaXMubWF4VmFsdWUpID8gdGhpcy5tYXhWYWx1ZSA6IHVuZGVmaW5lZFxuICAgICAgICB9LFxuICAgICAgICBkYXRhbGVzc1JlZ2lvbkNvbG9yOiB0aGlzLm5vRGF0YUNvbG9yLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuYmFja2dyb3VuZENvbG9yLFxuICAgICAgICBkZWZhdWx0Q29sb3I6IHRoaXMuZXhjZXB0aW9uQ29sb3IsXG4gICAgICAgIGxlZ2VuZDogJ25vbmUnLFxuICAgICAgICB0b29sdGlwOiB7IHRyaWdnZXI6ICdub25lJyB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGluaXRpYWxpemVNYXAoZGVmYXVsdE9wdGlvbnM6IGdvb2dsZS52aXN1YWxpemF0aW9uLkdlb0NoYXJ0T3B0aW9ucyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCB0aGlzLmxvYWRlclNlcnZpY2UubG9hZCh0aGlzLmFwaUtleSk7XG5cbiAgICAgIHRoaXMucHJvY2Vzc0lucHV0RGF0YSgpO1xuXG4gICAgICB0aGlzLndyYXBwZXIgPSBuZXcgZ29vZ2xlLnZpc3VhbGl6YXRpb24uQ2hhcnRXcmFwcGVyKHtcbiAgICAgICAgY2hhcnRUeXBlOiAnR2VvQ2hhcnQnLFxuICAgICAgICBkYXRhVGFibGU6IHRoaXMuZ29vZ2xlRGF0YSxcbiAgICAgICAgb3B0aW9uczogT2JqZWN0LmFzc2lnbihkZWZhdWx0T3B0aW9ucywgdGhpcy5vcHRpb25zKVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMucmVnaXN0ZXJDaGFydFdyYXBwZXJFdmVudHMoKTtcbiAgICAgIHRoaXMucmVkcmF3KCk7XG5cbiAgICAgIGNvbnN0IHNlbGY6IEhUTUxFbGVtZW50ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICAgICAgdGhpcy5wcm9wb3J0aW9uID0gc2VsZi5jbGllbnRIZWlnaHQgLyBzZWxmLmNsaWVudFdpZHRoO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMub25DaGFydGVycm9yKHsgaWQ6IENoYXJFcnJvckNvZGUubG9hZGluZywgbWVzc2FnZTogJ0NvdWxkIG5vdCBsb2FkJyB9KTtcbiAgICB9XG4gIH1cblxuICByZWRyYXcoKTogdm9pZCB7XG4gICAgdGhpcy53cmFwcGVyLmRyYXcodGhpcy5lbC5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ2Rpdi5jbS1tYXAtY29udGVudCcpKTtcbiAgfVxuXG4gIHByaXZhdGUgb25DaGFydFJlYWR5KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlubmVyTG9hZGluZykge1xuICAgICAgdGhpcy5pbm5lckxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuY2hhcnRSZWFkeS5lbWl0KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvbkNoYXJ0ZXJyb3IoZXJyb3I6IENoYXJ0RXJyb3JFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuY2hhcnRFcnJvci5lbWl0KGVycm9yKTtcbiAgfVxuXG4gIHByaXZhdGUgb25NYXBTZWxlY3QoKTogdm9pZCB7XG4gICAgY29uc3QgZXZlbnQ6IENoYXJ0U2VsZWN0RXZlbnQgPSB7XG4gICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICB2YWx1ZTogbnVsbCxcbiAgICAgIGNvdW50cnk6IG51bGxcbiAgICB9O1xuXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy53cmFwcGVyLmdldENoYXJ0KCkuZ2V0U2VsZWN0aW9uKCk7XG5cbiAgICBpZiAoc2VsZWN0aW9uLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHsgcm93OiB0YWJsZVJvdyB9ID0gc2VsZWN0aW9uWzBdO1xuICAgICAgY29uc3QgZGF0YVRhYmxlID0gdGhpcy53cmFwcGVyLmdldERhdGFUYWJsZSgpO1xuXG4gICAgICBldmVudC5zZWxlY3RlZCA9IHRydWU7XG4gICAgICBldmVudC52YWx1ZSA9IGRhdGFUYWJsZS5nZXRWYWx1ZSh0YWJsZVJvdywgMSk7XG4gICAgICBldmVudC5jb3VudHJ5ID0gZGF0YVRhYmxlLmdldFZhbHVlKHRhYmxlUm93LCAwKTtcbiAgICAgIHRoaXMuc2VsZWN0Q291bnRyeShldmVudC5jb3VudHJ5KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdENvdW50cnkobnVsbCk7XG4gICAgfVxuXG4gICAgdGhpcy5jaGFydFNlbGVjdC5lbWl0KGV2ZW50KTtcbiAgfVxuXG4gIHByaXZhdGUgcmVnaXN0ZXJDaGFydFdyYXBwZXJFdmVudHMoKTogdm9pZCB7XG4gICAgY29uc3QgeyBhZGRMaXN0ZW5lciB9ID0gZ29vZ2xlLnZpc3VhbGl6YXRpb24uZXZlbnRzO1xuICAgIGFkZExpc3RlbmVyKHRoaXMud3JhcHBlciwgJ3JlYWR5JywgdGhpcy5vbkNoYXJ0UmVhZHkuYmluZCh0aGlzKSk7XG4gICAgYWRkTGlzdGVuZXIodGhpcy53cmFwcGVyLCAnZXJyb3InLCB0aGlzLm9uQ2hhcnRlcnJvci5iaW5kKHRoaXMpKTtcbiAgICBhZGRMaXN0ZW5lcih0aGlzLndyYXBwZXIsICdzZWxlY3QnLCB0aGlzLm9uTWFwU2VsZWN0LmJpbmQodGhpcykpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgY29uc3QgeyByZW1vdmVMaXN0ZW5lciB9ID0gZ29vZ2xlLnZpc3VhbGl6YXRpb24uZXZlbnRzO1xuICAgIHJlbW92ZUxpc3RlbmVyKCdyZWFkeScpO1xuICAgIHJlbW92ZUxpc3RlbmVyKCdlcnJvcicpO1xuICAgIHJlbW92ZUxpc3RlbmVyKCdzZWxlY3QnKTtcbiAgfVxuXG59XG4iLCJAaWYgKGxvYWRpbmcpIHtcbjxkaXYgY2xhc3M9XCJtYWpvci1ibG9jayBsb2FkaW5nXCI+PHNwYW4gY2xhc3M9XCJ0ZXh0XCI+TG9hZGluZyBtYXAuLi48L3NwYW4+PC9kaXY+XG59XG5cbjxkaXYgY2xhc3M9XCJtYWpvci1ibG9jayBjbS1tYXAtY29udGVudFwiICNtYXBDb250ZW50IFtuZ0NsYXNzXT1cInsnZ29lcy1maXJzdCc6IGNhcHRpb25CZWxvd31cIj48L2Rpdj5cblxuQGlmICghbG9hZGluZyAmJiBzaG93Q2FwdGlvbikge1xuPGRpdiBjbGFzcz1cIm1ham9yLWJsb2NrIGNtLWNhcHRpb24tY29udGFpbmVyXCIgW25nQ2xhc3NdPVwieydnb2VzLWZpcnN0JzogIWNhcHRpb25CZWxvd31cIj5cbiAgPGRpdiBjbGFzcz1cImNtLXNpbXBsZS1jYXB0aW9uXCI+XG4gICAgPGRpdiBjbGFzcz1cImNtLWNvdW50cnktbGFiZWxcIj5cbiAgICAgIEBpZiAoc2VsZWN0aW9uKSB7XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiY20tY291bnRyeS1uYW1lXCI+e3tzZWxlY3Rpb24/LmNvdW50cnlOYW1lfX08L3NwYW4+XG4gICAgICB9IEBlbHNlIHtcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJjbS1kZWZhdWx0LWxhYmVsXCI+e3tjb3VudHJ5TGFiZWx9fTwvc3Bhbj5cbiAgICAgIH1cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiY20tdmFsdWUtbGFiZWxcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY20tdmFsdWUtdGV4dFwiXG4gICAgICAgIFtuZ0NsYXNzXT1cInsnaGFzLXZhbHVlJzogc2VsZWN0aW9ufVwiPnt7dmFsdWVMYWJlbH19QGlmIChzZWxlY3Rpb24pIHs8c3Bhbj46IDwvc3Bhbj59PC9zcGFuPlxuICAgICAgQGlmIChzZWxlY3Rpb24pIHtcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJjbS12YWx1ZS1jb250ZW50XCI+e3tzZWxlY3Rpb25WYWx1ZX19PC9zcGFuPlxuICAgICAgfVxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgQGlmIChzZWxlY3Rpb24/LmV4dHJhPy5sZW5ndGggPiAwKSB7XG4gICAgPGRpdiBjbGFzcz1cImNtLWV4dGVuZGVkLWNhcHRpb25cIj5cbiAgICAgIEBmb3IgKGl0ZW0gb2Ygc2VsZWN0aW9uPy5leHRyYTsgdHJhY2sgaXRlbS5rZXkpIHtcbiAgICAgICAgPGRpdiBjbGFzcz1cImNtLWV4dGVuZGVkLWl0ZW1cIj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImNtLWV4dGVuZGVkLWxhYmVsXCI+e3tpdGVtLmtleX19PC9zcGFuPjpcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImNtLWV4dGVuZGVkLXZhbHVlXCI+e3tpdGVtLnZhbH19PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIH1cbiAgICA8L2Rpdj5cbiAgfVxuPC9kaXY+XG59XG4iXX0=