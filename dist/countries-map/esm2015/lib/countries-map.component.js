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
                template: "<div class=\"major-block loading\" *ngIf=\"loading\"><span class=\"text\">Loading map...</span></div>\n\n<countries-map-base class=\"major-block cm-map-content\" #mapContent (click)=\"onMapSelect($event)\" [ngClass]=\"{'goes-first': captionBelow}\">\n</countries-map-base>\n\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\"\n  *ngIf=\"!loading && showCaption\">\n  <div class=\"cm-simple-caption\">\n    <div class=\"cm-country-label\">\n      <span class=\"cm-default-label\" *ngIf=\"!selection\">{{countryLabel}}</span>\n      <span class=\"cm-country-name\" *ngIf=\"selection\">{{selection?.countryName}}</span>\n    </div>\n    <div class=\"cm-value-label\">\n      <span class=\"cm-value-text\"\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}<span *ngIf=\"selection\">: </span></span>\n      <span class=\"cm-value-content\" *ngIf=\"selection\">{{selectionValue}}</span>\n    </div>\n  </div>\n  <div class=\"cm-extended-caption\" *ngIf=\"selection?.extra && selection?.extra.length > 0\">\n    <div *ngFor=\"let item of selection?.extra\" class=\"cm-extended-item\">\n      <span class=\"cm-extended-label\">{{item.key}}</span>:\n      <span class=\"cm-extended-value\">{{item.val}}</span>\n    </div>\n  </div>\n</div>\n",
                styles: [":host{display:flex;flex-flow:column nowrap;justify-content:space-between;align-items:stretch;align-content:stretch}.major-block.loading{flex:0 1 auto;align-self:center}.major-block.loading .text{font-style:italic;font-family:sans-serif;color:grey}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{flex:0 1 auto;display:flex;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{flex:0 1 auto;align-self:flex-start}.cm-value-label{flex:0 1 auto;align-self:flex-end}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9saWIvc3JjL2xpYi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFlBQVksRUFJYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFJekQsT0FBTyxFQUFFLEVBQUUsSUFBSSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRWxDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksS0FBSyxJQUFJLENBQUM7O0FBQ3BFLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBaUIsRUFBRSxFQUFFLFdBQUMsT0FBQSxRQUFRLE9BQUMsSUFBSSxDQUFDLEtBQUssMENBQUUsUUFBUSxHQUFHLENBQUEsRUFBQSxDQUFDOztBQUUzRSxNQUFNLFlBQVksR0FBRyxXQUFXLENBQUM7QUFDakMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3hCLE1BQU0sY0FBYyxHQUFHLENBQUMsU0FBa0IsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7QUFDM0UsTUFBTSxjQUFjLEdBQUcsQ0FBQyxTQUFrQixFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDOztBQUU5RSxNQUFNLFdBQVcsR0FBRyxDQUFDLFdBQW1C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QUFDO1lBQ2xDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN6QyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNuQzthQUFNO1lBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxQjtRQUNELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7OztZQWxMRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxreENBQTZDOzthQUU5Qzs7O1lBOUJDLGlCQUFpQjs7O21CQWlDaEIsS0FBSzsyQkFDTCxLQUFLO3lCQUNMLEtBQUs7MEJBQ0wsS0FBSzsyQkFDTCxLQUFLO3VCQUNMLEtBQUs7dUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3VCQUNMLEtBQUs7OEJBQ0wsS0FBSzswQkFDTCxLQUFLOzZCQUNMLEtBQUs7eUJBRUwsTUFBTTt5QkFDTixNQUFNOzBCQUNOLE1BQU07eUJBRU4sU0FBUyxTQUFDLFlBQVksRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbiAgVmlld0NoaWxkLFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2hhckVycm9yQ29kZSB9IGZyb20gJy4vY2hhcnQtZXZlbnRzLmludGVyZmFjZSc7XG5pbXBvcnQgdHlwZSB7IENoYXJ0U2VsZWN0RXZlbnQsIENoYXJ0RXJyb3JFdmVudCB9IGZyb20gJy4vY2hhcnQtZXZlbnRzLmludGVyZmFjZSc7XG5pbXBvcnQgdHlwZSB7IENvdW50cmllc0RhdGEsIFNlbGVjdGlvbkV4dHJhLCBEcmF3YWJsZUNvdW50cmllcywgU2VsZWN0aW9uLFxuICBWYWxpZEV4dHJhRGF0YSwgRHJhd2FibGVDb3VudHJ5LCBDb3VudHJ5RGF0YSB9IGZyb20gJy4vZGF0YS10eXBlcy5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgZW4gYXMgY291bnRyaWVzRU4gfSBmcm9tICdAamFnb21mL2NvdW50cmllc2xpc3QnO1xuaW1wb3J0IHsgc2NhbGUgfSBmcm9tICdjaHJvbWEtanMnO1xuXG5jb25zdCBleGlzdHMgPSBpdGVtID0+IHR5cGVvZiBpdGVtICE9PSAndW5kZWZpbmVkJyAmJiBpdGVtICE9PSBudWxsO1xuY29uc3QgY291bnRyeU51bSA9IChpdGVtOiBDb3VudHJ5RGF0YSkgPT4gcGFyc2VJbnQoaXRlbS52YWx1ZT8udG9TdHJpbmcoKSk7XG5cbmNvbnN0IGNvdW50cnlDbGFzcyA9ICdjb3VudHJ5eHgnO1xuY29uc3Qgb2NlYW5JZCA9ICdvY2Vhbic7XG5jb25zdCBnZXRTdHJva2VXaWR0aCA9IChpc0hvdmVyZWQ6IGJvb2xlYW4pID0+IGlzSG92ZXJlZCA/ICcwLjIlJyA6ICcwLjElJztcbmNvbnN0IGdldFN0cm9rZUNvbG9yID0gKGlzSG92ZXJlZDogYm9vbGVhbikgPT4gaXNIb3ZlcmVkID8gJyM4ODgnIDogJyNhZmFmYWYnO1xuXG5jb25zdCBjb3VudHJ5TmFtZSA9IChjb3VudHJ5Q29kZTogc3RyaW5nKTogc3RyaW5nID0+IHtcbiAgcmV0dXJuIGNvdW50cmllc0VOW2NvdW50cnlDb2RlXTtcbn07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NvdW50cmllcy1tYXAnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgdGVtcGxhdGVVcmw6ICcuL2NvdW50cmllcy1tYXAuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC5zY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgQ291bnRyaWVzTWFwQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzIHtcblxuICBASW5wdXQoKSBkYXRhOiBDb3VudHJpZXNEYXRhO1xuICBASW5wdXQoKSBjb3VudHJ5TGFiZWwgPSAnQ291bnRyeSc7XG4gIEBJbnB1dCgpIHZhbHVlTGFiZWwgPSAnVmFsdWUnO1xuICBASW5wdXQoKSBzaG93Q2FwdGlvbiA9IHRydWU7XG4gIEBJbnB1dCgpIGNhcHRpb25CZWxvdyA9IHRydWU7XG4gIEBJbnB1dCgpIG1pblZhbHVlOiBudW1iZXI7XG4gIEBJbnB1dCgpIG1heFZhbHVlOiBudW1iZXI7XG4gIEBJbnB1dCgpIG1pbkNvbG9yID0gJ3doaXRlJztcbiAgQElucHV0KCkgbWF4Q29sb3IgPSAncmVkJztcbiAgQElucHV0KCkgYmFja2dyb3VuZENvbG9yID0gJ3doaXRlJztcbiAgQElucHV0KCkgbm9EYXRhQ29sb3IgPSAnI0NGQ0ZDRic7XG4gIEBJbnB1dCgpIGV4Y2VwdGlvbkNvbG9yID0gJyNGRkVFNTgnO1xuXG4gIEBPdXRwdXQoKSBwcml2YXRlIHJlYWRvbmx5IGNoYXJ0UmVhZHkgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gIEBPdXRwdXQoKSBwcml2YXRlIHJlYWRvbmx5IGNoYXJ0RXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0RXJyb3JFdmVudD4oKTtcbiAgQE91dHB1dCgpIHByaXZhdGUgcmVhZG9ubHkgY2hhcnRTZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0U2VsZWN0RXZlbnQ+KCk7XG5cbiAgQFZpZXdDaGlsZCgnbWFwQ29udGVudCcsIHsgc3RhdGljOiBmYWxzZSwgcmVhZDogRWxlbWVudFJlZiB9KSBwcml2YXRlIHJlYWRvbmx5IG1hcENvbnRlbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIG1hcERhdGE6IERyYXdhYmxlQ291bnRyaWVzO1xuICBzZWxlY3Rpb246IFNlbGVjdGlvbiB8IG51bGwgPSBudWxsO1xuXG4gIHByaXZhdGUgaW5uZXJMb2FkaW5nID0gdHJ1ZTtcbiAgZ2V0IGxvYWRpbmcoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaW5uZXJMb2FkaW5nO1xuICB9XG5cbiAgZ2V0IHNlbGVjdGlvblZhbHVlKCk6IFZhbGlkRXh0cmFEYXRhIHtcbiAgICByZXR1cm4gdGhpcy5kYXRhW3RoaXMuc2VsZWN0aW9uLmNvdW50cnlJZF0udmFsdWU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNkUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgKSB7IH1cblxuICBwcml2YXRlIGdldEV4dHJhU2VsZWN0ZWQoY291bnRyeTogc3RyaW5nKTogU2VsZWN0aW9uRXh0cmFbXSB8IG51bGwge1xuICAgIGNvbnN0IHsgZXh0cmEgfSA9IHRoaXMuZGF0YVtjb3VudHJ5XTtcbiAgICByZXR1cm4gZXh0cmEgJiYgT2JqZWN0LmtleXMoZXh0cmEpLm1hcChrZXkgPT4gKHsga2V5LCB2YWw6IGV4dHJhW2tleV0gfSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZWxlY3RDb3VudHJ5KGNvdW50cnk/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdGlvbiA9IGNvdW50cnkgPyB7XG4gICAgICBjb3VudHJ5SWQ6IGNvdW50cnksXG4gICAgICBjb3VudHJ5TmFtZTogY291bnRyeU5hbWUoY291bnRyeSksXG4gICAgICBleHRyYTogdGhpcy5nZXRFeHRyYVNlbGVjdGVkKGNvdW50cnkpXG4gICAgfSA6IG51bGw7XG4gICAgdGhpcy5jZFJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsaXplTWFwKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgY29uc3QgY2hhbmdlZE1hcFZhbHVlQnV0Tm90T25TdGFydCA9IFsnZGF0YScsICdtaW5Db2xvcicsICdtYXhDb2xvcicsICdiYWNrZ3JvdW5kQ29sb3InLCAnbm9EYXRhQ29sb3InLCAnZXhjZXB0aW9uQ29sb3InXVxuICAgICAgLnNvbWUoYXR0ciA9PiBjaGFuZ2VzW2F0dHJdICYmICFjaGFuZ2VzW2F0dHJdLmZpcnN0Q2hhbmdlKTtcblxuICAgIGlmIChjaGFuZ2VkTWFwVmFsdWVCdXROb3RPblN0YXJ0KSB7XG4gICAgICB0aGlzLmluaXRpYWxpemVNYXAoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluaXRpYWxpemVNYXAoKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIGRhdGEgaXMgcHJvdmlkZWQ6IG1pZ2h0IGJlIGFibGUgdG8gcGFpbnQgY291bnRyaWVzIGluIGNvbG9yc1xuICAgICAgaWYgKHRoaXMuZGF0YSkge1xuICAgICAgICAvLyBnZXQgaGlnaGVzdCB2YWx1ZSBpbiByYW5nZVxuICAgICAgICBjb25zdCBtYXhWYWwgPSBleGlzdHModGhpcy5tYXhWYWx1ZSkgPyB0aGlzLm1heFZhbHVlIDogT2JqZWN0LnZhbHVlcyh0aGlzLmRhdGEpLnJlZHVjZShcbiAgICAgICAgICAoYWNjLCBjdXJyKSA9PiBjb3VudHJ5TnVtKGN1cnIpID4gYWNjIHx8IGFjYyA9PT0gbnVsbD8gY291bnRyeU51bShjdXJyKSA6IGFjYywgbnVsbCBhcyBudW1iZXJcbiAgICAgICAgKTtcbiAgICAgICAgLy8gZ2V0IGxvd2VzdCB2YWx1ZSBpbiByYW5nZVxuICAgICAgICBjb25zdCBtaW5WYWwgPSBleGlzdHModGhpcy5taW5WYWx1ZSkgPyB0aGlzLm1pblZhbHVlIDogT2JqZWN0LnZhbHVlcyh0aGlzLmRhdGEpLnJlZHVjZShcbiAgICAgICAgICAoYWNjLCBjdXJyKSA9PiBjb3VudHJ5TnVtKGN1cnIpIDwgYWNjIHx8IGFjYyA9PT0gbnVsbD8gY291bnRyeU51bShjdXJyKSA6IGFjYywgbnVsbCBhcyBudW1iZXJcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBtYXAgdmFsdWVzIGluIHJhbmdlIHRvIGNvbG9yc1xuICAgICAgICBjb25zdCB2YWxUb0NvbCA9IHNjYWxlKFt0aGlzLm1pbkNvbG9yLCB0aGlzLm1heENvbG9yXSkuY29sb3JzKChtYXhWYWwgPz8gMSkgLSAobWluVmFsID8/IDApICsgMSkucmVkdWNlKChhY2MsIGN1cnIsIGkpID0+XG4gICAgICAgICAgKHsgLi4uYWNjLCBbaSArIG1pblZhbF06IGN1cnIgfSksIHt9IGFzIHsgW2tleTogbnVtYmVyXTogc3RyaW5nIH1cbiAgICAgICAgKTtcblxuICAgICAgICAvLyBjcmVhdGUgbG9jYWwgTWFwIHVzaW5nIHByb3ZpZGVkIGRhdGEgKyBjYWxjdWxhdGVkIGNvbG9yc1xuICAgICAgICB0aGlzLm1hcERhdGEgPSBPYmplY3QuZW50cmllcyh0aGlzLmRhdGEpLnJlZHVjZSgoYWNjLCBbIGNvdW50cnlJZCwgY291bnRyeVZhbCBdKSA9PlxuICAgICAgICAgICh7IC4uLmFjYyxcbiAgICAgICAgICAgIFtjb3VudHJ5SWQudG9Mb3dlckNhc2UoKV06IHtcbiAgICAgICAgICAgICAgLi4uY291bnRyeVZhbCxcbiAgICAgICAgICAgICAgY29sb3I6IHZhbFRvQ29sW2NvdW50cnlOdW0oY291bnRyeVZhbCldIC8vIHZhbHVlIGluIGJldHdlZW4gbWluVmFsIGFuZCBtYXhWYWxcbiAgICAgICAgICAgICAgICB8fCAoXG4gICAgICAgICAgICAgICAgICAvLyB2YWx1ZSBiZWxvdyBtaW5WYWxcbiAgICAgICAgICAgICAgICAgIGNvdW50cnlOdW0oY291bnRyeVZhbCkgPD0gbWluVmFsID8gdmFsVG9Db2xbbWluVmFsXSA6XG4gICAgICAgICAgICAgICAgICAvLyB2YWx1ZSBhYm92ZSBtYXhWYWxcbiAgICAgICAgICAgICAgICAgIGNvdW50cnlOdW0oY291bnRyeVZhbCkgPj0gbWF4VmFsID8gdmFsVG9Db2xbbWF4VmFsXVxuICAgICAgICAgICAgICAgICAgLy8gd2VpcmQ7IHNob3VsZCBuZXZlciBnZXQgdG8gaGVyZVxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuZXhjZXB0aW9uQ29sb3JcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICB9IGFzIERyYXdhYmxlQ291bnRyeSB9KSxcbiAgICAgICAgICB7fSBhcyBEcmF3YWJsZUNvdW50cmllc1xuICAgICAgICApO1xuXG4gICAgICAvLyBubyBkYXRhIHByb3ZpZGVkOiB3aWxsIHBhaW50IHBsYWluIG1hcFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tYXBEYXRhID0ge307XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN2Z01hcCA9IHRoaXMubWFwQ29udGVudC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdIGFzIFNWR1NWR0VsZW1lbnQ7XG4gICAgICBzdmdNYXAuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5iYWNrZ3JvdW5kQ29sb3I7XG4gICAgICBzdmdNYXAucXVlcnlTZWxlY3RvckFsbDxTVkdTVkdFbGVtZW50PihgLiR7Y291bnRyeUNsYXNzfWApLmZvckVhY2goaXRlbSA9PiB7XG4gICAgICAgIGNvbnN0IG1hcEl0ZW0gPSB0aGlzLm1hcERhdGFbaXRlbS5pZC50b0xvd2VyQ2FzZSgpXTtcbiAgICAgICAgY29uc3QgaXNFeGNlcHRpb24gPSBtYXBJdGVtID8gIWV4aXN0cyhtYXBJdGVtLnZhbHVlKSA6IGZhbHNlO1xuICAgICAgICBpdGVtLnN0eWxlLmZpbGwgPSBtYXBJdGVtID8gaXNFeGNlcHRpb24gPyB0aGlzLmV4Y2VwdGlvbkNvbG9yIDogbWFwSXRlbS5jb2xvciA6IHRoaXMubm9EYXRhQ29sb3I7XG4gICAgICAgIGl0ZW0ub25tb3VzZWVudGVyID0gdGhpcy5jb3VudHJ5SG92ZXIuYmluZCh0aGlzLCBpdGVtLCB0cnVlKTtcbiAgICAgICAgaXRlbS5vbm1vdXNlbGVhdmUgPSB0aGlzLmNvdW50cnlIb3Zlci5iaW5kKHRoaXMsIGl0ZW0sIGZhbHNlKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmlubmVyTG9hZGluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5jZFJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB0aGlzLm9uQ2hhcnRSZWFkeSgpO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgdGhpcy5vbkNoYXJ0ZXJyb3IoeyBpZDogQ2hhckVycm9yQ29kZS5sb2FkaW5nLCBtZXNzYWdlOiAnQ291bGQgbm90IGxvYWQnIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY291bnRyeUhvdmVyKGl0ZW06IFNWR0VsZW1lbnQsIGhvdmVyZWQ6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpdGVtLnN0eWxlLnN0cm9rZVdpZHRoID0gZ2V0U3Ryb2tlV2lkdGgoaG92ZXJlZCk7XG4gICAgaXRlbS5zdHlsZS5zdHJva2UgPSBnZXRTdHJva2VDb2xvcihob3ZlcmVkKTtcbiAgICBpdGVtLnF1ZXJ5U2VsZWN0b3JBbGw8U1ZHRWxlbWVudD4oJy5sYW5keHgnKS5mb3JFYWNoKGkgPT4ge1xuICAgICAgaS5zdHlsZS5zdHJva2VXaWR0aCA9IGdldFN0cm9rZVdpZHRoKGhvdmVyZWQpO1xuICAgICAgaS5zdHlsZS5zdHJva2UgPSBnZXRTdHJva2VDb2xvcihob3ZlcmVkKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgb25DaGFydFJlYWR5KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlubmVyTG9hZGluZykge1xuICAgICAgdGhpcy5pbm5lckxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuY2hhcnRSZWFkeS5lbWl0KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvbkNoYXJ0ZXJyb3IoZXJyb3I6IENoYXJ0RXJyb3JFdmVudCk6IHZvaWQge1xuICAgIHRoaXMuY2hhcnRFcnJvci5lbWl0KGVycm9yKTtcbiAgfVxuXG4gIG9uTWFwU2VsZWN0KHsgdGFyZ2V0IH06IHsgdGFyZ2V0PzogU1ZHRWxlbWVudCB9KTogdm9pZCB7XG4gICAgY29uc3QgZXZlbnQ6IENoYXJ0U2VsZWN0RXZlbnQgPSB7XG4gICAgICBzZWxlY3RlZDogZmFsc2UsXG4gICAgICB2YWx1ZTogbnVsbCxcbiAgICAgIGNvdW50cnk6IG51bGxcbiAgICB9O1xuXG4gICAgbGV0IG5ld0l0ZW06IFNWR0VsZW1lbnQ7XG4gICAgaWYgKHRhcmdldC5pZCA9PT0gb2NlYW5JZCkge1xuICAgICAgdGhpcy5zZWxlY3RDb3VudHJ5KG51bGwpO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld0l0ZW0gPSB0YXJnZXQ7XG4gICAgICB3aGlsZSAoIW5ld0l0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKGNvdW50cnlDbGFzcykpIHtcbiAgICAgICAgbmV3SXRlbSA9IG5ld0l0ZW0ucGFyZW50Tm9kZSBhcyBTVkdFbGVtZW50O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNvdW50cnkgPSB0aGlzLm1hcERhdGFbbmV3SXRlbT8uaWRdO1xuICAgIGlmIChjb3VudHJ5KSB7XG4gICAgICBldmVudC5zZWxlY3RlZCA9IHRydWU7XG4gICAgICBldmVudC52YWx1ZSA9IGNvdW50cnlOdW0oY291bnRyeSk7XG4gICAgICBldmVudC5jb3VudHJ5ID0gbmV3SXRlbS5pZC50b1VwcGVyQ2FzZSgpO1xuICAgICAgdGhpcy5zZWxlY3RDb3VudHJ5KGV2ZW50LmNvdW50cnkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdENvdW50cnkobnVsbCk7XG4gICAgfVxuICAgIHRoaXMuY2hhcnRTZWxlY3QuZW1pdChldmVudCk7XG4gIH1cblxufVxuIl19