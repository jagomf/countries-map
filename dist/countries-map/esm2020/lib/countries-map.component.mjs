import { Component, ElementRef, Input, Output, ViewChild, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { CharErrorCode } from './chart-events.interface';
import { en as countriesEN } from '@jagomf/countrieslist';
import { scale } from 'chroma-js';
import * as i0 from "@angular/core";
import * as i1 from "./base-map.component";
import * as i2 from "@angular/common";
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
    get loading() {
        return this.innerLoading;
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
}
CountriesMapComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: CountriesMapComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
CountriesMapComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.4.0", type: CountriesMapComponent, selector: "countries-map", inputs: { data: "data", countryLabel: "countryLabel", valueLabel: "valueLabel", showCaption: "showCaption", captionBelow: "captionBelow", minValue: "minValue", maxValue: "maxValue", minColor: "minColor", maxColor: "maxColor", backgroundColor: "backgroundColor", noDataColor: "noDataColor", exceptionColor: "exceptionColor" }, outputs: { chartReady: "chartReady", chartError: "chartError", chartSelect: "chartSelect" }, viewQueries: [{ propertyName: "mapContent", first: true, predicate: ["mapContent"], descendants: true, read: ElementRef }], usesOnChanges: true, ngImport: i0, template: "<div class=\"major-block loading\" *ngIf=\"loading\"><span class=\"text\">Loading map...</span></div>\n\n<countries-map-base class=\"major-block cm-map-content\" #mapContent (click)=\"onMapSelect($event)\" [ngClass]=\"{'goes-first': captionBelow}\">\n</countries-map-base>\n\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\"\n  *ngIf=\"!loading && showCaption\">\n  <div class=\"cm-simple-caption\">\n    <div class=\"cm-country-label\">\n      <span class=\"cm-default-label\" *ngIf=\"!selection\">{{countryLabel}}</span>\n      <span class=\"cm-country-name\" *ngIf=\"selection\">{{selection?.countryName}}</span>\n    </div>\n    <div class=\"cm-value-label\">\n      <span class=\"cm-value-text\"\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}<span *ngIf=\"selection\">: </span></span>\n      <span class=\"cm-value-content\" *ngIf=\"selection\">{{selectionValue}}</span>\n    </div>\n  </div>\n  <div class=\"cm-extended-caption\" *ngIf=\"selection?.extra && selection?.extra.length > 0\">\n    <div *ngFor=\"let item of selection?.extra\" class=\"cm-extended-item\">\n      <span class=\"cm-extended-label\">{{item.key}}</span>:\n      <span class=\"cm-extended-value\">{{item.val}}</span>\n    </div>\n  </div>\n</div>\n", styles: [":host{display:flex;flex-flow:column nowrap;justify-content:space-between;align-items:stretch;align-content:stretch}.major-block.loading{flex:0 1 auto;align-self:center}.major-block.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{flex:0 1 auto;display:flex;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{flex:0 1 auto;align-self:flex-start}.cm-value-label{flex:0 1 auto;align-self:flex-end}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}\n"], components: [{ type: i1.CountriesMapBaseComponent, selector: "countries-map-base" }], directives: [{ type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: CountriesMapComponent, decorators: [{
            type: Component,
            args: [{ selector: 'countries-map', changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"major-block loading\" *ngIf=\"loading\"><span class=\"text\">Loading map...</span></div>\n\n<countries-map-base class=\"major-block cm-map-content\" #mapContent (click)=\"onMapSelect($event)\" [ngClass]=\"{'goes-first': captionBelow}\">\n</countries-map-base>\n\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\"\n  *ngIf=\"!loading && showCaption\">\n  <div class=\"cm-simple-caption\">\n    <div class=\"cm-country-label\">\n      <span class=\"cm-default-label\" *ngIf=\"!selection\">{{countryLabel}}</span>\n      <span class=\"cm-country-name\" *ngIf=\"selection\">{{selection?.countryName}}</span>\n    </div>\n    <div class=\"cm-value-label\">\n      <span class=\"cm-value-text\"\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}<span *ngIf=\"selection\">: </span></span>\n      <span class=\"cm-value-content\" *ngIf=\"selection\">{{selectionValue}}</span>\n    </div>\n  </div>\n  <div class=\"cm-extended-caption\" *ngIf=\"selection?.extra && selection?.extra.length > 0\">\n    <div *ngFor=\"let item of selection?.extra\" class=\"cm-extended-item\">\n      <span class=\"cm-extended-label\">{{item.key}}</span>:\n      <span class=\"cm-extended-value\">{{item.val}}</span>\n    </div>\n  </div>\n</div>\n", styles: [":host{display:flex;flex-flow:column nowrap;justify-content:space-between;align-items:stretch;align-content:stretch}.major-block.loading{flex:0 1 auto;align-self:center}.major-block.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{flex:0 1 auto;display:flex;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{flex:0 1 auto;align-self:flex-start}.cm-value-label{flex:0 1 auto;align-self:flex-end}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }]; }, propDecorators: { data: [{
                type: Input
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9saWIvc3JjL2xpYi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvbGliL2NvdW50cmllcy1tYXAuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLE1BQU0sRUFDTixTQUFTLEVBQ1QsdUJBQXVCLEVBRXZCLFlBQVksRUFJYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFJekQsT0FBTyxFQUFFLEVBQUUsSUFBSSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sV0FBVyxDQUFDOzs7O0FBRWxDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksS0FBSyxJQUFJLENBQUM7QUFDcEUsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFpQixFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBRTNFLE1BQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQztBQUNqQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDeEIsTUFBTSxjQUFjLEdBQUcsQ0FBQyxTQUFrQixFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQzNFLE1BQU0sY0FBYyxHQUFHLENBQUMsU0FBa0IsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNB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S0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3pDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ25DO2FBQU07WUFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFCO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7a0hBNUtVLHFCQUFxQjtzR0FBckIscUJBQXFCLDZpQkFtQmdCLFVBQVUsa0RDekQ1RCx3d0NBeUJBOzJGRGFhLHFCQUFxQjtrQkFOakMsU0FBUzsrQkFDRSxlQUFlLG1CQUNSLHVCQUF1QixDQUFDLE1BQU07d0dBTXRDLElBQUk7c0JBQVosS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLFFBQVE7c0JBQWhCLEtBQUs7Z0JBQ0csZUFBZTtzQkFBdkIsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLGNBQWM7c0JBQXRCLEtBQUs7Z0JBRXFCLFVBQVU7c0JBQXBDLE1BQU07Z0JBQ29CLFVBQVU7c0JBQXBDLE1BQU07Z0JBQ29CLFdBQVc7c0JBQXJDLE1BQU07Z0JBRXdFLFVBQVU7c0JBQXhGLFNBQVM7dUJBQUMsWUFBWSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBWaWV3Q2hpbGQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBBZnRlclZpZXdJbml0LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDaGFyRXJyb3JDb2RlIH0gZnJvbSAnLi9jaGFydC1ldmVudHMuaW50ZXJmYWNlJztcbmltcG9ydCB0eXBlIHsgQ2hhcnRTZWxlY3RFdmVudCwgQ2hhcnRFcnJvckV2ZW50IH0gZnJvbSAnLi9jaGFydC1ldmVudHMuaW50ZXJmYWNlJztcbmltcG9ydCB0eXBlIHsgQ291bnRyaWVzRGF0YSwgU2VsZWN0aW9uRXh0cmEsIERyYXdhYmxlQ291bnRyaWVzLCBTZWxlY3Rpb24sXG4gIFZhbGlkRXh0cmFEYXRhLCBEcmF3YWJsZUNvdW50cnksIENvdW50cnlEYXRhIH0gZnJvbSAnLi9kYXRhLXR5cGVzLmludGVyZmFjZSc7XG5pbXBvcnQgeyBlbiBhcyBjb3VudHJpZXNFTiB9IGZyb20gJ0BqYWdvbWYvY291bnRyaWVzbGlzdCc7XG5pbXBvcnQgeyBzY2FsZSB9IGZyb20gJ2Nocm9tYS1qcyc7XG5cbmNvbnN0IGV4aXN0cyA9IGl0ZW0gPT4gdHlwZW9mIGl0ZW0gIT09ICd1bmRlZmluZWQnICYmIGl0ZW0gIT09IG51bGw7XG5jb25zdCBjb3VudHJ5TnVtID0gKGl0ZW06IENvdW50cnlEYXRhKSA9PiBwYXJzZUludChpdGVtLnZhbHVlPy50b1N0cmluZygpKTtcblxuY29uc3QgY291bnRyeUNsYXNzID0gJ2NvdW50cnl4eCc7XG5jb25zdCBvY2VhbklkID0gJ29jZWFuJztcbmNvbnN0IGdldFN0cm9rZVdpZHRoID0gKGlzSG92ZXJlZDogYm9vbGVhbikgPT4gaXNIb3ZlcmVkID8gJzAuMiUnIDogJzAuMSUnO1xuY29uc3QgZ2V0U3Ryb2tlQ29sb3IgPSAoaXNIb3ZlcmVkOiBib29sZWFuKSA9PiBpc0hvdmVyZWQgPyAnIzg4OCcgOiAnI2FmYWZhZic7XG5cbmNvbnN0IGNvdW50cnlOYW1lID0gKGNvdW50cnlDb2RlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xuICByZXR1cm4gY291bnRyaWVzRU5bY291bnRyeUNvZGVdO1xufTtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY291bnRyaWVzLW1hcCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB0ZW1wbGF0ZVVybDogJy4vY291bnRyaWVzLW1hcC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NvdW50cmllcy1tYXAuY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBDb3VudHJpZXNNYXBDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMge1xuXG4gIEBJbnB1dCgpIGRhdGE6IENvdW50cmllc0RhdGE7XG4gIEBJbnB1dCgpIGNvdW50cnlMYWJlbCA9ICdDb3VudHJ5JztcbiAgQElucHV0KCkgdmFsdWVMYWJlbCA9ICdWYWx1ZSc7XG4gIEBJbnB1dCgpIHNob3dDYXB0aW9uID0gdHJ1ZTtcbiAgQElucHV0KCkgY2FwdGlvbkJlbG93ID0gdHJ1ZTtcbiAgQElucHV0KCkgbWluVmFsdWU6IG51bWJlcjtcbiAgQElucHV0KCkgbWF4VmFsdWU6IG51bWJlcjtcbiAgQElucHV0KCkgbWluQ29sb3IgPSAnd2hpdGUnO1xuICBASW5wdXQoKSBtYXhDb2xvciA9ICdyZWQnO1xuICBASW5wdXQoKSBiYWNrZ3JvdW5kQ29sb3IgPSAnd2hpdGUnO1xuICBASW5wdXQoKSBub0RhdGFDb2xvciA9ICcjQ0ZDRkNGJztcbiAgQElucHV0KCkgZXhjZXB0aW9uQ29sb3IgPSAnI0ZGRUU1OCc7XG5cbiAgQE91dHB1dCgpIHByaXZhdGUgcmVhZG9ubHkgY2hhcnRSZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgQE91dHB1dCgpIHByaXZhdGUgcmVhZG9ubHkgY2hhcnRFcnJvciA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRFcnJvckV2ZW50PigpO1xuICBAT3V0cHV0KCkgcHJpdmF0ZSByZWFkb25seSBjaGFydFNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRTZWxlY3RFdmVudD4oKTtcblxuICBAVmlld0NoaWxkKCdtYXBDb250ZW50JywgeyBzdGF0aWM6IGZhbHNlLCByZWFkOiBFbGVtZW50UmVmIH0pIHByaXZhdGUgcmVhZG9ubHkgbWFwQ29udGVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG5cbiAgbWFwRGF0YTogRHJhd2FibGVDb3VudHJpZXM7XG4gIHNlbGVjdGlvbjogU2VsZWN0aW9uIHwgbnVsbCA9IG51bGw7XG5cbiAgcHJpdmF0ZSBpbm5lckxvYWRpbmcgPSB0cnVlO1xuICBnZXQgbG9hZGluZygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pbm5lckxvYWRpbmc7XG4gIH1cblxuICBnZXQgc2VsZWN0aW9uVmFsdWUoKTogVmFsaWRFeHRyYURhdGEge1xuICAgIHJldHVybiB0aGlzLmRhdGFbdGhpcy5zZWxlY3Rpb24uY291bnRyeUlkXS52YWx1ZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2RSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICApIHsgfVxuXG4gIHByaXZhdGUgZ2V0RXh0cmFTZWxlY3RlZChjb3VudHJ5OiBzdHJpbmcpOiBTZWxlY3Rpb25FeHRyYVtdIHwgbnVsbCB7XG4gICAgY29uc3QgeyBleHRyYSB9ID0gdGhpcy5kYXRhW2NvdW50cnldO1xuICAgIHJldHVybiBleHRyYSAmJiBPYmplY3Qua2V5cyhleHRyYSkubWFwKGtleSA9PiAoeyBrZXksIHZhbDogZXh0cmFba2V5XSB9KSk7XG4gIH1cblxuICBwcml2YXRlIHNlbGVjdENvdW50cnkoY291bnRyeT86IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2VsZWN0aW9uID0gY291bnRyeSA/IHtcbiAgICAgIGNvdW50cnlJZDogY291bnRyeSxcbiAgICAgIGNvdW50cnlOYW1lOiBjb3VudHJ5TmFtZShjb3VudHJ5KSxcbiAgICAgIGV4dHJhOiB0aGlzLmdldEV4dHJhU2VsZWN0ZWQoY291bnRyeSlcbiAgICB9IDogbnVsbDtcbiAgICB0aGlzLmNkUmVmLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmluaXRpYWxpemVNYXAoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCBjaGFuZ2VkTWFwVmFsdWVCdXROb3RPblN0YXJ0ID0gWydkYXRhJywgJ21pbkNvbG9yJywgJ21heENvbG9yJywgJ2JhY2tncm91bmRDb2xvcicsICdub0RhdGFDb2xvcicsICdleGNlcHRpb25Db2xvciddXG4gICAgICAuc29tZShhdHRyID0+IGNoYW5nZXNbYXR0cl0gJiYgIWNoYW5nZXNbYXR0cl0uZmlyc3RDaGFuZ2UpO1xuXG4gICAgaWYgKGNoYW5nZWRNYXBWYWx1ZUJ1dE5vdE9uU3RhcnQpIHtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZU1hcCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5pdGlhbGl6ZU1hcCgpOiB2b2lkIHtcbiAgICB0cnkge1xuICAgICAgLy8gZGF0YSBpcyBwcm92aWRlZDogbWlnaHQgYmUgYWJsZSB0byBwYWludCBjb3VudHJpZXMgaW4gY29sb3JzXG4gICAgICBpZiAodGhpcy5kYXRhKSB7XG4gICAgICAgIC8vIGdldCBoaWdoZXN0IHZhbHVlIGluIHJhbmdlXG4gICAgICAgIGNvbnN0IG1heFZhbCA9IGV4aXN0cyh0aGlzLm1heFZhbHVlKSA/IHRoaXMubWF4VmFsdWUgOiBPYmplY3QudmFsdWVzKHRoaXMuZGF0YSkucmVkdWNlKFxuICAgICAgICAgIChhY2MsIGN1cnIpID0+IGNvdW50cnlOdW0oY3VycikgPiBhY2MgfHwgYWNjID09PSBudWxsPyBjb3VudHJ5TnVtKGN1cnIpIDogYWNjLCBudWxsIGFzIG51bWJlclxuICAgICAgICApO1xuICAgICAgICAvLyBnZXQgbG93ZXN0IHZhbHVlIGluIHJhbmdlXG4gICAgICAgIGNvbnN0IG1pblZhbCA9IGV4aXN0cyh0aGlzLm1pblZhbHVlKSA/IHRoaXMubWluVmFsdWUgOiBPYmplY3QudmFsdWVzKHRoaXMuZGF0YSkucmVkdWNlKFxuICAgICAgICAgIChhY2MsIGN1cnIpID0+IGNvdW50cnlOdW0oY3VycikgPCBhY2MgfHwgYWNjID09PSBudWxsPyBjb3VudHJ5TnVtKGN1cnIpIDogYWNjLCBudWxsIGFzIG51bWJlclxuICAgICAgICApO1xuXG4gICAgICAgIC8vIG1hcCB2YWx1ZXMgaW4gcmFuZ2UgdG8gY29sb3JzXG4gICAgICAgIGNvbnN0IHZhbFRvQ29sID0gc2NhbGUoW3RoaXMubWluQ29sb3IsIHRoaXMubWF4Q29sb3JdKS5jb2xvcnMoKG1heFZhbCA/PyAxKSAtIChtaW5WYWwgPz8gMCkgKyAxKS5yZWR1Y2UoKGFjYywgY3VyciwgaSkgPT5cbiAgICAgICAgICAoeyAuLi5hY2MsIFtpICsgbWluVmFsXTogY3VyciB9KSwge30gYXMgeyBba2V5OiBudW1iZXJdOiBzdHJpbmcgfVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBsb2NhbCBNYXAgdXNpbmcgcHJvdmlkZWQgZGF0YSArIGNhbGN1bGF0ZWQgY29sb3JzXG4gICAgICAgIHRoaXMubWFwRGF0YSA9IE9iamVjdC5lbnRyaWVzKHRoaXMuZGF0YSkucmVkdWNlKChhY2MsIFsgY291bnRyeUlkLCBjb3VudHJ5VmFsIF0pID0+XG4gICAgICAgICAgKHsgLi4uYWNjLFxuICAgICAgICAgICAgW2NvdW50cnlJZC50b0xvd2VyQ2FzZSgpXToge1xuICAgICAgICAgICAgICAuLi5jb3VudHJ5VmFsLFxuICAgICAgICAgICAgICBjb2xvcjogdmFsVG9Db2xbY291bnRyeU51bShjb3VudHJ5VmFsKV0gLy8gdmFsdWUgaW4gYmV0d2VlbiBtaW5WYWwgYW5kIG1heFZhbFxuICAgICAgICAgICAgICAgIHx8IChcbiAgICAgICAgICAgICAgICAgIC8vIHZhbHVlIGJlbG93IG1pblZhbFxuICAgICAgICAgICAgICAgICAgY291bnRyeU51bShjb3VudHJ5VmFsKSA8PSBtaW5WYWwgPyB2YWxUb0NvbFttaW5WYWxdIDpcbiAgICAgICAgICAgICAgICAgIC8vIHZhbHVlIGFib3ZlIG1heFZhbFxuICAgICAgICAgICAgICAgICAgY291bnRyeU51bShjb3VudHJ5VmFsKSA+PSBtYXhWYWwgPyB2YWxUb0NvbFttYXhWYWxdXG4gICAgICAgICAgICAgICAgICAvLyB3ZWlyZDsgc2hvdWxkIG5ldmVyIGdldCB0byBoZXJlXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5leGNlcHRpb25Db2xvclxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0gYXMgRHJhd2FibGVDb3VudHJ5IH0pLFxuICAgICAgICAgIHt9IGFzIERyYXdhYmxlQ291bnRyaWVzXG4gICAgICAgICk7XG5cbiAgICAgIC8vIG5vIGRhdGEgcHJvdmlkZWQ6IHdpbGwgcGFpbnQgcGxhaW4gbWFwXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1hcERhdGEgPSB7fTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3ZnTWFwID0gdGhpcy5tYXBDb250ZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0gYXMgU1ZHU1ZHRWxlbWVudDtcbiAgICAgIHN2Z01hcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmJhY2tncm91bmRDb2xvcjtcbiAgICAgIHN2Z01hcC5xdWVyeVNlbGVjdG9yQWxsPFNWR1NWR0VsZW1lbnQ+KGAuJHtjb3VudHJ5Q2xhc3N9YCkuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgY29uc3QgbWFwSXRlbSA9IHRoaXMubWFwRGF0YVtpdGVtLmlkLnRvTG93ZXJDYXNlKCldO1xuICAgICAgICBjb25zdCBpc0V4Y2VwdGlvbiA9IG1hcEl0ZW0gPyAhZXhpc3RzKG1hcEl0ZW0udmFsdWUpIDogZmFsc2U7XG4gICAgICAgIGl0ZW0uc3R5bGUuZmlsbCA9IG1hcEl0ZW0gPyBpc0V4Y2VwdGlvbiA/IHRoaXMuZXhjZXB0aW9uQ29sb3IgOiBtYXBJdGVtLmNvbG9yIDogdGhpcy5ub0RhdGFDb2xvcjtcbiAgICAgICAgaXRlbS5vbm1vdXNlZW50ZXIgPSB0aGlzLmNvdW50cnlIb3Zlci5iaW5kKHRoaXMsIGl0ZW0sIHRydWUpO1xuICAgICAgICBpdGVtLm9ubW91c2VsZWF2ZSA9IHRoaXMuY291bnRyeUhvdmVyLmJpbmQodGhpcywgaXRlbSwgZmFsc2UpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIHRoaXMuaW5uZXJMb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLm9uQ2hhcnRSZWFkeSgpO1xuICAgICAgdGhpcy5jZFJlZi5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLm9uQ2hhcnRlcnJvcih7IGlkOiBDaGFyRXJyb3JDb2RlLmxvYWRpbmcsIG1lc3NhZ2U6ICdDb3VsZCBub3QgbG9hZCcgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjb3VudHJ5SG92ZXIoaXRlbTogU1ZHRWxlbWVudCwgaG92ZXJlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIGl0ZW0uc3R5bGUuc3Ryb2tlV2lkdGggPSBnZXRTdHJva2VXaWR0aChob3ZlcmVkKTtcbiAgICBpdGVtLnN0eWxlLnN0cm9rZSA9IGdldFN0cm9rZUNvbG9yKGhvdmVyZWQpO1xuICAgIGl0ZW0ucXVlcnlTZWxlY3RvckFsbDxTVkdFbGVtZW50PignLmxhbmR4eCcpLmZvckVhY2goaSA9PiB7XG4gICAgICBpLnN0eWxlLnN0cm9rZVdpZHRoID0gZ2V0U3Ryb2tlV2lkdGgoaG92ZXJlZCk7XG4gICAgICBpLnN0eWxlLnN0cm9rZSA9IGdldFN0cm9rZUNvbG9yKGhvdmVyZWQpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkNoYXJ0UmVhZHkoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaW5uZXJMb2FkaW5nKSB7XG4gICAgICB0aGlzLmlubmVyTG9hZGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5jaGFydFJlYWR5LmVtaXQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uQ2hhcnRlcnJvcihlcnJvcjogQ2hhcnRFcnJvckV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5jaGFydEVycm9yLmVtaXQoZXJyb3IpO1xuICB9XG5cbiAgb25NYXBTZWxlY3QoeyB0YXJnZXQgfTogeyB0YXJnZXQ/OiBTVkdFbGVtZW50IH0pOiB2b2lkIHtcbiAgICBjb25zdCBldmVudDogQ2hhcnRTZWxlY3RFdmVudCA9IHtcbiAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgY291bnRyeTogbnVsbFxuICAgIH07XG5cbiAgICBsZXQgbmV3SXRlbTogU1ZHRWxlbWVudDtcbiAgICBpZiAodGFyZ2V0LmlkID09PSBvY2VhbklkKSB7XG4gICAgICB0aGlzLnNlbGVjdENvdW50cnkobnVsbCk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgbmV3SXRlbSA9IHRhcmdldDtcbiAgICAgIHdoaWxlICghbmV3SXRlbS5jbGFzc0xpc3QuY29udGFpbnMoY291bnRyeUNsYXNzKSkge1xuICAgICAgICBuZXdJdGVtID0gbmV3SXRlbS5wYXJlbnROb2RlIGFzIFNWR0VsZW1lbnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY291bnRyeSA9IHRoaXMubWFwRGF0YVtuZXdJdGVtPy5pZF07XG4gICAgaWYgKGNvdW50cnkpIHtcbiAgICAgIGV2ZW50LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIGV2ZW50LnZhbHVlID0gY291bnRyeU51bShjb3VudHJ5KTtcbiAgICAgIGV2ZW50LmNvdW50cnkgPSBuZXdJdGVtLmlkLnRvVXBwZXJDYXNlKCk7XG4gICAgICB0aGlzLnNlbGVjdENvdW50cnkoZXZlbnQuY291bnRyeSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0Q291bnRyeShudWxsKTtcbiAgICB9XG4gICAgdGhpcy5jaGFydFNlbGVjdC5lbWl0KGV2ZW50KTtcbiAgfVxuXG59XG4iLCI8ZGl2IGNsYXNzPVwibWFqb3ItYmxvY2sgbG9hZGluZ1wiICpuZ0lmPVwibG9hZGluZ1wiPjxzcGFuIGNsYXNzPVwidGV4dFwiPkxvYWRpbmcgbWFwLi4uPC9zcGFuPjwvZGl2PlxuXG48Y291bnRyaWVzLW1hcC1iYXNlIGNsYXNzPVwibWFqb3ItYmxvY2sgY20tbWFwLWNvbnRlbnRcIiAjbWFwQ29udGVudCAoY2xpY2spPVwib25NYXBTZWxlY3QoJGV2ZW50KVwiIFtuZ0NsYXNzXT1cInsnZ29lcy1maXJzdCc6IGNhcHRpb25CZWxvd31cIj5cbjwvY291bnRyaWVzLW1hcC1iYXNlPlxuXG48ZGl2IGNsYXNzPVwibWFqb3ItYmxvY2sgY20tY2FwdGlvbi1jb250YWluZXJcIiBbbmdDbGFzc109XCJ7J2dvZXMtZmlyc3QnOiAhY2FwdGlvbkJlbG93fVwiXG4gICpuZ0lmPVwiIWxvYWRpbmcgJiYgc2hvd0NhcHRpb25cIj5cbiAgPGRpdiBjbGFzcz1cImNtLXNpbXBsZS1jYXB0aW9uXCI+XG4gICAgPGRpdiBjbGFzcz1cImNtLWNvdW50cnktbGFiZWxcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY20tZGVmYXVsdC1sYWJlbFwiICpuZ0lmPVwiIXNlbGVjdGlvblwiPnt7Y291bnRyeUxhYmVsfX08L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cImNtLWNvdW50cnktbmFtZVwiICpuZ0lmPVwic2VsZWN0aW9uXCI+e3tzZWxlY3Rpb24/LmNvdW50cnlOYW1lfX08L3NwYW4+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImNtLXZhbHVlLWxhYmVsXCI+XG4gICAgICA8c3BhbiBjbGFzcz1cImNtLXZhbHVlLXRleHRcIlxuICAgICAgICBbbmdDbGFzc109XCJ7J2hhcy12YWx1ZSc6IHNlbGVjdGlvbn1cIj57e3ZhbHVlTGFiZWx9fTxzcGFuICpuZ0lmPVwic2VsZWN0aW9uXCI+OiA8L3NwYW4+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJjbS12YWx1ZS1jb250ZW50XCIgKm5nSWY9XCJzZWxlY3Rpb25cIj57e3NlbGVjdGlvblZhbHVlfX08L3NwYW4+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuICA8ZGl2IGNsYXNzPVwiY20tZXh0ZW5kZWQtY2FwdGlvblwiICpuZ0lmPVwic2VsZWN0aW9uPy5leHRyYSAmJiBzZWxlY3Rpb24/LmV4dHJhLmxlbmd0aCA+IDBcIj5cbiAgICA8ZGl2ICpuZ0Zvcj1cImxldCBpdGVtIG9mIHNlbGVjdGlvbj8uZXh0cmFcIiBjbGFzcz1cImNtLWV4dGVuZGVkLWl0ZW1cIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY20tZXh0ZW5kZWQtbGFiZWxcIj57e2l0ZW0ua2V5fX08L3NwYW4+OlxuICAgICAgPHNwYW4gY2xhc3M9XCJjbS1leHRlbmRlZC12YWx1ZVwiPnt7aXRlbS52YWx9fTwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG48L2Rpdj5cbiJdfQ==