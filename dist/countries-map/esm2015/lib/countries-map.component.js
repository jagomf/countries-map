import { Component, ElementRef, Input, Output, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { CharErrorCode } from './chart-events.interface';
import { en as countriesEN } from '@jagomf/countrieslist';
import { scale } from 'chroma-js';
const exists = item => typeof item !== 'undefined' && item !== null;
const ɵ0 = exists;
const countryNum = (item) => { var _a; return parseInt((_a = item.value) === null || _a === void 0 ? void 0 : _a.toString()); };
const ɵ1 = countryNum;
const countryClass = 'countryxx';
const oceanId = 'ocean';
const getStrokeWidth = (isHovered) => isHovered ? '0.2%' : '0.1%';
const ɵ2 = getStrokeWidth;
const getStrokeColor = (isHovered) => isHovered ? '#888' : '#afafaf';
const ɵ3 = getStrokeColor;
const countryName = (countryCode) => {
    return countriesEN[countryCode];
};
const ɵ4 = countryName;
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
                const valToCol = scale([this.minColor, this.maxColor]).colors((maxVal !== null && maxVal !== void 0 ? maxVal : 1) - (minVal !== null && minVal !== void 0 ? minVal : 0) + 1).reduce((acc, curr, i) => (Object.assign(Object.assign({}, acc), { [i + minVal]: curr })), {});
                // create local Map using provided data + calculated colors
                this.mapData = Object.entries(this.data).reduce((acc, [countryId, countryVal]) => (Object.assign(Object.assign({}, acc), { [countryId.toLowerCase()]: Object.assign(Object.assign({}, countryVal), { color: valToCol[countryNum(countryVal)] // value in between minVal and maxVal
                            || (
                            // value below minVal
                            countryNum(countryVal) <= minVal ? valToCol[minVal] :
                                // value above maxVal
                                countryNum(countryVal) >= maxVal ? valToCol[maxVal]
                                    // weird; should never get to here
                                    : this.exceptionColor) }) })), {});
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
            this.innerLoading = false;
            this.cdRef.detectChanges();
            this.onChartReady();
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
        const country = this.mapData[newItem === null || newItem === void 0 ? void 0 : newItem.id];
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
CountriesMapComponent.decorators = [
    { type: Component, args: [{
                selector: 'countries-map',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: "<div class=\"major-block loading\" *ngIf=\"loading\"><span class=\"text\">Loading map...</span></div>\r\n\r\n<countries-map-base class=\"major-block cm-map-content\" #mapContent (click)=\"onMapSelect($event)\" [ngClass]=\"{'goes-first': captionBelow}\">\r\n</countries-map-base>\r\n\r\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\"\r\n  *ngIf=\"!loading && showCaption\">\r\n  <div class=\"cm-simple-caption\">\r\n    <div class=\"cm-country-label\">\r\n      <span class=\"cm-default-label\" *ngIf=\"!selection\">{{countryLabel}}</span>\r\n      <span class=\"cm-country-name\" *ngIf=\"selection\">{{selection?.countryName}}</span>\r\n    </div>\r\n    <div class=\"cm-value-label\">\r\n      <span class=\"cm-value-text\"\r\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}<span *ngIf=\"selection\">: </span></span>\r\n      <span class=\"cm-value-content\" *ngIf=\"selection\">{{selectionValue}}</span>\r\n    </div>\r\n  </div>\r\n  <div class=\"cm-extended-caption\" *ngIf=\"selection?.extra && selection?.extra.length > 0\">\r\n    <div *ngFor=\"let item of selection?.extra\" class=\"cm-extended-item\">\r\n      <span class=\"cm-extended-label\">{{item.key}}</span>:\r\n      <span class=\"cm-extended-value\">{{item.val}}</span>\r\n    </div>\r\n  </div>\r\n</div>\r\n",
                styles: [":host{align-content:stretch;align-items:stretch;display:flex;flex-flow:column nowrap;justify-content:space-between}.major-block.loading{align-self:center;flex:0 1 auto}.major-block.loading .text{color:grey;font-family:sans-serif;font-style:italic}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{display:flex;flex:0 1 auto;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{align-self:flex-start;flex:0 1 auto}.cm-value-label{align-self:flex-end;flex:0 1 auto}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){color:#777;font-style:italic}.cm-extended-caption{display:grid;grid-gap:5px;grid-template-columns:repeat(auto-fill,minmax(120px,1fr))}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}"]
            },] }
];
CountriesMapComponent.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
CountriesMapComponent.propDecorators = {
    data: [{ type: Input }],
    countryLabel: [{ type: Input }],
    valueLabel: [{ type: Input }],
    showCaption: [{ type: Input }],
    captionBelow: [{ type: Input }],
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
    mapContent: [{ type: ViewChild, args: ['mapContent', { static: false, read: ElementRef },] }]
};
export { ɵ0, ɵ1, ɵ2, ɵ3, ɵ4 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiTTovSmFnby9Eb2N1bWVudHMvY291bnRyaWVzLW1hcC9wcm9qZWN0cy9saWIvc3JjLyIsInNvdXJjZXMiOlsibGliL2NvdW50cmllcy1tYXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsWUFBWSxFQUliLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUl6RCxPQUFPLEVBQUUsRUFBRSxJQUFJLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFbEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLElBQUksS0FBSyxXQUFXLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQzs7QUFDcEUsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFpQixFQUFFLEVBQUUsV0FBQyxPQUFBLFFBQVEsT0FBQyxJQUFJLENBQUMsS0FBSywwQ0FBRSxRQUFRLEdBQUcsQ0FBQSxFQUFBLENBQUM7O0FBRTNFLE1BQU0sWUFBWSxHQUFHLFdBQVcsQ0FBQztBQUNqQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDeEIsTUFBTSxjQUFjLEdBQUcsQ0FBQyxTQUFrQixFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDOztBQUMzRSxNQUFNLGNBQWMsR0FBRyxDQUFDLFNBQWtCLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7O0FBRTlFLE1BQU0s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QUFVLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDbEMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3pDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ25DO2FBQU07WUFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFCO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7O1lBbExGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLG8wQ0FBNkM7O2FBRTlDOzs7WUE5QkMsaUJBQWlCOzs7bUJBaUNoQixLQUFLOzJCQUNMLEtBQUs7eUJBQ0wsS0FBSzswQkFDTCxLQUFLOzJCQUNMLEtBQUs7dUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3VCQUNMLEtBQUs7dUJBQ0wsS0FBSzs4QkFDTCxLQUFLOzBCQUNMLEtBQUs7NkJBQ0wsS0FBSzt5QkFFTCxNQUFNO3lCQUNOLE1BQU07MEJBQ04sTUFBTTt5QkFFTixTQUFTLFNBQUMsWUFBWSxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgRWxlbWVudFJlZixcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgVmlld0NoaWxkLFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIENoYW5nZURldGVjdG9yUmVmLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBTaW1wbGVDaGFuZ2VzXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENoYXJFcnJvckNvZGUgfSBmcm9tICcuL2NoYXJ0LWV2ZW50cy5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgdHlwZSB7IENoYXJ0U2VsZWN0RXZlbnQsIENoYXJ0RXJyb3JFdmVudCB9IGZyb20gJy4vY2hhcnQtZXZlbnRzLmludGVyZmFjZSc7XHJcbmltcG9ydCB0eXBlIHsgQ291bnRyaWVzRGF0YSwgU2VsZWN0aW9uRXh0cmEsIERyYXdhYmxlQ291bnRyaWVzLCBTZWxlY3Rpb24sXHJcbiAgVmFsaWRFeHRyYURhdGEsIERyYXdhYmxlQ291bnRyeSwgQ291bnRyeURhdGEgfSBmcm9tICcuL2RhdGEtdHlwZXMuaW50ZXJmYWNlJztcclxuaW1wb3J0IHsgZW4gYXMgY291bnRyaWVzRU4gfSBmcm9tICdAamFnb21mL2NvdW50cmllc2xpc3QnO1xyXG5pbXBvcnQgeyBzY2FsZSB9IGZyb20gJ2Nocm9tYS1qcyc7XHJcblxyXG5jb25zdCBleGlzdHMgPSBpdGVtID0+IHR5cGVvZiBpdGVtICE9PSAndW5kZWZpbmVkJyAmJiBpdGVtICE9PSBudWxsO1xyXG5jb25zdCBjb3VudHJ5TnVtID0gKGl0ZW06IENvdW50cnlEYXRhKSA9PiBwYXJzZUludChpdGVtLnZhbHVlPy50b1N0cmluZygpKTtcclxuXHJcbmNvbnN0IGNvdW50cnlDbGFzcyA9ICdjb3VudHJ5eHgnO1xyXG5jb25zdCBvY2VhbklkID0gJ29jZWFuJztcclxuY29uc3QgZ2V0U3Ryb2tlV2lkdGggPSAoaXNIb3ZlcmVkOiBib29sZWFuKSA9PiBpc0hvdmVyZWQgPyAnMC4yJScgOiAnMC4xJSc7XHJcbmNvbnN0IGdldFN0cm9rZUNvbG9yID0gKGlzSG92ZXJlZDogYm9vbGVhbikgPT4gaXNIb3ZlcmVkID8gJyM4ODgnIDogJyNhZmFmYWYnO1xyXG5cclxuY29uc3QgY291bnRyeU5hbWUgPSAoY291bnRyeUNvZGU6IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcbiAgcmV0dXJuIGNvdW50cmllc0VOW2NvdW50cnlDb2RlXTtcclxufTtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnY291bnRyaWVzLW1hcCcsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2NvdW50cmllcy1tYXAuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL2NvdW50cmllcy1tYXAuY29tcG9uZW50LnNjc3MnXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgQ291bnRyaWVzTWFwQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzIHtcclxuXHJcbiAgQElucHV0KCkgZGF0YTogQ291bnRyaWVzRGF0YTtcclxuICBASW5wdXQoKSBjb3VudHJ5TGFiZWwgPSAnQ291bnRyeSc7XHJcbiAgQElucHV0KCkgdmFsdWVMYWJlbCA9ICdWYWx1ZSc7XHJcbiAgQElucHV0KCkgc2hvd0NhcHRpb24gPSB0cnVlO1xyXG4gIEBJbnB1dCgpIGNhcHRpb25CZWxvdyA9IHRydWU7XHJcbiAgQElucHV0KCkgbWluVmFsdWU6IG51bWJlcjtcclxuICBASW5wdXQoKSBtYXhWYWx1ZTogbnVtYmVyO1xyXG4gIEBJbnB1dCgpIG1pbkNvbG9yID0gJ3doaXRlJztcclxuICBASW5wdXQoKSBtYXhDb2xvciA9ICdyZWQnO1xyXG4gIEBJbnB1dCgpIGJhY2tncm91bmRDb2xvciA9ICd3aGl0ZSc7XHJcbiAgQElucHV0KCkgbm9EYXRhQ29sb3IgPSAnI0NGQ0ZDRic7XHJcbiAgQElucHV0KCkgZXhjZXB0aW9uQ29sb3IgPSAnI0ZGRUU1OCc7XHJcblxyXG4gIEBPdXRwdXQoKSBwcml2YXRlIHJlYWRvbmx5IGNoYXJ0UmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XHJcbiAgQE91dHB1dCgpIHByaXZhdGUgcmVhZG9ubHkgY2hhcnRFcnJvciA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRFcnJvckV2ZW50PigpO1xyXG4gIEBPdXRwdXQoKSBwcml2YXRlIHJlYWRvbmx5IGNoYXJ0U2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydFNlbGVjdEV2ZW50PigpO1xyXG5cclxuICBAVmlld0NoaWxkKCdtYXBDb250ZW50JywgeyBzdGF0aWM6IGZhbHNlLCByZWFkOiBFbGVtZW50UmVmIH0pIHByaXZhdGUgcmVhZG9ubHkgbWFwQ29udGVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XHJcblxyXG4gIG1hcERhdGE6IERyYXdhYmxlQ291bnRyaWVzO1xyXG4gIHNlbGVjdGlvbjogU2VsZWN0aW9uIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gIHByaXZhdGUgaW5uZXJMb2FkaW5nID0gdHJ1ZTtcclxuICBnZXQgbG9hZGluZygpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmlubmVyTG9hZGluZztcclxuICB9XHJcblxyXG4gIGdldCBzZWxlY3Rpb25WYWx1ZSgpOiBWYWxpZEV4dHJhRGF0YSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuc2VsZWN0aW9uLmNvdW50cnlJZF0udmFsdWU7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY2RSZWY6IENoYW5nZURldGVjdG9yUmVmLFxyXG4gICkgeyB9XHJcblxyXG4gIHByaXZhdGUgZ2V0RXh0cmFTZWxlY3RlZChjb3VudHJ5OiBzdHJpbmcpOiBTZWxlY3Rpb25FeHRyYVtdIHwgbnVsbCB7XHJcbiAgICBjb25zdCB7IGV4dHJhIH0gPSB0aGlzLmRhdGFbY291bnRyeV07XHJcbiAgICByZXR1cm4gZXh0cmEgJiYgT2JqZWN0LmtleXMoZXh0cmEpLm1hcChrZXkgPT4gKHsga2V5LCB2YWw6IGV4dHJhW2tleV0gfSkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzZWxlY3RDb3VudHJ5KGNvdW50cnk/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMuc2VsZWN0aW9uID0gY291bnRyeSA/IHtcclxuICAgICAgY291bnRyeUlkOiBjb3VudHJ5LFxyXG4gICAgICBjb3VudHJ5TmFtZTogY291bnRyeU5hbWUoY291bnRyeSksXHJcbiAgICAgIGV4dHJhOiB0aGlzLmdldEV4dHJhU2VsZWN0ZWQoY291bnRyeSlcclxuICAgIH0gOiBudWxsO1xyXG4gICAgdGhpcy5jZFJlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmluaXRpYWxpemVNYXAoKTtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIGNvbnN0IGNoYW5nZWRNYXBWYWx1ZUJ1dE5vdE9uU3RhcnQgPSBbJ2RhdGEnLCAnbWluQ29sb3InLCAnbWF4Q29sb3InLCAnYmFja2dyb3VuZENvbG9yJywgJ25vRGF0YUNvbG9yJywgJ2V4Y2VwdGlvbkNvbG9yJ11cclxuICAgICAgLnNvbWUoYXR0ciA9PiBjaGFuZ2VzW2F0dHJdICYmICFjaGFuZ2VzW2F0dHJdLmZpcnN0Q2hhbmdlKTtcclxuXHJcbiAgICBpZiAoY2hhbmdlZE1hcFZhbHVlQnV0Tm90T25TdGFydCkge1xyXG4gICAgICB0aGlzLmluaXRpYWxpemVNYXAoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdGlhbGl6ZU1hcCgpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIC8vIGRhdGEgaXMgcHJvdmlkZWQ6IG1pZ2h0IGJlIGFibGUgdG8gcGFpbnQgY291bnRyaWVzIGluIGNvbG9yc1xyXG4gICAgICBpZiAodGhpcy5kYXRhKSB7XHJcbiAgICAgICAgLy8gZ2V0IGhpZ2hlc3QgdmFsdWUgaW4gcmFuZ2VcclxuICAgICAgICBjb25zdCBtYXhWYWwgPSBleGlzdHModGhpcy5tYXhWYWx1ZSkgPyB0aGlzLm1heFZhbHVlIDogT2JqZWN0LnZhbHVlcyh0aGlzLmRhdGEpLnJlZHVjZShcclxuICAgICAgICAgIChhY2MsIGN1cnIpID0+IGNvdW50cnlOdW0oY3VycikgPiBhY2MgfHwgYWNjID09PSBudWxsPyBjb3VudHJ5TnVtKGN1cnIpIDogYWNjLCBudWxsIGFzIG51bWJlclxyXG4gICAgICAgICk7XHJcbiAgICAgICAgLy8gZ2V0IGxvd2VzdCB2YWx1ZSBpbiByYW5nZVxyXG4gICAgICAgIGNvbnN0IG1pblZhbCA9IGV4aXN0cyh0aGlzLm1pblZhbHVlKSA/IHRoaXMubWluVmFsdWUgOiBPYmplY3QudmFsdWVzKHRoaXMuZGF0YSkucmVkdWNlKFxyXG4gICAgICAgICAgKGFjYywgY3VycikgPT4gY291bnRyeU51bShjdXJyKSA8IGFjYyB8fCBhY2MgPT09IG51bGw/IGNvdW50cnlOdW0oY3VycikgOiBhY2MsIG51bGwgYXMgbnVtYmVyXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgLy8gbWFwIHZhbHVlcyBpbiByYW5nZSB0byBjb2xvcnNcclxuICAgICAgICBjb25zdCB2YWxUb0NvbCA9IHNjYWxlKFt0aGlzLm1pbkNvbG9yLCB0aGlzLm1heENvbG9yXSkuY29sb3JzKChtYXhWYWwgPz8gMSkgLSAobWluVmFsID8/IDApICsgMSkucmVkdWNlKChhY2MsIGN1cnIsIGkpID0+XHJcbiAgICAgICAgICAoeyAuLi5hY2MsIFtpICsgbWluVmFsXTogY3VyciB9KSwge30gYXMgeyBba2V5OiBudW1iZXJdOiBzdHJpbmcgfVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIGNyZWF0ZSBsb2NhbCBNYXAgdXNpbmcgcHJvdmlkZWQgZGF0YSArIGNhbGN1bGF0ZWQgY29sb3JzXHJcbiAgICAgICAgdGhpcy5tYXBEYXRhID0gT2JqZWN0LmVudHJpZXModGhpcy5kYXRhKS5yZWR1Y2UoKGFjYywgWyBjb3VudHJ5SWQsIGNvdW50cnlWYWwgXSkgPT5cclxuICAgICAgICAgICh7IC4uLmFjYyxcclxuICAgICAgICAgICAgW2NvdW50cnlJZC50b0xvd2VyQ2FzZSgpXToge1xyXG4gICAgICAgICAgICAgIC4uLmNvdW50cnlWYWwsXHJcbiAgICAgICAgICAgICAgY29sb3I6IHZhbFRvQ29sW2NvdW50cnlOdW0oY291bnRyeVZhbCldIC8vIHZhbHVlIGluIGJldHdlZW4gbWluVmFsIGFuZCBtYXhWYWxcclxuICAgICAgICAgICAgICAgIHx8IChcclxuICAgICAgICAgICAgICAgICAgLy8gdmFsdWUgYmVsb3cgbWluVmFsXHJcbiAgICAgICAgICAgICAgICAgIGNvdW50cnlOdW0oY291bnRyeVZhbCkgPD0gbWluVmFsID8gdmFsVG9Db2xbbWluVmFsXSA6XHJcbiAgICAgICAgICAgICAgICAgIC8vIHZhbHVlIGFib3ZlIG1heFZhbFxyXG4gICAgICAgICAgICAgICAgICBjb3VudHJ5TnVtKGNvdW50cnlWYWwpID49IG1heFZhbCA/IHZhbFRvQ29sW21heFZhbF1cclxuICAgICAgICAgICAgICAgICAgLy8gd2VpcmQ7IHNob3VsZCBuZXZlciBnZXQgdG8gaGVyZVxyXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5leGNlcHRpb25Db2xvclxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9IGFzIERyYXdhYmxlQ291bnRyeSB9KSxcclxuICAgICAgICAgIHt9IGFzIERyYXdhYmxlQ291bnRyaWVzXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgIC8vIG5vIGRhdGEgcHJvdmlkZWQ6IHdpbGwgcGFpbnQgcGxhaW4gbWFwXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5tYXBEYXRhID0ge307XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHN2Z01hcCA9IHRoaXMubWFwQ29udGVudC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdIGFzIFNWR1NWR0VsZW1lbnQ7XHJcbiAgICAgIHN2Z01hcC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgc3ZnTWFwLnF1ZXJ5U2VsZWN0b3JBbGw8U1ZHU1ZHRWxlbWVudD4oYC4ke2NvdW50cnlDbGFzc31gKS5mb3JFYWNoKGl0ZW0gPT4ge1xyXG4gICAgICAgIGNvbnN0IG1hcEl0ZW0gPSB0aGlzLm1hcERhdGFbaXRlbS5pZC50b0xvd2VyQ2FzZSgpXTtcclxuICAgICAgICBjb25zdCBpc0V4Y2VwdGlvbiA9IG1hcEl0ZW0gPyAhZXhpc3RzKG1hcEl0ZW0udmFsdWUpIDogZmFsc2U7XHJcbiAgICAgICAgaXRlbS5zdHlsZS5maWxsID0gbWFwSXRlbSA/IGlzRXhjZXB0aW9uID8gdGhpcy5leGNlcHRpb25Db2xvciA6IG1hcEl0ZW0uY29sb3IgOiB0aGlzLm5vRGF0YUNvbG9yO1xyXG4gICAgICAgIGl0ZW0ub25tb3VzZWVudGVyID0gdGhpcy5jb3VudHJ5SG92ZXIuYmluZCh0aGlzLCBpdGVtLCB0cnVlKTtcclxuICAgICAgICBpdGVtLm9ubW91c2VsZWF2ZSA9IHRoaXMuY291bnRyeUhvdmVyLmJpbmQodGhpcywgaXRlbSwgZmFsc2UpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuaW5uZXJMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuY2RSZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICB0aGlzLm9uQ2hhcnRSZWFkeSgpO1xyXG5cclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgdGhpcy5vbkNoYXJ0ZXJyb3IoeyBpZDogQ2hhckVycm9yQ29kZS5sb2FkaW5nLCBtZXNzYWdlOiAnQ291bGQgbm90IGxvYWQnIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb3VudHJ5SG92ZXIoaXRlbTogU1ZHRWxlbWVudCwgaG92ZXJlZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgaXRlbS5zdHlsZS5zdHJva2VXaWR0aCA9IGdldFN0cm9rZVdpZHRoKGhvdmVyZWQpO1xyXG4gICAgaXRlbS5zdHlsZS5zdHJva2UgPSBnZXRTdHJva2VDb2xvcihob3ZlcmVkKTtcclxuICAgIGl0ZW0ucXVlcnlTZWxlY3RvckFsbDxTVkdFbGVtZW50PignLmxhbmR4eCcpLmZvckVhY2goaSA9PiB7XHJcbiAgICAgIGkuc3R5bGUuc3Ryb2tlV2lkdGggPSBnZXRTdHJva2VXaWR0aChob3ZlcmVkKTtcclxuICAgICAgaS5zdHlsZS5zdHJva2UgPSBnZXRTdHJva2VDb2xvcihob3ZlcmVkKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvbkNoYXJ0UmVhZHkoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5pbm5lckxvYWRpbmcpIHtcclxuICAgICAgdGhpcy5pbm5lckxvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgdGhpcy5jaGFydFJlYWR5LmVtaXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25DaGFydGVycm9yKGVycm9yOiBDaGFydEVycm9yRXZlbnQpOiB2b2lkIHtcclxuICAgIHRoaXMuY2hhcnRFcnJvci5lbWl0KGVycm9yKTtcclxuICB9XHJcblxyXG4gIG9uTWFwU2VsZWN0KHsgdGFyZ2V0IH06IHsgdGFyZ2V0PzogU1ZHRWxlbWVudCB9KTogdm9pZCB7XHJcbiAgICBjb25zdCBldmVudDogQ2hhcnRTZWxlY3RFdmVudCA9IHtcclxuICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxyXG4gICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgY291bnRyeTogbnVsbFxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgbmV3SXRlbTogU1ZHRWxlbWVudDtcclxuICAgIGlmICh0YXJnZXQuaWQgPT09IG9jZWFuSWQpIHtcclxuICAgICAgdGhpcy5zZWxlY3RDb3VudHJ5KG51bGwpO1xyXG5cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld0l0ZW0gPSB0YXJnZXQ7XHJcbiAgICAgIHdoaWxlICghbmV3SXRlbS5jbGFzc0xpc3QuY29udGFpbnMoY291bnRyeUNsYXNzKSkge1xyXG4gICAgICAgIG5ld0l0ZW0gPSBuZXdJdGVtLnBhcmVudE5vZGUgYXMgU1ZHRWxlbWVudDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNvdW50cnkgPSB0aGlzLm1hcERhdGFbbmV3SXRlbT8uaWRdO1xyXG4gICAgaWYgKGNvdW50cnkpIHtcclxuICAgICAgZXZlbnQuc2VsZWN0ZWQgPSB0cnVlO1xyXG4gICAgICBldmVudC52YWx1ZSA9IGNvdW50cnlOdW0oY291bnRyeSk7XHJcbiAgICAgIGV2ZW50LmNvdW50cnkgPSBuZXdJdGVtLmlkLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgIHRoaXMuc2VsZWN0Q291bnRyeShldmVudC5jb3VudHJ5KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2VsZWN0Q291bnRyeShudWxsKTtcclxuICAgIH1cclxuICAgIHRoaXMuY2hhcnRTZWxlY3QuZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=