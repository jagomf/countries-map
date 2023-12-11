import { Component, ElementRef, Input, Output, ViewChild, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { CharErrorCode } from './chart-events.interface';
import { en as countriesEN } from '@jagomf/countrieslist';
import { scale } from 'chroma-js';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./base-map.component";
const exists = item => typeof item !== 'undefined' && item !== null;
const countryNum = (item) => parseInt(item.value?.toString());
const countryClass = 'countryxx';
const oceanId = 'ocean';
const getStrokeWidth = (isHovered) => isHovered ? '0.2%' : '0.1%';
const getStrokeColor = (isHovered) => isHovered ? '#888' : '#afafaf';
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
    constructor(cdRef) {
        this.cdRef = cdRef;
        this.countryLabel = 'Country';
        this.valueLabel = 'Value';
        this.showCaption = true;
        this.captionBelow = true;
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
    ngAfterViewInit() {
        this.initializeMap();
    }
    ngOnChanges(changes) {
        const changedMapValueButNotOnStart = ['data', 'minColor', 'maxColor', 'backgroundColor', 'noDataColor', 'exceptionColor']
            .some(attr => changes[attr] && !changes[attr].firstChange);
        if (changedMapValueButNotOnStart) {
            this.initializeMap();
        }
    }
    initializeMap() {
        try {
            // data is provided: might be able to paint countries in colors
            if (this.data) {
                // get highest value in range
                const maxVal = exists(this.maxValue) ? this.maxValue : Object.values(this.data).reduce((acc, curr) => countryNum(curr) > acc || acc === null ? countryNum(curr) : acc, null);
                // get lowest value in range
                const minVal = exists(this.minValue) ? this.minValue : Object.values(this.data).reduce((acc, curr) => countryNum(curr) < acc || acc === null ? countryNum(curr) : acc, null);
                // map values in range to colors
                const valToCol = scale([this.minColor, this.maxColor]).colors((maxVal ?? 1) - (minVal ?? 0) + 1).reduce((acc, curr, i) => ({ ...acc, [i + minVal]: curr }), {});
                // create local Map using provided data + calculated colors
                this.mapData = Object.entries(this.data).reduce((acc, [countryId, countryVal]) => ({ ...acc,
                    [countryId.toLowerCase()]: {
                        ...countryVal,
                        color: valToCol[countryNum(countryVal)] // value in between minVal and maxVal
                            || (
                            // value below minVal
                            countryNum(countryVal) <= minVal ? valToCol[minVal] :
                                // value above maxVal
                                countryNum(countryVal) >= maxVal ? valToCol[maxVal]
                                    // weird; should never get to here
                                    : this.exceptionColor)
                    } }), {});
                // no data provided: will paint plain map
            }
            else {
                this.mapData = {};
            }
            const svgMap = this.mapContent.nativeElement.children[0];
            svgMap.style.backgroundColor = this.backgroundColor;
            svgMap.querySelectorAll(`.${countryClass}`).forEach(item => {
                const mapItem = this.mapData[item.id.toLowerCase()];
                const isException = mapItem ? !exists(mapItem.value) : false;
                item.style.fill = mapItem ? isException ? this.exceptionColor : mapItem.color : this.noDataColor;
                item.onmouseenter = this.countryHover.bind(this, item, true);
                item.onmouseleave = this.countryHover.bind(this, item, false);
            });
            // this.innerLoading = false;
            this.onChartReady();
            this.cdRef.detectChanges();
        }
        catch (e) {
            this.onCharterror({ id: CharErrorCode.loading, message: 'Could not load' });
        }
    }
    countryHover(item, hovered) {
        item.style.strokeWidth = getStrokeWidth(hovered);
        item.style.stroke = getStrokeColor(hovered);
        item.querySelectorAll('.landxx').forEach(i => {
            i.style.strokeWidth = getStrokeWidth(hovered);
            i.style.stroke = getStrokeColor(hovered);
        });
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
    onMapSelect({ target }) {
        const event = {
            selected: false,
            value: null,
            country: null
        };
        let newItem;
        if (target.id === oceanId) {
            this.selectCountry(null);
        }
        else {
            newItem = target;
            while (!newItem.classList.contains(countryClass)) {
                newItem = newItem.parentNode;
            }
        }
        const country = this.mapData[newItem?.id];
        if (country) {
            event.selected = true;
            event.value = countryNum(country);
            event.country = newItem.id.toUpperCase();
            this.selectCountry(event.country);
        }
        else {
            this.selectCountry(null);
        }
        this.chartSelect.emit(event);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: CountriesMapComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.2.12", type: CountriesMapComponent, selector: "countries-map", inputs: { data: "data", countryLabel: "countryLabel", valueLabel: "valueLabel", showCaption: "showCaption", captionBelow: "captionBelow", minValue: "minValue", maxValue: "maxValue", minColor: "minColor", maxColor: "maxColor", backgroundColor: "backgroundColor", noDataColor: "noDataColor", exceptionColor: "exceptionColor" }, outputs: { chartReady: "chartReady", chartError: "chartError", chartSelect: "chartSelect" }, viewQueries: [{ propertyName: "mapContent", first: true, predicate: ["mapContent"], descendants: true, read: ElementRef }], usesOnChanges: true, ngImport: i0, template: "<div class=\"major-block loading\" *ngIf=\"loading\"><span class=\"text\">Loading map...</span></div>\n\n<countries-map-base class=\"major-block cm-map-content\" #mapContent (click)=\"onMapSelect($event)\" [ngClass]=\"{'goes-first': captionBelow}\">\n</countries-map-base>\n\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\"\n  *ngIf=\"!loading && showCaption\">\n  <div class=\"cm-simple-caption\">\n    <div class=\"cm-country-label\">\n      <span class=\"cm-default-label\" *ngIf=\"!selection\">{{countryLabel}}</span>\n      <span class=\"cm-country-name\" *ngIf=\"selection\">{{selection?.countryName}}</span>\n    </div>\n    <div class=\"cm-value-label\">\n      <span class=\"cm-value-text\"\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}<span *ngIf=\"selection\">: </span></span>\n      <span class=\"cm-value-content\" *ngIf=\"selection\">{{selectionValue}}</span>\n    </div>\n  </div>\n  <div class=\"cm-extended-caption\" *ngIf=\"selection?.extra && selection?.extra.length > 0\">\n    <div *ngFor=\"let item of selection?.extra\" class=\"cm-extended-item\">\n      <span class=\"cm-extended-label\">{{item.key}}</span>:\n      <span class=\"cm-extended-value\">{{item.val}}</span>\n    </div>\n  </div>\n</div>\n", styles: [":host{display:flex;flex-flow:column nowrap;justify-content:space-between;align-items:stretch;align-content:stretch}.major-block.loading{flex:0 1 auto;align-self:center}.major-block.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{flex:0 1 auto;display:flex;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{flex:0 1 auto;align-self:flex-start}.cm-value-label{flex:0 1 auto;align-self:flex-end}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i2.CountriesMapBaseComponent, selector: "countries-map-base" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: CountriesMapComponent, decorators: [{
            type: Component,
            args: [{ selector: 'countries-map', changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"major-block loading\" *ngIf=\"loading\"><span class=\"text\">Loading map...</span></div>\n\n<countries-map-base class=\"major-block cm-map-content\" #mapContent (click)=\"onMapSelect($event)\" [ngClass]=\"{'goes-first': captionBelow}\">\n</countries-map-base>\n\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\"\n  *ngIf=\"!loading && showCaption\">\n  <div class=\"cm-simple-caption\">\n    <div class=\"cm-country-label\">\n      <span class=\"cm-default-label\" *ngIf=\"!selection\">{{countryLabel}}</span>\n      <span class=\"cm-country-name\" *ngIf=\"selection\">{{selection?.countryName}}</span>\n    </div>\n    <div class=\"cm-value-label\">\n      <span class=\"cm-value-text\"\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}<span *ngIf=\"selection\">: </span></span>\n      <span class=\"cm-value-content\" *ngIf=\"selection\">{{selectionValue}}</span>\n    </div>\n  </div>\n  <div class=\"cm-extended-caption\" *ngIf=\"selection?.extra && selection?.extra.length > 0\">\n    <div *ngFor=\"let item of selection?.extra\" class=\"cm-extended-item\">\n      <span class=\"cm-extended-label\">{{item.key}}</span>:\n      <span class=\"cm-extended-value\">{{item.val}}</span>\n    </div>\n  </div>\n</div>\n", styles: [":host{display:flex;flex-flow:column nowrap;justify-content:space-between;align-items:stretch;align-content:stretch}.major-block.loading{flex:0 1 auto;align-self:center}.major-block.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{flex:0 1 auto;display:flex;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{flex:0 1 auto;align-self:flex-start}.cm-value-label{flex:0 1 auto;align-self:flex-end}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { data: [{
                type: Input,
                args: [{ required: true }]
            }], countryLabel: [{
                type: Input
            }], valueLabel: [{
                type: Input
            }], showCaption: [{
                type: Input
            }], captionBelow: [{
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
                args: ['mapContent', { static: false, read: ElementRef }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9saWIvc3JjL2xpYi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvbGliL2NvdW50cmllcy1tYXAuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLE1BQU0sRUFDTixTQUFTLEVBQ1QsdUJBQXVCLEVBRXZCLFlBQVksRUFJYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFJekQsT0FBTyxFQUFFLEVBQUUsSUFBSSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sV0FBVyxDQUFDOzs7O0FBRWxDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksS0FBSyxJQUFJLENBQUM7QUFDcEUsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFpQixFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBRTNFLE1BQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQztBQUNqQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDeEIsTUFBTSxjQUFjLEdBQUcsQ0FBQyxTQUFrQixFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQzNFLE1BQU0sY0FBYyxHQUFHLENBQUMsU0FBa0IsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNB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S0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3pDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ25DO2FBQU07WUFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFCO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQzsrR0E1S1UscUJBQXFCO21HQUFyQixxQkFBcUIsNmlCQW1CZ0IsVUFBVSxrREN6RDVELHd3Q0F5QkE7OzRGRGFhLHFCQUFxQjtrQkFOakMsU0FBUzsrQkFDRSxlQUFlLG1CQUNSLHVCQUF1QixDQUFDLE1BQU07d0dBTXBCLElBQUk7c0JBQTlCLEtBQUs7dUJBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO2dCQUNoQixZQUFZO3NCQUFwQixLQUFLO2dCQUNHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csZUFBZTtzQkFBdkIsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLGNBQWM7c0JBQXRCLEtBQUs7Z0JBRXFCLFVBQVU7c0JBQXBDLE1BQU07Z0JBQ29CLFVBQVU7c0JBQXBDLE1BQU07Z0JBQ29CLFdBQVc7c0JBQXJDLE1BQU07Z0JBRXdFLFVBQVU7c0JBQXhGLFNBQVM7dUJBQUMsWUFBWSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBBZnRlclZpZXdJbml0LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDaGFyRXJyb3JDb2RlIH0gZnJvbSAnLi9jaGFydC1ldmVudHMuaW50ZXJmYWNlJztcbmltcG9ydCB0eXBlIHsgQ2hhcnRTZWxlY3RFdmVudCwgQ2hhcnRFcnJvckV2ZW50IH0gZnJvbSAnLi9jaGFydC1ldmVudHMuaW50ZXJmYWNlJztcbmltcG9ydCB0eXBlIHsgQ291bnRyaWVzRGF0YSwgU2VsZWN0aW9uRXh0cmEsIERyYXdhYmxlQ291bnRyaWVzLCBTZWxlY3Rpb24sXG4gIFZhbGlkRXh0cmFEYXRhLCBEcmF3YWJsZUNvdW50cnksIENvdW50cnlEYXRhIH0gZnJvbSAnLi9kYXRhLXR5cGVzLmludGVyZmFjZSc7XG5pbXBvcnQgeyBlbiBhcyBjb3VudHJpZXNFTiB9IGZyb20gJ0BqYWdvbWYvY291bnRyaWVzbGlzdCc7XG5pbXBvcnQgeyBzY2FsZSB9IGZyb20gJ2Nocm9tYS1qcyc7XG5cbmNvbnN0IGV4aXN0cyA9IGl0ZW0gPT4gdHlwZW9mIGl0ZW0gIT09ICd1bmRlZmluZWQnICYmIGl0ZW0gIT09IG51bGw7XG5jb25zdCBjb3VudHJ5TnVtID0gKGl0ZW06IENvdW50cnlEYXRhKSA9PiBwYXJzZUludChpdGVtLnZhbHVlPy50b1N0cmluZygpKTtcblxuY29uc3QgY291bnRyeUNsYXNzID0gJ2NvdW50cnl4eCc7XG5jb25zdCBvY2VhbklkID0gJ29jZWFuJztcbmNvbnN0IGdldFN0cm9rZVdpZHRoID0gKGlzSG92ZXJlZDogYm9vbGVhbikgPT4gaXNIb3ZlcmVkID8gJzAuMiUnIDogJzAuMSUnO1xuY29uc3QgZ2V0U3Ryb2tlQ29sb3IgPSAoaXNIb3ZlcmVkOiBib29sZWFuKSA9PiBpc0hvdmVyZWQgPyAnIzg4OCcgOiAnI2FmYWZhZic7XG5cbmNvbnN0IGNvdW50cnlOYW1lID0gKGNvdW50cnlDb2RlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICByZXR1cm4gY291bnRyaWVzRU5bY291bnRyeUNvZGVdO1xufTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY291bnRyaWVzLW1hcCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB0ZW1wbGF0ZVVybDogJy4vY291bnRyaWVzLW1hcC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NvdW50cmllcy1tYXAuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBDb3VudHJpZXNNYXBDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMge1xuXG4gIEBJbnB1dCh7IHJlcXVpcmVkOiB0cnVlIH0pIGRhdGE6IENvdW50cmllc0RhdGE7XG4gIEBJbnB1dCgpIGNvdW50cnlMYWJlbCA9ICdDb3VudHJ5JztcbiAgQElucHV0KCkgdmFsdWVMYWJlbCA9ICdWYWx1ZSc7XG4gIEBJbnB1dCgpIHNob3dDYXB0aW9uID0gdHJ1ZTtcbiAgQElucHV0KCkgY2FwdGlvbkJlbG93ID0gdHJ1ZTtcbiAgQElucHV0KCkgbWluVmFsdWU6IG51bWJlcjtcbiAgQElucHV0KCkgbWF4VmFsdWU6IG51bWJlcjtcbiAgQElucHV0KCkgbWluQ29sb3IgPSAnd2hpdGUnO1xuICBASW5wdXQoKSBtYXhDb2xvciA9ICdyZWQnO1xuICBASW5wdXQoKSBiYWNrZ3JvdW5kQ29sb3IgPSAnd2hpdGUnO1xuICBASW5wdXQoKSBub0RhdGFDb2xvciA9ICcjQ0ZDRkNGJztcbiAgQElucHV0KCkgZXhjZXB0aW9uQ29sb3IgPSAnI0ZGRUU1OCc7XG5cbiAgQE91dHB1dCgpIHByaXZhdGUgcmVhZG9ubHkgY2hhcnRSZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgQE91dHB1dCgpIHByaXZhdGUgcmVhZG9ubHkgY2hhcnRFcnJvciA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRFcnJvckV2ZW50PigpO1xuICBAT3V0cHV0KCkgcHJpdmF0ZSByZWFkb25seSBjaGFydFNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRTZWxlY3RFdmVudD4oKTtcblxuICBAVmlld0NoaWxkKCdtYXBDb250ZW50JywgeyBzdGF0aWM6IGZhbHNlLCByZWFkOiBFbGVtZW50UmVmIH0pIHByaXZhdGUgcmVhZG9ubHkgbWFwQ29udGVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgbWFwRGF0YTogRHJhd2FibGVDb3VudHJpZXM7XG4gIHNlbGVjdGlvbjogU2VsZWN0aW9uIHwgbnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSBpbm5lckxvYWRpbmcgPSB0cnVlO1xuICBnZXQgbG9hZGluZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lckxvYWRpbmc7XG4gIH1cblxuICBnZXQgc2VsZWN0aW9uVmFsdWUoKTogVmFsaWRFeHRyYURhdGEge1xuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5zZWxlY3Rpb24uY291bnRyeUlkXS52YWx1ZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2RSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICApIHsgfVxuXG4gIHByaXZhdGUgZ2V0RXh0cmFTZWxlY3RlZChjb3VudHJ5OiBzdHJpbmcpOiBTZWxlY3Rpb25FeHRyYVtdIHwgbnVsbCB7XG4gICAgY29uc3QgeyBleHRyYSB9ID0gdGhpcy5kYXRhW2NvdW50cnldO1xuICAgIHJldHVybiBleHRyYSAmJiBPYmplY3Qua2V5cyhleHRyYSkubWFwKGtleSA9PiAoeyBrZXksIHZhbDogZXh0cmFba2V5XSB9KSk7XG4gIH1cblxuICBwcml2YXRlIHNlbGVjdENvdW50cnkoY291bnRyeT86IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0aW9uID0gY291bnRyeSA/IHtcbiAgICAgIGNvdW50cnlJZDogY291bnRyeSxcbiAgICAgIGNvdW50cnlOYW1lOiBjb3VudHJ5TmFtZShjb3VudHJ5KSxcbiAgICAgIGV4dHJhOiB0aGlzLmdldEV4dHJhU2VsZWN0ZWQoY291bnRyeSlcbiAgICB9IDogbnVsbDtcbiAgICB0aGlzLmNkUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmluaXRpYWxpemVNYXAoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCBjaGFuZ2VkTWFwVmFsdWVCdXROb3RPblN0YXJ0ID0gWydkYXRhJywgJ21pbkNvbG9yJywgJ21heENvbG9yJywgJ2JhY2tncm91bmRDb2xvcicsICdub0RhdGFDb2xvcicsICdleGNlcHRpb25Db2xvciddXG4gICAgICAuc29tZShhdHRyID0+IGNoYW5nZXNbYXR0cl0gJiYgIWNoYW5nZXNbYXR0cl0uZmlyc3RDaGFuZ2UpO1xuXG4gICAgaWYgKGNoYW5nZWRNYXBWYWx1ZUJ1dE5vdE9uU3RhcnQpIHtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZU1hcCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5pdGlhbGl6ZU1hcCgpOiB2b2lkIHtcbiAgICB0cnkge1xuICAgICAgLy8gZGF0YSBpcyBwcm92aWRlZDogbWlnaHQgYmUgYWJsZSB0byBwYWludCBjb3VudHJpZXMgaW4gY29sb3JzXG4gICAgICBpZiAodGhpcy5kYXRhKSB7XG4gICAgICAgIC8vIGdldCBoaWdoZXN0IHZhbHVlIGluIHJhbmdlXG4gICAgICAgIGNvbnN0IG1heFZhbCA9IGV4aXN0cyh0aGlzLm1heFZhbHVlKSA/IHRoaXMubWF4VmFsdWUgOiBPYmplY3QudmFsdWVzKHRoaXMuZGF0YSkucmVkdWNlKFxuICAgICAgICAgIChhY2MsIGN1cnIpID0+IGNvdW50cnlOdW0oY3VycikgPiBhY2MgfHwgYWNjID09PSBudWxsID8gY291bnRyeU51bShjdXJyKSA6IGFjYywgbnVsbCBhcyBudW1iZXJcbiAgICAgICAgKTtcbiAgICAgICAgLy8gZ2V0IGxvd2VzdCB2YWx1ZSBpbiByYW5nZVxuICAgICAgICBjb25zdCBtaW5WYWwgPSBleGlzdHModGhpcy5taW5WYWx1ZSkgPyB0aGlzLm1pblZhbHVlIDogT2JqZWN0LnZhbHVlcyh0aGlzLmRhdGEpLnJlZHVjZShcbiAgICAgICAgICAoYWNjLCBjdXJyKSA9PiBjb3VudHJ5TnVtKGN1cnIpIDwgYWNjIHx8IGFjYyA9PT0gbnVsbCA/IGNvdW50cnlOdW0oY3VycikgOiBhY2MsIG51bGwgYXMgbnVtYmVyXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gbWFwIHZhbHVlcyBpbiByYW5nZSB0byBjb2xvcnNcbiAgICAgICAgY29uc3QgdmFsVG9Db2wgPSBzY2FsZShbdGhpcy5taW5Db2xvciwgdGhpcy5tYXhDb2xvcl0pLmNvbG9ycygobWF4VmFsID8/IDEpIC0gKG1pblZhbCA/PyAwKSArIDEpLnJlZHVjZSgoYWNjLCBjdXJyLCBpKSA9PlxuICAgICAgICAgICh7IC4uLmFjYywgW2kgKyBtaW5WYWxdOiBjdXJyIH0pLCB7fSBhcyB7IFtrZXk6IG51bWJlcl06IHN0cmluZyB9XG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gY3JlYXRlIGxvY2FsIE1hcCB1c2luZyBwcm92aWRlZCBkYXRhICsgY2FsY3VsYXRlZCBjb2xvcnNcbiAgICAgICAgdGhpcy5tYXBEYXRhID0gT2JqZWN0LmVudHJpZXModGhpcy5kYXRhKS5yZWR1Y2UoKGFjYywgWyBjb3VudHJ5SWQsIGNvdW50cnlWYWwgXSkgPT5cbiAgICAgICAgICAoeyAuLi5hY2MsXG4gICAgICAgICAgICBbY291bnRyeUlkLnRvTG93ZXJDYXNlKCldOiB7XG4gICAgICAgICAgICAgIC4uLmNvdW50cnlWYWwsXG4gICAgICAgICAgICAgIGNvbG9yOiB2YWxUb0NvbFtjb3VudHJ5TnVtKGNvdW50cnlWYWwpXSAvLyB2YWx1ZSBpbiBiZXR3ZWVuIG1pblZhbCBhbmQgbWF4VmFsXG4gICAgICAgICAgICAgICAgfHwgKFxuICAgICAgICAgICAgICAgICAgLy8gdmFsdWUgYmVsb3cgbWluVmFsXG4gICAgICAgICAgICAgICAgICBjb3VudHJ5TnVtKGNvdW50cnlWYWwpIDw9IG1pblZhbCA/IHZhbFRvQ29sW21pblZhbF0gOlxuICAgICAgICAgICAgICAgICAgLy8gdmFsdWUgYWJvdmUgbWF4VmFsXG4gICAgICAgICAgICAgICAgICBjb3VudHJ5TnVtKGNvdW50cnlWYWwpID49IG1heFZhbCA/IHZhbFRvQ29sW21heFZhbF1cbiAgICAgICAgICAgICAgICAgIC8vIHdlaXJkOyBzaG91bGQgbmV2ZXIgZ2V0IHRvIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmV4Y2VwdGlvbkNvbG9yXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSBhcyBEcmF3YWJsZUNvdW50cnkgfSksXG4gICAgICAgICAge30gYXMgRHJhd2FibGVDb3VudHJpZXNcbiAgICAgICAgKTtcblxuICAgICAgLy8gbm8gZGF0YSBwcm92aWRlZDogd2lsbCBwYWludCBwbGFpbiBtYXBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubWFwRGF0YSA9IHt9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzdmdNYXAgPSB0aGlzLm1hcENvbnRlbnQubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXSBhcyBTVkdTVkdFbGVtZW50O1xuICAgICAgc3ZnTWFwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuYmFja2dyb3VuZENvbG9yO1xuICAgICAgc3ZnTWFwLnF1ZXJ5U2VsZWN0b3JBbGw8U1ZHU1ZHRWxlbWVudD4oYC4ke2NvdW50cnlDbGFzc31gKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBjb25zdCBtYXBJdGVtID0gdGhpcy5tYXBEYXRhW2l0ZW0uaWQudG9Mb3dlckNhc2UoKV07XG4gICAgICAgIGNvbnN0IGlzRXhjZXB0aW9uID0gbWFwSXRlbSA/ICFleGlzdHMobWFwSXRlbS52YWx1ZSkgOiBmYWxzZTtcbiAgICAgICAgaXRlbS5zdHlsZS5maWxsID0gbWFwSXRlbSA/IGlzRXhjZXB0aW9uID8gdGhpcy5leGNlcHRpb25Db2xvciA6IG1hcEl0ZW0uY29sb3IgOiB0aGlzLm5vRGF0YUNvbG9yO1xuICAgICAgICBpdGVtLm9ubW91c2VlbnRlciA9IHRoaXMuY291bnRyeUhvdmVyLmJpbmQodGhpcywgaXRlbSwgdHJ1ZSk7XG4gICAgICAgIGl0ZW0ub25tb3VzZWxlYXZlID0gdGhpcy5jb3VudHJ5SG92ZXIuYmluZCh0aGlzLCBpdGVtLCBmYWxzZSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gdGhpcy5pbm5lckxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMub25DaGFydFJlYWR5KCk7XG4gICAgICB0aGlzLmNkUmVmLmRldGVjdENoYW5nZXMoKTtcblxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMub25DaGFydGVycm9yKHsgaWQ6IENoYXJFcnJvckNvZGUubG9hZGluZywgbWVzc2FnZTogJ0NvdWxkIG5vdCBsb2FkJyB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNvdW50cnlIb3ZlcihpdGVtOiBTVkdFbGVtZW50LCBob3ZlcmVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgaXRlbS5zdHlsZS5zdHJva2VXaWR0aCA9IGdldFN0cm9rZVdpZHRoKGhvdmVyZWQpO1xuICAgIGl0ZW0uc3R5bGUuc3Ryb2tlID0gZ2V0U3Ryb2tlQ29sb3IoaG92ZXJlZCk7XG4gICAgaXRlbS5xdWVyeVNlbGVjdG9yQWxsPFNWR0VsZW1lbnQ+KCcubGFuZHh4JykuZm9yRWFjaChpID0+IHtcbiAgICAgIGkuc3R5bGUuc3Ryb2tlV2lkdGggPSBnZXRTdHJva2VXaWR0aChob3ZlcmVkKTtcbiAgICAgIGkuc3R5bGUuc3Ryb2tlID0gZ2V0U3Ryb2tlQ29sb3IoaG92ZXJlZCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG9uQ2hhcnRSZWFkeSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pbm5lckxvYWRpbmcpIHtcbiAgICAgIHRoaXMuaW5uZXJMb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLmNoYXJ0UmVhZHkuZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25DaGFydGVycm9yKGVycm9yOiBDaGFydEVycm9yRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmNoYXJ0RXJyb3IuZW1pdChlcnJvcik7XG4gIH1cblxuICBvbk1hcFNlbGVjdCh7IHRhcmdldCB9OiB7IHRhcmdldD86IFNWR0VsZW1lbnQgfSk6IHZvaWQge1xuICAgIGNvbnN0IGV2ZW50OiBDaGFydFNlbGVjdEV2ZW50ID0ge1xuICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgdmFsdWU6IG51bGwsXG4gICAgICBjb3VudHJ5OiBudWxsXG4gICAgfTtcblxuICAgIGxldCBuZXdJdGVtOiBTVkdFbGVtZW50O1xuICAgIGlmICh0YXJnZXQuaWQgPT09IG9jZWFuSWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0Q291bnRyeShudWxsKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBuZXdJdGVtID0gdGFyZ2V0O1xuICAgICAgd2hpbGUgKCFuZXdJdGVtLmNsYXNzTGlzdC5jb250YWlucyhjb3VudHJ5Q2xhc3MpKSB7XG4gICAgICAgIG5ld0l0ZW0gPSBuZXdJdGVtLnBhcmVudE5vZGUgYXMgU1ZHRWxlbWVudDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjb3VudHJ5ID0gdGhpcy5tYXBEYXRhW25ld0l0ZW0/LmlkXTtcbiAgICBpZiAoY291bnRyeSkge1xuICAgICAgZXZlbnQuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgZXZlbnQudmFsdWUgPSBjb3VudHJ5TnVtKGNvdW50cnkpO1xuICAgICAgZXZlbnQuY291bnRyeSA9IG5ld0l0ZW0uaWQudG9VcHBlckNhc2UoKTtcbiAgICAgIHRoaXMuc2VsZWN0Q291bnRyeShldmVudC5jb3VudHJ5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RDb3VudHJ5KG51bGwpO1xuICAgIH1cbiAgICB0aGlzLmNoYXJ0U2VsZWN0LmVtaXQoZXZlbnQpO1xuICB9XG5cbn1cbiIsIjxkaXYgY2xhc3M9XCJtYWpvci1ibG9jayBsb2FkaW5nXCIgKm5nSWY9XCJsb2FkaW5nXCI+PHNwYW4gY2xhc3M9XCJ0ZXh0XCI+TG9hZGluZyBtYXAuLi48L3NwYW4+PC9kaXY+XG5cbjxjb3VudHJpZXMtbWFwLWJhc2UgY2xhc3M9XCJtYWpvci1ibG9jayBjbS1tYXAtY29udGVudFwiICNtYXBDb250ZW50IChjbGljayk9XCJvbk1hcFNlbGVjdCgkZXZlbnQpXCIgW25nQ2xhc3NdPVwieydnb2VzLWZpcnN0JzogY2FwdGlvbkJlbG93fVwiPlxuPC9jb3VudHJpZXMtbWFwLWJhc2U+XG5cbjxkaXYgY2xhc3M9XCJtYWpvci1ibG9jayBjbS1jYXB0aW9uLWNvbnRhaW5lclwiIFtuZ0NsYXNzXT1cInsnZ29lcy1maXJzdCc6ICFjYXB0aW9uQmVsb3d9XCJcbiAgKm5nSWY9XCIhbG9hZGluZyAmJiBzaG93Q2FwdGlvblwiPlxuICA8ZGl2IGNsYXNzPVwiY20tc2ltcGxlLWNhcHRpb25cIj5cbiAgICA8ZGl2IGNsYXNzPVwiY20tY291bnRyeS1sYWJlbFwiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjbS1kZWZhdWx0LWxhYmVsXCIgKm5nSWY9XCIhc2VsZWN0aW9uXCI+e3tjb3VudHJ5TGFiZWx9fTwvc3Bhbj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY20tY291bnRyeS1uYW1lXCIgKm5nSWY9XCJzZWxlY3Rpb25cIj57e3NlbGVjdGlvbj8uY291bnRyeU5hbWV9fTwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiY20tdmFsdWUtbGFiZWxcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY20tdmFsdWUtdGV4dFwiXG4gICAgICAgIFtuZ0NsYXNzXT1cInsnaGFzLXZhbHVlJzogc2VsZWN0aW9ufVwiPnt7dmFsdWVMYWJlbH19PHNwYW4gKm5nSWY9XCJzZWxlY3Rpb25cIj46IDwvc3Bhbj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNtLXZhbHVlLWNvbnRlbnRcIiAqbmdJZj1cInNlbGVjdGlvblwiPnt7c2VsZWN0aW9uVmFsdWV9fTwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJjbS1leHRlbmRlZC1jYXB0aW9uXCIgKm5nSWY9XCJzZWxlY3Rpb24/LmV4dHJhICYmIHNlbGVjdGlvbj8uZXh0cmEubGVuZ3RoID4gMFwiPlxuICAgIDxkaXYgKm5nRm9yPVwibGV0IGl0ZW0gb2Ygc2VsZWN0aW9uPy5leHRyYVwiIGNsYXNzPVwiY20tZXh0ZW5kZWQtaXRlbVwiPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjbS1leHRlbmRlZC1sYWJlbFwiPnt7aXRlbS5rZXl9fTwvc3Bhbj46XG4gICAgICA8c3BhbiBjbGFzcz1cImNtLWV4dGVuZGVkLXZhbHVlXCI+e3tpdGVtLnZhbH19PC9zcGFuPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbjwvZGl2PlxuIl19