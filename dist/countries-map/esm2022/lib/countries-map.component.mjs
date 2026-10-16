import { Component, ElementRef, Input, Output, ViewChild, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { CharErrorCode } from './chart-events.interface';
import { en as countriesEN } from '@jagomf/countrieslist';
import chroma from 'chroma-js';
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
                const valToCol = chroma.scale([this.minColor, this.maxColor]).colors((maxVal ?? 1) - (minVal ?? 0) + 1).reduce((acc, curr, i) => ({ ...acc, [i + minVal]: curr }), {});
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CountriesMapComponent, deps: [{ token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "18.2.13", type: CountriesMapComponent, selector: "countries-map", inputs: { data: "data", countryLabel: "countryLabel", valueLabel: "valueLabel", showCaption: "showCaption", captionBelow: "captionBelow", minValue: "minValue", maxValue: "maxValue", minColor: "minColor", maxColor: "maxColor", backgroundColor: "backgroundColor", noDataColor: "noDataColor", exceptionColor: "exceptionColor" }, outputs: { chartReady: "chartReady", chartError: "chartError", chartSelect: "chartSelect" }, viewQueries: [{ propertyName: "mapContent", first: true, predicate: ["mapContent"], descendants: true, read: ElementRef }], usesOnChanges: true, ngImport: i0, template: "@if (loading) {\n<div class=\"major-block loading\"><span class=\"text\">Loading map...</span></div>\n}\n\n<countries-map-base class=\"major-block cm-map-content\" #mapContent (click)=\"onMapSelect($event)\" [ngClass]=\"{'goes-first': captionBelow}\"/>\n\n@if (!loading && showCaption) {\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\">\n  <div class=\"cm-simple-caption\">\n    <div class=\"cm-country-label\">\n      @if (selection) {\n        <span class=\"cm-country-name\">{{selection?.countryName}}</span>\n      } @else {\n        <span class=\"cm-default-label\">{{countryLabel}}</span>\n      }\n    </div>\n    <div class=\"cm-value-label\">\n      <span class=\"cm-value-text\"\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}@if (selection) {<span>: </span>}</span>\n      @if (selection) {\n        <span class=\"cm-value-content\">{{selectionValue}}</span>\n      }\n    </div>\n  </div>\n  @if (selection?.extra?.length > 0) {\n    <div class=\"cm-extended-caption\">\n      @for (item of selection?.extra; track item.key) {\n        <div class=\"cm-extended-item\">\n          <span class=\"cm-extended-label\">{{item.key}}</span>:\n          <span class=\"cm-extended-value\">{{item.val}}</span>\n        </div>\n      }\n    </div>\n  }\n</div>\n}\n", styles: [":host{display:flex;flex-flow:column nowrap;justify-content:space-between;align-items:stretch;align-content:stretch}.major-block.loading{flex:0 1 auto;align-self:center}.major-block.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{flex:0 1 auto;display:flex;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{flex:0 1 auto;align-self:flex-start}.cm-value-label{flex:0 1 auto;align-self:flex-end}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "component", type: i2.CountriesMapBaseComponent, selector: "countries-map-base" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.13", ngImport: i0, type: CountriesMapComponent, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9saWIvc3JjL2xpYi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvbGliL2NvdW50cmllcy1tYXAuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLE1BQU0sRUFDTixTQUFTLEVBQ1QsdUJBQXVCLEVBRXZCLFlBQVksRUFJYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFJekQsT0FBTyxFQUFFLEVBQUUsSUFBSSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLE1BQU0sTUFBTSxXQUFXLENBQUM7Ozs7QUFFL0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLElBQUksS0FBSyxXQUFXLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQztBQUNwRSxNQUFNLFVBQVUsR0FBRyxDQUFDLElBQWlCLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFM0UsTUFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDO0FBQ2pDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN4QixNQUFNLGNBQWMsR0FBRyxDQUFDLFNBQWtCLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDM0UsTUFBTSxjQUFjLEdBQUcsQ0FBQyxTQUFrQixFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0FB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SSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FDcEYsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQWMsQ0FDL0YsQ0FBQztnQkFDRiw0QkFBNEI7Z0JBQzVCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FDcEYsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLElBQWMsQ0FDL0YsQ0FBQztnQkFFRixnQ0FBZ0M7Z0JBQ2hDLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQzlILENBQUMsRUFBRSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQStCLENBQ2xFLENBQUM7Z0JBRUYsMkRBQTJEO2dCQUMzRCxJQUFJLENBQUMsT0FBTyxH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QUFyQyxNQUFNO2dCQUV3RSxVQUFVO3NCQUF4RixTQUFTO3VCQUFDLFlBQVksRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2hhckVycm9yQ29kZSB9IGZyb20gJy4vY2hhcnQtZXZlbnRzLmludGVyZmFjZSc7XG5pbXBvcnQgdHlwZSB7IENoYXJ0U2VsZWN0RXZlbnQsIENoYXJ0RXJyb3JFdmVudCB9IGZyb20gJy4vY2hhcnQtZXZlbnRzLmludGVyZmFjZSc7XG5pbXBvcnQgdHlwZSB7IENvdW50cmllc0RhdGEsIFNlbGVjdGlvbkV4dHJhLCBEcmF3YWJsZUNvdW50cmllcywgU2VsZWN0aW9uLFxuICBWYWxpZEV4dHJhRGF0YSwgRHJhd2FibGVDb3VudHJ5LCBDb3VudHJ5RGF0YSB9IGZyb20gJy4vZGF0YS10eXBlcy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgZW4gYXMgY291bnRyaWVzRU4gfSBmcm9tICdAamFnb21mL2NvdW50cmllc2xpc3QnO1xuaW1wb3J0IGNocm9tYSBmcm9tICdjaHJvbWEtanMnO1xuXG5jb25zdCBleGlzdHMgPSBpdGVtID0+IHR5cGVvZiBpdGVtICE9PSAndW5kZWZpbmVkJyAmJiBpdGVtICE9PSBudWxsO1xuY29uc3QgY291bnRyeU51bSA9IChpdGVtOiBDb3VudHJ5RGF0YSkgPT4gcGFyc2VJbnQoaXRlbS52YWx1ZT8udG9TdHJpbmcoKSk7XG5cbmNvbnN0IGNvdW50cnlDbGFzcyA9ICdjb3VudHJ5eHgnO1xuY29uc3Qgb2NlYW5JZCA9ICdvY2Vhbic7XG5jb25zdCBnZXRTdHJva2VXaWR0aCA9IChpc0hvdmVyZWQ6IGJvb2xlYW4pID0+IGlzSG92ZXJlZCA/ICcwLjIlJyA6ICcwLjElJztcbmNvbnN0IGdldFN0cm9rZUNvbG9yID0gKGlzSG92ZXJlZDogYm9vbGVhbikgPT4gaXNIb3ZlcmVkID8gJyM4ODgnIDogJyNhZmFmYWYnO1xuXG5jb25zdCBjb3VudHJ5TmFtZSA9IChjb3VudHJ5Q29kZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgcmV0dXJuIGNvdW50cmllc0VOW2NvdW50cnlDb2RlXTtcbn07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NvdW50cmllcy1tYXAnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvdW50cmllcy1tYXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgQ291bnRyaWVzTWFwQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzIHtcblxuICBASW5wdXQoeyByZXF1aXJlZDogdHJ1ZSB9KSBkYXRhOiBDb3VudHJpZXNEYXRhO1xuICBASW5wdXQoKSBjb3VudHJ5TGFiZWwgPSAnQ291bnRyeSc7XG4gIEBJbnB1dCgpIHZhbHVlTGFiZWwgPSAnVmFsdWUnO1xuICBASW5wdXQoKSBzaG93Q2FwdGlvbiA9IHRydWU7XG4gIEBJbnB1dCgpIGNhcHRpb25CZWxvdyA9IHRydWU7XG4gIEBJbnB1dCgpIG1pblZhbHVlOiBudW1iZXI7XG4gIEBJbnB1dCgpIG1heFZhbHVlOiBudW1iZXI7XG4gIEBJbnB1dCgpIG1pbkNvbG9yID0gJ3doaXRlJztcbiAgQElucHV0KCkgbWF4Q29sb3IgPSAncmVkJztcbiAgQElucHV0KCkgYmFja2dyb3VuZENvbG9yID0gJ3doaXRlJztcbiAgQElucHV0KCkgbm9EYXRhQ29sb3IgPSAnI0NGQ0ZDRic7XG4gIEBJbnB1dCgpIGV4Y2VwdGlvbkNvbG9yID0gJyNGRkVFNTgnO1xuXG4gIEBPdXRwdXQoKSBwcml2YXRlIHJlYWRvbmx5IGNoYXJ0UmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gIEBPdXRwdXQoKSBwcml2YXRlIHJlYWRvbmx5IGNoYXJ0RXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0RXJyb3JFdmVudD4oKTtcbiAgQE91dHB1dCgpIHByaXZhdGUgcmVhZG9ubHkgY2hhcnRTZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0U2VsZWN0RXZlbnQ+KCk7XG5cbiAgQFZpZXdDaGlsZCgnbWFwQ29udGVudCcsIHsgc3RhdGljOiBmYWxzZSwgcmVhZDogRWxlbWVudFJlZiB9KSBwcml2YXRlIHJlYWRvbmx5IG1hcENvbnRlbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIG1hcERhdGE6IERyYXdhYmxlQ291bnRyaWVzO1xuICBzZWxlY3Rpb246IFNlbGVjdGlvbiB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgaW5uZXJMb2FkaW5nID0gdHJ1ZTtcbiAgZ2V0IGxvYWRpbmcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJMb2FkaW5nO1xuICB9XG5cbiAgZ2V0IHNlbGVjdGlvblZhbHVlKCk6IFZhbGlkRXh0cmFEYXRhIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuc2VsZWN0aW9uLmNvdW50cnlJZF0udmFsdWU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNkUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKSB7IH1cblxuICBwcml2YXRlIGdldEV4dHJhU2VsZWN0ZWQoY291bnRyeTogc3RyaW5nKTogU2VsZWN0aW9uRXh0cmFbXSB8IG51bGwge1xuICAgIGNvbnN0IHsgZXh0cmEgfSA9IHRoaXMuZGF0YVtjb3VudHJ5XTtcbiAgICByZXR1cm4gZXh0cmEgJiYgT2JqZWN0LmtleXMoZXh0cmEpLm1hcChrZXkgPT4gKHsga2V5LCB2YWw6IGV4dHJhW2tleV0gfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZWxlY3RDb3VudHJ5KGNvdW50cnk/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdGlvbiA9IGNvdW50cnkgPyB7XG4gICAgICBjb3VudHJ5SWQ6IGNvdW50cnksXG4gICAgICBjb3VudHJ5TmFtZTogY291bnRyeU5hbWUoY291bnRyeSksXG4gICAgICBleHRyYTogdGhpcy5nZXRFeHRyYVNlbGVjdGVkKGNvdW50cnkpXG4gICAgfSA6IG51bGw7XG4gICAgdGhpcy5jZFJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsaXplTWFwKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgY29uc3QgY2hhbmdlZE1hcFZhbHVlQnV0Tm90T25TdGFydCA9IFsnZGF0YScsICdtaW5Db2xvcicsICdtYXhDb2xvcicsICdiYWNrZ3JvdW5kQ29sb3InLCAnbm9EYXRhQ29sb3InLCAnZXhjZXB0aW9uQ29sb3InXVxuICAgICAgLnNvbWUoYXR0ciA9PiBjaGFuZ2VzW2F0dHJdICYmICFjaGFuZ2VzW2F0dHJdLmZpcnN0Q2hhbmdlKTtcblxuICAgIGlmIChjaGFuZ2VkTWFwVmFsdWVCdXROb3RPblN0YXJ0KSB7XG4gICAgICB0aGlzLmluaXRpYWxpemVNYXAoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluaXRpYWxpemVNYXAoKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIGRhdGEgaXMgcHJvdmlkZWQ6IG1pZ2h0IGJlIGFibGUgdG8gcGFpbnQgY291bnRyaWVzIGluIGNvbG9yc1xuICAgICAgaWYgKHRoaXMuZGF0YSkge1xuICAgICAgICAvLyBnZXQgaGlnaGVzdCB2YWx1ZSBpbiByYW5nZVxuICAgICAgICBjb25zdCBtYXhWYWwgPSBleGlzdHModGhpcy5tYXhWYWx1ZSkgPyB0aGlzLm1heFZhbHVlIDogT2JqZWN0LnZhbHVlcyh0aGlzLmRhdGEpLnJlZHVjZShcbiAgICAgICAgICAoYWNjLCBjdXJyKSA9PiBjb3VudHJ5TnVtKGN1cnIpID4gYWNjIHx8IGFjYyA9PT0gbnVsbCA/IGNvdW50cnlOdW0oY3VycikgOiBhY2MsIG51bGwgYXMgbnVtYmVyXG4gICAgICAgICk7XG4gICAgICAgIC8vIGdldCBsb3dlc3QgdmFsdWUgaW4gcmFuZ2VcbiAgICAgICAgY29uc3QgbWluVmFsID0gZXhpc3RzKHRoaXMubWluVmFsdWUpID8gdGhpcy5taW5WYWx1ZSA6IE9iamVjdC52YWx1ZXModGhpcy5kYXRhKS5yZWR1Y2UoXG4gICAgICAgICAgKGFjYywgY3VycikgPT4gY291bnRyeU51bShjdXJyKSA8IGFjYyB8fCBhY2MgPT09IG51bGwgPyBjb3VudHJ5TnVtKGN1cnIpIDogYWNjLCBudWxsIGFzIG51bWJlclxuICAgICAgICApO1xuXG4gICAgICAgIC8vIG1hcCB2YWx1ZXMgaW4gcmFuZ2UgdG8gY29sb3JzXG4gICAgICAgIGNvbnN0IHZhbFRvQ29sID0gY2hyb21hLnNjYWxlKFt0aGlzLm1pbkNvbG9yLCB0aGlzLm1heENvbG9yXSkuY29sb3JzKChtYXhWYWwgPz8gMSkgLSAobWluVmFsID8/IDApICsgMSkucmVkdWNlKChhY2MsIGN1cnIsIGkpID0+XG4gICAgICAgICAgKHsgLi4uYWNjLCBbaSArIG1pblZhbF06IGN1cnIgfSksIHt9IGFzIHsgW2tleTogbnVtYmVyXTogc3RyaW5nIH1cbiAgICAgICAgKTtcblxuICAgICAgICAvLyBjcmVhdGUgbG9jYWwgTWFwIHVzaW5nIHByb3ZpZGVkIGRhdGEgKyBjYWxjdWxhdGVkIGNvbG9yc1xuICAgICAgICB0aGlzLm1hcERhdGEgPSBPYmplY3QuZW50cmllcyh0aGlzLmRhdGEpLnJlZHVjZSgoYWNjLCBbIGNvdW50cnlJZCwgY291bnRyeVZhbCBdKSA9PlxuICAgICAgICAgICh7IC4uLmFjYyxcbiAgICAgICAgICAgIFtjb3VudHJ5SWQudG9Mb3dlckNhc2UoKV06IHtcbiAgICAgICAgICAgICAgLi4uY291bnRyeVZhbCxcbiAgICAgICAgICAgICAgY29sb3I6IHZhbFRvQ29sW2NvdW50cnlOdW0oY291bnRyeVZhbCldIC8vIHZhbHVlIGluIGJldHdlZW4gbWluVmFsIGFuZCBtYXhWYWxcbiAgICAgICAgICAgICAgICB8fCAoXG4gICAgICAgICAgICAgICAgICAvLyB2YWx1ZSBiZWxvdyBtaW5WYWxcbiAgICAgICAgICAgICAgICAgIGNvdW50cnlOdW0oY291bnRyeVZhbCkgPD0gbWluVmFsID8gdmFsVG9Db2xbbWluVmFsXSA6XG4gICAgICAgICAgICAgICAgICAvLyB2YWx1ZSBhYm92ZSBtYXhWYWxcbiAgICAgICAgICAgICAgICAgIGNvdW50cnlOdW0oY291bnRyeVZhbCkgPj0gbWF4VmFsID8gdmFsVG9Db2xbbWF4VmFsXVxuICAgICAgICAgICAgICAgICAgLy8gd2VpcmQ7IHNob3VsZCBuZXZlciBnZXQgdG8gaGVyZVxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuZXhjZXB0aW9uQ29sb3JcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9IGFzIERyYXdhYmxlQ291bnRyeSB9KSxcbiAgICAgICAgICB7fSBhcyBEcmF3YWJsZUNvdW50cmllc1xuICAgICAgICApO1xuXG4gICAgICAvLyBubyBkYXRhIHByb3ZpZGVkOiB3aWxsIHBhaW50IHBsYWluIG1hcFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tYXBEYXRhID0ge307XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN2Z01hcCA9IHRoaXMubWFwQ29udGVudC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdIGFzIFNWR1NWR0VsZW1lbnQ7XG4gICAgICBzdmdNYXAuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICBzdmdNYXAucXVlcnlTZWxlY3RvckFsbDxTVkdTVkdFbGVtZW50PihgLiR7Y291bnRyeUNsYXNzfWApLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcEl0ZW0gPSB0aGlzLm1hcERhdGFbaXRlbS5pZC50b0xvd2VyQ2FzZSgpXTtcbiAgICAgICAgY29uc3QgaXNFeGNlcHRpb24gPSBtYXBJdGVtID8gIWV4aXN0cyhtYXBJdGVtLnZhbHVlKSA6IGZhbHNlO1xuICAgICAgICBpdGVtLnN0eWxlLmZpbGwgPSBtYXBJdGVtID8gaXNFeGNlcHRpb24gPyB0aGlzLmV4Y2VwdGlvbkNvbG9yIDogbWFwSXRlbS5jb2xvciA6IHRoaXMubm9EYXRhQ29sb3I7XG4gICAgICAgIGl0ZW0ub25tb3VzZWVudGVyID0gdGhpcy5jb3VudHJ5SG92ZXIuYmluZCh0aGlzLCBpdGVtLCB0cnVlKTtcbiAgICAgICAgaXRlbS5vbm1vdXNlbGVhdmUgPSB0aGlzLmNvdW50cnlIb3Zlci5iaW5kKHRoaXMsIGl0ZW0sIGZhbHNlKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyB0aGlzLmlubmVyTG9hZGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5vbkNoYXJ0UmVhZHkoKTtcbiAgICAgIHRoaXMuY2RSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5vbkNoYXJ0ZXJyb3IoeyBpZDogQ2hhckVycm9yQ29kZS5sb2FkaW5nLCBtZXNzYWdlOiAnQ291bGQgbm90IGxvYWQnIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY291bnRyeUhvdmVyKGl0ZW06IFNWR0VsZW1lbnQsIGhvdmVyZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpdGVtLnN0eWxlLnN0cm9rZVdpZHRoID0gZ2V0U3Ryb2tlV2lkdGgoaG92ZXJlZCk7XG4gICAgaXRlbS5zdHlsZS5zdHJva2UgPSBnZXRTdHJva2VDb2xvcihob3ZlcmVkKTtcbiAgICBpdGVtLnF1ZXJ5U2VsZWN0b3JBbGw8U1ZHRWxlbWVudD4oJy5sYW5keHgnKS5mb3JFYWNoKGkgPT4ge1xuICAgICAgaS5zdHlsZS5zdHJva2VXaWR0aCA9IGdldFN0cm9rZVdpZHRoKGhvdmVyZWQpO1xuICAgICAgaS5zdHlsZS5zdHJva2UgPSBnZXRTdHJva2VDb2xvcihob3ZlcmVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25DaGFydFJlYWR5KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlubmVyTG9hZGluZykge1xuICAgICAgdGhpcy5pbm5lckxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuY2hhcnRSZWFkeS5lbWl0KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvbkNoYXJ0ZXJyb3IoZXJyb3I6IENoYXJ0RXJyb3JFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuY2hhcnRFcnJvci5lbWl0KGVycm9yKTtcbiAgfVxuXG4gIG9uTWFwU2VsZWN0KGV2OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgZXZlbnQ6IENoYXJ0U2VsZWN0RXZlbnQgPSB7XG4gICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICB2YWx1ZTogbnVsbCxcbiAgICAgIGV4dHJhOiBudWxsLFxuICAgICAgY291bnRyeTogbnVsbFxuICAgIH07XG5cbiAgICBsZXQgbmV3SXRlbTogU1ZHRWxlbWVudDtcbiAgICBpZiAoKGV2LnRhcmdldCBhcyBTVkdFbGVtZW50KT8uaWQgPT09IG9jZWFuSWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0Q291bnRyeShudWxsKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBuZXdJdGVtID0gZXYudGFyZ2V0IGFzIFNWR0VsZW1lbnQ7XG4gICAgICB3aGlsZSAoIW5ld0l0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKGNvdW50cnlDbGFzcykpIHtcbiAgICAgICAgbmV3SXRlbSA9IG5ld0l0ZW0ucGFyZW50Tm9kZSBhcyBTVkdFbGVtZW50O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNvdW50cnkgPSB0aGlzLm1hcERhdGFbbmV3SXRlbT8uaWRdO1xuICAgIGlmIChjb3VudHJ5KSB7XG4gICAgICBldmVudC5zZWxlY3RlZCA9IHRydWU7XG4gICAgICBldmVudC52YWx1ZSA9IGNvdW50cnlOdW0oY291bnRyeSk7XG4gICAgICBldmVudC5jb3VudHJ5ID0gbmV3SXRlbS5pZC50b1VwcGVyQ2FzZSgpO1xuICAgICAgZXZlbnQuZXh0cmEgPSBjb3VudHJ5LmV4dHJhO1xuICAgICAgdGhpcy5zZWxlY3RDb3VudHJ5KGV2ZW50LmNvdW50cnkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdENvdW50cnkobnVsbCk7XG4gICAgfVxuICAgIHRoaXMuY2hhcnRTZWxlY3QuZW1pdChldmVudCk7XG4gIH1cblxufVxuIiwiQGlmIChsb2FkaW5nKSB7XG48ZGl2IGNsYXNzPVwibWFqb3ItYmxvY2sgbG9hZGluZ1wiPjxzcGFuIGNsYXNzPVwidGV4dFwiPkxvYWRpbmcgbWFwLi4uPC9zcGFuPjwvZGl2PlxufVxuXG48Y291bnRyaWVzLW1hcC1iYXNlIGNsYXNzPVwibWFqb3ItYmxvY2sgY20tbWFwLWNvbnRlbnRcIiAjbWFwQ29udGVudCAoY2xpY2spPVwib25NYXBTZWxlY3QoJGV2ZW50KVwiIFtuZ0NsYXNzXT1cInsnZ29lcy1maXJzdCc6IGNhcHRpb25CZWxvd31cIi8+XG5cbkBpZiAoIWxvYWRpbmcgJiYgc2hvd0NhcHRpb24pIHtcbjxkaXYgY2xhc3M9XCJtYWpvci1ibG9jayBjbS1jYXB0aW9uLWNvbnRhaW5lclwiIFtuZ0NsYXNzXT1cInsnZ29lcy1maXJzdCc6ICFjYXB0aW9uQmVsb3d9XCI+XG4gIDxkaXYgY2xhc3M9XCJjbS1zaW1wbGUtY2FwdGlvblwiPlxuICAgIDxkaXYgY2xhc3M9XCJjbS1jb3VudHJ5LWxhYmVsXCI+XG4gICAgICBAaWYgKHNlbGVjdGlvbikge1xuICAgICAgICA8c3BhbiBjbGFzcz1cImNtLWNvdW50cnktbmFtZVwiPnt7c2VsZWN0aW9uPy5jb3VudHJ5TmFtZX19PC9zcGFuPlxuICAgICAgfSBAZWxzZSB7XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiY20tZGVmYXVsdC1sYWJlbFwiPnt7Y291bnRyeUxhYmVsfX08L3NwYW4+XG4gICAgICB9XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImNtLXZhbHVlLWxhYmVsXCI+XG4gICAgICA8c3BhbiBjbGFzcz1cImNtLXZhbHVlLXRleHRcIlxuICAgICAgICBbbmdDbGFzc109XCJ7J2hhcy12YWx1ZSc6IHNlbGVjdGlvbn1cIj57e3ZhbHVlTGFiZWx9fUBpZiAoc2VsZWN0aW9uKSB7PHNwYW4+OiA8L3NwYW4+fTwvc3Bhbj5cbiAgICAgIEBpZiAoc2VsZWN0aW9uKSB7XG4gICAgICAgIDxzcGFuIGNsYXNzPVwiY20tdmFsdWUtY29udGVudFwiPnt7c2VsZWN0aW9uVmFsdWV9fTwvc3Bhbj5cbiAgICAgIH1cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIEBpZiAoc2VsZWN0aW9uPy5leHRyYT8ubGVuZ3RoID4gMCkge1xuICAgIDxkaXYgY2xhc3M9XCJjbS1leHRlbmRlZC1jYXB0aW9uXCI+XG4gICAgICBAZm9yIChpdGVtIG9mIHNlbGVjdGlvbj8uZXh0cmE7IHRyYWNrIGl0ZW0ua2V5KSB7XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjbS1leHRlbmRlZC1pdGVtXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbS1leHRlbmRlZC1sYWJlbFwiPnt7aXRlbS5rZXl9fTwvc3Bhbj46XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJjbS1leHRlbmRlZC12YWx1ZVwiPnt7aXRlbS52YWx9fTwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICB9XG4gICAgPC9kaXY+XG4gIH1cbjwvZGl2PlxufVxuIl19