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
    onMapSelect(ev) {
        const event = {
            selected: false,
            value: null,
            extra: null,
            country: null
        };
        let newItem;
        if (ev.target?.id === oceanId) {
            this.selectCountry(null);
        }
        else {
            newItem = ev.target;
            while (!newItem.classList.contains(countryClass)) {
                newItem = newItem.parentNode;
            }
        }
        const country = this.mapData[newItem?.id];
        if (country) {
            event.selected = true;
            event.value = countryNum(country);
            event.country = newItem.id.toUpperCase();
            event.extra = country.extra;
            this.selectCountry(event.country);
        }
        else {
            this.selectCountry(null);
        }
        this.chartSelect.emit(event);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.6", ngImport: i0, type: CountriesMapComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "17.3.6", type: CountriesMapComponent, selector: "countries-map", inputs: { data: "data", countryLabel: "countryLabel", valueLabel: "valueLabel", showCaption: "showCaption", captionBelow: "captionBelow", minValue: "minValue", maxValue: "maxValue", minColor: "minColor", maxColor: "maxColor", backgroundColor: "backgroundColor", noDataColor: "noDataColor", exceptionColor: "exceptionColor" }, outputs: { chartReady: "chartReady", chartError: "chartError", chartSelect: "chartSelect" }, viewQueries: [{ propertyName: "mapContent", first: true, predicate: ["mapContent"], descendants: true, read: ElementRef }], usesOnChanges: true, ngImport: i0, template: "@if (loading) {\n<div class=\"major-block loading\"><span class=\"text\">Loading map...</span></div>\n}\n\n<countries-map-base class=\"major-block cm-map-content\" #mapContent (click)=\"onMapSelect($event)\" [ngClass]=\"{'goes-first': captionBelow}\"/>\n\n@if (!loading && showCaption) {\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\">\n  <div class=\"cm-simple-caption\">\n    <div class=\"cm-country-label\">\n      @if (selection) {\n        <span class=\"cm-country-name\">{{selection?.countryName}}</span>\n      } @else {\n        <span class=\"cm-default-label\">{{countryLabel}}</span>\n      }\n    </div>\n    <div class=\"cm-value-label\">\n      <span class=\"cm-value-text\"\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}@if (selection) {<span>: </span>}</span>\n      @if (selection) {\n        <span class=\"cm-value-content\">{{selectionValue}}</span>\n      }\n    </div>\n  </div>\n  @if (selection?.extra?.length > 0) {\n    <div class=\"cm-extended-caption\">\n      @for (item of selection?.extra; track item.key) {\n        <div class=\"cm-extended-item\">\n          <span class=\"cm-extended-label\">{{item.key}}</span>:\n          <span class=\"cm-extended-value\">{{item.val}}</span>\n        </div>\n      }\n    </div>\n  }\n</div>\n}\n", styles: [":host{display:flex;flex-flow:column nowrap;justify-content:space-between;align-items:stretch;align-content:stretch}.major-block.loading{flex:0 1 auto;align-self:center}.major-block.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{flex:0 1 auto;display:flex;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{flex:0 1 auto;align-self:flex-start}.cm-value-label{flex:0 1 auto;align-self:flex-end}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i2.CountriesMapBaseComponent, selector: "countries-map-base" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.6", ngImport: i0, type: CountriesMapComponent, decorators: [{
            type: Component,
            args: [{ selector: 'countries-map', changeDetection: ChangeDetectionStrategy.OnPush, template: "@if (loading) {\n<div class=\"major-block loading\"><span class=\"text\">Loading map...</span></div>\n}\n\n<countries-map-base class=\"major-block cm-map-content\" #mapContent (click)=\"onMapSelect($event)\" [ngClass]=\"{'goes-first': captionBelow}\"/>\n\n@if (!loading && showCaption) {\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\">\n  <div class=\"cm-simple-caption\">\n    <div class=\"cm-country-label\">\n      @if (selection) {\n        <span class=\"cm-country-name\">{{selection?.countryName}}</span>\n      } @else {\n        <span class=\"cm-default-label\">{{countryLabel}}</span>\n      }\n    </div>\n    <div class=\"cm-value-label\">\n      <span class=\"cm-value-text\"\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}@if (selection) {<span>: </span>}</span>\n      @if (selection) {\n        <span class=\"cm-value-content\">{{selectionValue}}</span>\n      }\n    </div>\n  </div>\n  @if (selection?.extra?.length > 0) {\n    <div class=\"cm-extended-caption\">\n      @for (item of selection?.extra; track item.key) {\n        <div class=\"cm-extended-item\">\n          <span class=\"cm-extended-label\">{{item.key}}</span>:\n          <span class=\"cm-extended-value\">{{item.val}}</span>\n        </div>\n      }\n    </div>\n  }\n</div>\n}\n", styles: [":host{display:flex;flex-flow:column nowrap;justify-content:space-between;align-items:stretch;align-content:stretch}.major-block.loading{flex:0 1 auto;align-self:center}.major-block.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{flex:0 1 auto;display:flex;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{flex:0 1 auto;align-self:flex-start}.cm-value-label{flex:0 1 auto;align-self:flex-end}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }], propDecorators: { data: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9saWIvc3JjL2xpYi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvbGliL2NvdW50cmllcy1tYXAuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLE1BQU0sRUFDTixTQUFTLEVBQ1QsdUJBQXVCLEVBRXZCLFlBQVksRUFJYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFJekQsT0FBTyxFQUFFLEVBQUUsSUFBSSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sV0FBVyxDQUFDOzs7O0FBRWxDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksS0FBSyxJQUFJLENBQUM7QUFDcEUsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFpQixFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBRTNFLE1BQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQztBQUNqQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDeEIsTUFBTSxjQUFjLEdBQUcsQ0FBQyxTQUFrQixFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQzNFLE1BQU0sY0FBYyxHQUFHLENBQUMsU0FBa0IsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNB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QUFyQyxNQUFNO2dCQUV3RSxVQUFVO3NCQUF4RixTQUFTO3VCQUFDLFlBQVksRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2hhckVycm9yQ29kZSB9IGZyb20gJy4vY2hhcnQtZXZlbnRzLmludGVyZmFjZSc7XG5pbXBvcnQgdHlwZSB7IENoYXJ0U2VsZWN0RXZlbnQsIENoYXJ0RXJyb3JFdmVudCB9IGZyb20gJy4vY2hhcnQtZXZlbnRzLmludGVyZmFjZSc7XG5pbXBvcnQgdHlwZSB7IENvdW50cmllc0RhdGEsIFNlbGVjdGlvbkV4dHJhLCBEcmF3YWJsZUNvdW50cmllcywgU2VsZWN0aW9uLFxuICBWYWxpZEV4dHJhRGF0YSwgRHJhd2FibGVDb3VudHJ5LCBDb3VudHJ5RGF0YSB9IGZyb20gJy4vZGF0YS10eXBlcy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgZW4gYXMgY291bnRyaWVzRU4gfSBmcm9tICdAamFnb21mL2NvdW50cmllc2xpc3QnO1xuaW1wb3J0IHsgc2NhbGUgfSBmcm9tICdjaHJvbWEtanMnO1xuXG5jb25zdCBleGlzdHMgPSBpdGVtID0+IHR5cGVvZiBpdGVtICE9PSAndW5kZWZpbmVkJyAmJiBpdGVtICE9PSBudWxsO1xuY29uc3QgY291bnRyeU51bSA9IChpdGVtOiBDb3VudHJ5RGF0YSkgPT4gcGFyc2VJbnQoaXRlbS52YWx1ZT8udG9TdHJpbmcoKSk7XG5cbmNvbnN0IGNvdW50cnlDbGFzcyA9ICdjb3VudHJ5eHgnO1xuY29uc3Qgb2NlYW5JZCA9ICdvY2Vhbic7XG5jb25zdCBnZXRTdHJva2VXaWR0aCA9IChpc0hvdmVyZWQ6IGJvb2xlYW4pID0+IGlzSG92ZXJlZCA/ICcwLjIlJyA6ICcwLjElJztcbmNvbnN0IGdldFN0cm9rZUNvbG9yID0gKGlzSG92ZXJlZDogYm9vbGVhbikgPT4gaXNIb3ZlcmVkID8gJyM4ODgnIDogJyNhZmFmYWYnO1xuXG5jb25zdCBjb3VudHJ5TmFtZSA9IChjb3VudHJ5Q29kZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgcmV0dXJuIGNvdW50cmllc0VOW2NvdW50cnlDb2RlXTtcbn07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NvdW50cmllcy1tYXAnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvdW50cmllcy1tYXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgQ291bnRyaWVzTWFwQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzIHtcblxuICBASW5wdXQoeyByZXF1aXJlZDogdHJ1ZSB9KSBkYXRhOiBDb3VudHJpZXNEYXRhO1xuICBASW5wdXQoKSBjb3VudHJ5TGFiZWwgPSAnQ291bnRyeSc7XG4gIEBJbnB1dCgpIHZhbHVlTGFiZWwgPSAnVmFsdWUnO1xuICBASW5wdXQoKSBzaG93Q2FwdGlvbiA9IHRydWU7XG4gIEBJbnB1dCgpIGNhcHRpb25CZWxvdyA9IHRydWU7XG4gIEBJbnB1dCgpIG1pblZhbHVlOiBudW1iZXI7XG4gIEBJbnB1dCgpIG1heFZhbHVlOiBudW1iZXI7XG4gIEBJbnB1dCgpIG1pbkNvbG9yID0gJ3doaXRlJztcbiAgQElucHV0KCkgbWF4Q29sb3IgPSAncmVkJztcbiAgQElucHV0KCkgYmFja2dyb3VuZENvbG9yID0gJ3doaXRlJztcbiAgQElucHV0KCkgbm9EYXRhQ29sb3IgPSAnI0NGQ0ZDRic7XG4gIEBJbnB1dCgpIGV4Y2VwdGlvbkNvbG9yID0gJyNGRkVFNTgnO1xuXG4gIEBPdXRwdXQoKSBwcml2YXRlIHJlYWRvbmx5IGNoYXJ0UmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gIEBPdXRwdXQoKSBwcml2YXRlIHJlYWRvbmx5IGNoYXJ0RXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0RXJyb3JFdmVudD4oKTtcbiAgQE91dHB1dCgpIHByaXZhdGUgcmVhZG9ubHkgY2hhcnRTZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0U2VsZWN0RXZlbnQ+KCk7XG5cbiAgQFZpZXdDaGlsZCgnbWFwQ29udGVudCcsIHsgc3RhdGljOiBmYWxzZSwgcmVhZDogRWxlbWVudFJlZiB9KSBwcml2YXRlIHJlYWRvbmx5IG1hcENvbnRlbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIG1hcERhdGE6IERyYXdhYmxlQ291bnRyaWVzO1xuICBzZWxlY3Rpb246IFNlbGVjdGlvbiB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgaW5uZXJMb2FkaW5nID0gdHJ1ZTtcbiAgZ2V0IGxvYWRpbmcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJMb2FkaW5nO1xuICB9XG5cbiAgZ2V0IHNlbGVjdGlvblZhbHVlKCk6IFZhbGlkRXh0cmFEYXRhIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuc2VsZWN0aW9uLmNvdW50cnlJZF0udmFsdWU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNkUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKSB7IH1cblxuICBwcml2YXRlIGdldEV4dHJhU2VsZWN0ZWQoY291bnRyeTogc3RyaW5nKTogU2VsZWN0aW9uRXh0cmFbXSB8IG51bGwge1xuICAgIGNvbnN0IHsgZXh0cmEgfSA9IHRoaXMuZGF0YVtjb3VudHJ5XTtcbiAgICByZXR1cm4gZXh0cmEgJiYgT2JqZWN0LmtleXMoZXh0cmEpLm1hcChrZXkgPT4gKHsga2V5LCB2YWw6IGV4dHJhW2tleV0gfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZWxlY3RDb3VudHJ5KGNvdW50cnk/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdGlvbiA9IGNvdW50cnkgPyB7XG4gICAgICBjb3VudHJ5SWQ6IGNvdW50cnksXG4gICAgICBjb3VudHJ5TmFtZTogY291bnRyeU5hbWUoY291bnRyeSksXG4gICAgICBleHRyYTogdGhpcy5nZXRFeHRyYVNlbGVjdGVkKGNvdW50cnkpXG4gICAgfSA6IG51bGw7XG4gICAgdGhpcy5jZFJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsaXplTWFwKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgY29uc3QgY2hhbmdlZE1hcFZhbHVlQnV0Tm90T25TdGFydCA9IFsnZGF0YScsICdtaW5Db2xvcicsICdtYXhDb2xvcicsICdiYWNrZ3JvdW5kQ29sb3InLCAnbm9EYXRhQ29sb3InLCAnZXhjZXB0aW9uQ29sb3InXVxuICAgICAgLnNvbWUoYXR0ciA9PiBjaGFuZ2VzW2F0dHJdICYmICFjaGFuZ2VzW2F0dHJdLmZpcnN0Q2hhbmdlKTtcblxuICAgIGlmIChjaGFuZ2VkTWFwVmFsdWVCdXROb3RPblN0YXJ0KSB7XG4gICAgICB0aGlzLmluaXRpYWxpemVNYXAoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluaXRpYWxpemVNYXAoKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIGRhdGEgaXMgcHJvdmlkZWQ6IG1pZ2h0IGJlIGFibGUgdG8gcGFpbnQgY291bnRyaWVzIGluIGNvbG9yc1xuICAgICAgaWYgKHRoaXMuZGF0YSkge1xuICAgICAgICAvLyBnZXQgaGlnaGVzdCB2YWx1ZSBpbiByYW5nZVxuICAgICAgICBjb25zdCBtYXhWYWwgPSBleGlzdHModGhpcy5tYXhWYWx1ZSkgPyB0aGlzLm1heFZhbHVlIDogT2JqZWN0LnZhbHVlcyh0aGlzLmRhdGEpLnJlZHVjZShcbiAgICAgICAgICAoYWNjLCBjdXJyKSA9PiBjb3VudHJ5TnVtKGN1cnIpID4gYWNjIHx8IGFjYyA9PT0gbnVsbCA/IGNvdW50cnlOdW0oY3VycikgOiBhY2MsIG51bGwgYXMgbnVtYmVyXG4gICAgICAgICk7XG4gICAgICAgIC8vIGdldCBsb3dlc3QgdmFsdWUgaW4gcmFuZ2VcbiAgICAgICAgY29uc3QgbWluVmFsID0gZXhpc3RzKHRoaXMubWluVmFsdWUpID8gdGhpcy5taW5WYWx1ZSA6IE9iamVjdC52YWx1ZXModGhpcy5kYXRhKS5yZWR1Y2UoXG4gICAgICAgICAgKGFjYywgY3VycikgPT4gY291bnRyeU51bShjdXJyKSA8IGFjYyB8fCBhY2MgPT09IG51bGwgPyBjb3VudHJ5TnVtKGN1cnIpIDogYWNjLCBudWxsIGFzIG51bWJlclxuICAgICAgICApO1xuXG4gICAgICAgIC8vIG1hcCB2YWx1ZXMgaW4gcmFuZ2UgdG8gY29sb3JzXG4gICAgICAgIGNvbnN0IHZhbFRvQ29sID0gc2NhbGUoW3RoaXMubWluQ29sb3IsIHRoaXMubWF4Q29sb3JdKS5jb2xvcnMoKG1heFZhbCA/PyAxKSAtIChtaW5WYWwgPz8gMCkgKyAxKS5yZWR1Y2UoKGFjYywgY3VyciwgaSkgPT5cbiAgICAgICAgICAoeyAuLi5hY2MsIFtpICsgbWluVmFsXTogY3VyciB9KSwge30gYXMgeyBba2V5OiBudW1iZXJdOiBzdHJpbmcgfVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIGNyZWF0ZSBsb2NhbCBNYXAgdXNpbmcgcHJvdmlkZWQgZGF0YSArIGNhbGN1bGF0ZWQgY29sb3JzXG4gICAgICAgIHRoaXMubWFwRGF0YSA9IE9iamVjdC5lbnRyaWVzKHRoaXMuZGF0YSkucmVkdWNlKChhY2MsIFsgY291bnRyeUlkLCBjb3VudHJ5VmFsIF0pID0+XG4gICAgICAgICAgKHsgLi4uYWNjLFxuICAgICAgICAgICAgW2NvdW50cnlJZC50b0xvd2VyQ2FzZSgpXToge1xuICAgICAgICAgICAgICAuLi5jb3VudHJ5VmFsLFxuICAgICAgICAgICAgICBjb2xvcjogdmFsVG9Db2xbY291bnRyeU51bShjb3VudHJ5VmFsKV0gLy8gdmFsdWUgaW4gYmV0d2VlbiBtaW5WYWwgYW5kIG1heFZhbFxuICAgICAgICAgICAgICAgIHx8IChcbiAgICAgICAgICAgICAgICAgIC8vIHZhbHVlIGJlbG93IG1pblZhbFxuICAgICAgICAgICAgICAgICAgY291bnRyeU51bShjb3VudHJ5VmFsKSA8PSBtaW5WYWwgPyB2YWxUb0NvbFttaW5WYWxdIDpcbiAgICAgICAgICAgICAgICAgIC8vIHZhbHVlIGFib3ZlIG1heFZhbFxuICAgICAgICAgICAgICAgICAgY291bnRyeU51bShjb3VudHJ5VmFsKSA+PSBtYXhWYWwgPyB2YWxUb0NvbFttYXhWYWxdXG4gICAgICAgICAgICAgICAgICAvLyB3ZWlyZDsgc2hvdWxkIG5ldmVyIGdldCB0byBoZXJlXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5leGNlcHRpb25Db2xvclxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgIH0gYXMgRHJhd2FibGVDb3VudHJ5IH0pLFxuICAgICAgICAgIHt9IGFzIERyYXdhYmxlQ291bnRyaWVzXG4gICAgICAgICk7XG5cbiAgICAgIC8vIG5vIGRhdGEgcHJvdmlkZWQ6IHdpbGwgcGFpbnQgcGxhaW4gbWFwXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm1hcERhdGEgPSB7fTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3ZnTWFwID0gdGhpcy5tYXBDb250ZW50Lm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0gYXMgU1ZHU1ZHRWxlbWVudDtcbiAgICAgIHN2Z01hcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmJhY2tncm91bmRDb2xvcjtcbiAgICAgIHN2Z01hcC5xdWVyeVNlbGVjdG9yQWxsPFNWR1NWR0VsZW1lbnQ+KGAuJHtjb3VudHJ5Q2xhc3N9YCkuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgY29uc3QgbWFwSXRlbSA9IHRoaXMubWFwRGF0YVtpdGVtLmlkLnRvTG93ZXJDYXNlKCldO1xuICAgICAgICBjb25zdCBpc0V4Y2VwdGlvbiA9IG1hcEl0ZW0gPyAhZXhpc3RzKG1hcEl0ZW0udmFsdWUpIDogZmFsc2U7XG4gICAgICAgIGl0ZW0uc3R5bGUuZmlsbCA9IG1hcEl0ZW0gPyBpc0V4Y2VwdGlvbiA/IHRoaXMuZXhjZXB0aW9uQ29sb3IgOiBtYXBJdGVtLmNvbG9yIDogdGhpcy5ub0RhdGFDb2xvcjtcbiAgICAgICAgaXRlbS5vbm1vdXNlZW50ZXIgPSB0aGlzLmNvdW50cnlIb3Zlci5iaW5kKHRoaXMsIGl0ZW0sIHRydWUpO1xuICAgICAgICBpdGVtLm9ubW91c2VsZWF2ZSA9IHRoaXMuY291bnRyeUhvdmVyLmJpbmQodGhpcywgaXRlbSwgZmFsc2UpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIHRoaXMuaW5uZXJMb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLm9uQ2hhcnRSZWFkeSgpO1xuICAgICAgdGhpcy5jZFJlZi5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLm9uQ2hhcnRlcnJvcih7IGlkOiBDaGFyRXJyb3JDb2RlLmxvYWRpbmcsIG1lc3NhZ2U6ICdDb3VsZCBub3QgbG9hZCcgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjb3VudHJ5SG92ZXIoaXRlbTogU1ZHRWxlbWVudCwgaG92ZXJlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIGl0ZW0uc3R5bGUuc3Ryb2tlV2lkdGggPSBnZXRTdHJva2VXaWR0aChob3ZlcmVkKTtcbiAgICBpdGVtLnN0eWxlLnN0cm9rZSA9IGdldFN0cm9rZUNvbG9yKGhvdmVyZWQpO1xuICAgIGl0ZW0ucXVlcnlTZWxlY3RvckFsbDxTVkdFbGVtZW50PignLmxhbmR4eCcpLmZvckVhY2goaSA9PiB7XG4gICAgICBpLnN0eWxlLnN0cm9rZVdpZHRoID0gZ2V0U3Ryb2tlV2lkdGgoaG92ZXJlZCk7XG4gICAgICBpLnN0eWxlLnN0cm9rZSA9IGdldFN0cm9rZUNvbG9yKGhvdmVyZWQpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvbkNoYXJ0UmVhZHkoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaW5uZXJMb2FkaW5nKSB7XG4gICAgICB0aGlzLmlubmVyTG9hZGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5jaGFydFJlYWR5LmVtaXQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uQ2hhcnRlcnJvcihlcnJvcjogQ2hhcnRFcnJvckV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5jaGFydEVycm9yLmVtaXQoZXJyb3IpO1xuICB9XG5cbiAgb25NYXBTZWxlY3QoZXY6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBjb25zdCBldmVudDogQ2hhcnRTZWxlY3RFdmVudCA9IHtcbiAgICAgIHNlbGVjdGVkOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgZXh0cmE6IG51bGwsXG4gICAgICBjb3VudHJ5OiBudWxsXG4gICAgfTtcblxuICAgIGxldCBuZXdJdGVtOiBTVkdFbGVtZW50O1xuICAgIGlmICgoZXYudGFyZ2V0IGFzIFNWR0VsZW1lbnQpPy5pZCA9PT0gb2NlYW5JZCkge1xuICAgICAgdGhpcy5zZWxlY3RDb3VudHJ5KG51bGwpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0l0ZW0gPSBldi50YXJnZXQgYXMgU1ZHRWxlbWVudDtcbiAgICAgIHdoaWxlICghbmV3SXRlbS5jbGFzc0xpc3QuY29udGFpbnMoY291bnRyeUNsYXNzKSkge1xuICAgICAgICBuZXdJdGVtID0gbmV3SXRlbS5wYXJlbnROb2RlIGFzIFNWR0VsZW1lbnQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY291bnRyeSA9IHRoaXMubWFwRGF0YVtuZXdJdGVtPy5pZF07XG4gICAgaWYgKGNvdW50cnkpIHtcbiAgICAgIGV2ZW50LnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgIGV2ZW50LnZhbHVlID0gY291bnRyeU51bShjb3VudHJ5KTtcbiAgICAgIGV2ZW50LmNvdW50cnkgPSBuZXdJdGVtLmlkLnRvVXBwZXJDYXNlKCk7XG4gICAgICBldmVudC5leHRyYSA9IGNvdW50cnkuZXh0cmE7XG4gICAgICB0aGlzLnNlbGVjdENvdW50cnkoZXZlbnQuY291bnRyeSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0Q291bnRyeShudWxsKTtcbiAgICB9XG4gICAgdGhpcy5jaGFydFNlbGVjdC5lbWl0KGV2ZW50KTtcbiAgfVxuXG59XG4iLCJAaWYgKGxvYWRpbmcpIHtcbjxkaXYgY2xhc3M9XCJtYWpvci1ibG9jayBsb2FkaW5nXCI+PHNwYW4gY2xhc3M9XCJ0ZXh0XCI+TG9hZGluZyBtYXAuLi48L3NwYW4+PC9kaXY+XG59XG5cbjxjb3VudHJpZXMtbWFwLWJhc2UgY2xhc3M9XCJtYWpvci1ibG9jayBjbS1tYXAtY29udGVudFwiICNtYXBDb250ZW50IChjbGljayk9XCJvbk1hcFNlbGVjdCgkZXZlbnQpXCIgW25nQ2xhc3NdPVwieydnb2VzLWZpcnN0JzogY2FwdGlvbkJlbG93fVwiLz5cblxuQGlmICghbG9hZGluZyAmJiBzaG93Q2FwdGlvbikge1xuPGRpdiBjbGFzcz1cIm1ham9yLWJsb2NrIGNtLWNhcHRpb24tY29udGFpbmVyXCIgW25nQ2xhc3NdPVwieydnb2VzLWZpcnN0JzogIWNhcHRpb25CZWxvd31cIj5cbiAgPGRpdiBjbGFzcz1cImNtLXNpbXBsZS1jYXB0aW9uXCI+XG4gICAgPGRpdiBjbGFzcz1cImNtLWNvdW50cnktbGFiZWxcIj5cbiAgICAgIEBpZiAoc2VsZWN0aW9uKSB7XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiY20tY291bnRyeS1uYW1lXCI+e3tzZWxlY3Rpb24/LmNvdW50cnlOYW1lfX08L3NwYW4+XG4gICAgICB9IEBlbHNlIHtcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJjbS1kZWZhdWx0LWxhYmVsXCI+e3tjb3VudHJ5TGFiZWx9fTwvc3Bhbj5cbiAgICAgIH1cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiY20tdmFsdWUtbGFiZWxcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY20tdmFsdWUtdGV4dFwiXG4gICAgICAgIFtuZ0NsYXNzXT1cInsnaGFzLXZhbHVlJzogc2VsZWN0aW9ufVwiPnt7dmFsdWVMYWJlbH19QGlmIChzZWxlY3Rpb24pIHs8c3Bhbj46IDwvc3Bhbj59PC9zcGFuPlxuICAgICAgQGlmIChzZWxlY3Rpb24pIHtcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJjbS12YWx1ZS1jb250ZW50XCI+e3tzZWxlY3Rpb25WYWx1ZX19PC9zcGFuPlxuICAgICAgfVxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgQGlmIChzZWxlY3Rpb24/LmV4dHJhPy5sZW5ndGggPiAwKSB7XG4gICAgPGRpdiBjbGFzcz1cImNtLWV4dGVuZGVkLWNhcHRpb25cIj5cbiAgICAgIEBmb3IgKGl0ZW0gb2Ygc2VsZWN0aW9uPy5leHRyYTsgdHJhY2sgaXRlbS5rZXkpIHtcbiAgICAgICAgPGRpdiBjbGFzcz1cImNtLWV4dGVuZGVkLWl0ZW1cIj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImNtLWV4dGVuZGVkLWxhYmVsXCI+e3tpdGVtLmtleX19PC9zcGFuPjpcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImNtLWV4dGVuZGVkLXZhbHVlXCI+e3tpdGVtLnZhbH19PC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIH1cbiAgICA8L2Rpdj5cbiAgfVxuPC9kaXY+XG59XG4iXX0=