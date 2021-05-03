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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9saWIvc3JjL2xpYi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFlBQVksRUFJYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFJekQsT0FBTyxFQUFFLEVBQUUsSUFBSSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRWxDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksS0FBSyxJQUFJLENBQUM7O0FBQ3BFLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBaUIsRUFBRSxFQUFFLFdBQUMsT0FBQSxRQUFRLE9BQUMsSUFBSSxDQUFDLEtBQUssMENBQUUsUUFBUSxHQUFHLENBQUEsRUFBQSxDQUFDOztBQUUzRSxNQUFNLFlBQVksR0FBRyxXQUFXLENBQUM7QUFDakMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDO0FBQ3hCLE1BQU0sY0FBYyxHQUFHLENBQUMsU0FBa0IsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQzs7QUFDM0UsTUFBTSxjQUFjLEdBQUcsQ0FBQyxTQUFrQixFQUFFLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDOztBQUU5RSxNQUFNLFdBQVcsR0FBRyxDQUFDLFdBQW1C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QUFDO1lBQ2xDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN6QyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNuQzthQUFNO1lBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxQjtRQUNELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7OztZQWxMRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxvMENBQTZDOzthQUU5Qzs7O1lBOUJDLGlCQUFpQjs7O21CQWlDaEIsS0FBSzsyQkFDTCxLQUFLO3lCQUNMLEtBQUs7MEJBQ0wsS0FBSzsyQkFDTCxLQUFLO3VCQUNMLEtBQUs7dUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3VCQUNMLEtBQUs7OEJBQ0wsS0FBSzswQkFDTCxLQUFLOzZCQUNMLEtBQUs7eUJBRUwsTUFBTTt5QkFDTixNQUFNOzBCQUNOLE1BQU07eUJBRU4sU0FBUyxTQUFDLFlBQVksRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIFZpZXdDaGlsZCxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBDaGFuZ2VEZXRlY3RvclJlZixcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgQWZ0ZXJWaWV3SW5pdCxcclxuICBPbkNoYW5nZXMsXHJcbiAgU2ltcGxlQ2hhbmdlc1xyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDaGFyRXJyb3JDb2RlIH0gZnJvbSAnLi9jaGFydC1ldmVudHMuaW50ZXJmYWNlJztcclxuaW1wb3J0IHR5cGUgeyBDaGFydFNlbGVjdEV2ZW50LCBDaGFydEVycm9yRXZlbnQgfSBmcm9tICcuL2NoYXJ0LWV2ZW50cy5pbnRlcmZhY2UnO1xyXG5pbXBvcnQgdHlwZSB7IENvdW50cmllc0RhdGEsIFNlbGVjdGlvbkV4dHJhLCBEcmF3YWJsZUNvdW50cmllcywgU2VsZWN0aW9uLFxyXG4gIFZhbGlkRXh0cmFEYXRhLCBEcmF3YWJsZUNvdW50cnksIENvdW50cnlEYXRhIH0gZnJvbSAnLi9kYXRhLXR5cGVzLmludGVyZmFjZSc7XHJcbmltcG9ydCB7IGVuIGFzIGNvdW50cmllc0VOIH0gZnJvbSAnQGphZ29tZi9jb3VudHJpZXNsaXN0JztcclxuaW1wb3J0IHsgc2NhbGUgfSBmcm9tICdjaHJvbWEtanMnO1xyXG5cclxuY29uc3QgZXhpc3RzID0gaXRlbSA9PiB0eXBlb2YgaXRlbSAhPT0gJ3VuZGVmaW5lZCcgJiYgaXRlbSAhPT0gbnVsbDtcclxuY29uc3QgY291bnRyeU51bSA9IChpdGVtOiBDb3VudHJ5RGF0YSkgPT4gcGFyc2VJbnQoaXRlbS52YWx1ZT8udG9TdHJpbmcoKSk7XHJcblxyXG5jb25zdCBjb3VudHJ5Q2xhc3MgPSAnY291bnRyeXh4JztcclxuY29uc3Qgb2NlYW5JZCA9ICdvY2Vhbic7XHJcbmNvbnN0IGdldFN0cm9rZVdpZHRoID0gKGlzSG92ZXJlZDogYm9vbGVhbikgPT4gaXNIb3ZlcmVkID8gJzAuMiUnIDogJzAuMSUnO1xyXG5jb25zdCBnZXRTdHJva2VDb2xvciA9IChpc0hvdmVyZWQ6IGJvb2xlYW4pID0+IGlzSG92ZXJlZCA/ICcjODg4JyA6ICcjYWZhZmFmJztcclxuXHJcbmNvbnN0IGNvdW50cnlOYW1lID0gKGNvdW50cnlDb2RlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG4gIHJldHVybiBjb3VudHJpZXNFTltjb3VudHJ5Q29kZV07XHJcbn07XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2NvdW50cmllcy1tYXAnLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC5zY3NzJ11cclxufSlcclxuZXhwb3J0IGNsYXNzIENvdW50cmllc01hcENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcyB7XHJcblxyXG4gIEBJbnB1dCgpIGRhdGE6IENvdW50cmllc0RhdGE7XHJcbiAgQElucHV0KCkgY291bnRyeUxhYmVsID0gJ0NvdW50cnknO1xyXG4gIEBJbnB1dCgpIHZhbHVlTGFiZWwgPSAnVmFsdWUnO1xyXG4gIEBJbnB1dCgpIHNob3dDYXB0aW9uID0gdHJ1ZTtcclxuICBASW5wdXQoKSBjYXB0aW9uQmVsb3cgPSB0cnVlO1xyXG4gIEBJbnB1dCgpIG1pblZhbHVlOiBudW1iZXI7XHJcbiAgQElucHV0KCkgbWF4VmFsdWU6IG51bWJlcjtcclxuICBASW5wdXQoKSBtaW5Db2xvciA9ICd3aGl0ZSc7XHJcbiAgQElucHV0KCkgbWF4Q29sb3IgPSAncmVkJztcclxuICBASW5wdXQoKSBiYWNrZ3JvdW5kQ29sb3IgPSAnd2hpdGUnO1xyXG4gIEBJbnB1dCgpIG5vRGF0YUNvbG9yID0gJyNDRkNGQ0YnO1xyXG4gIEBJbnB1dCgpIGV4Y2VwdGlvbkNvbG9yID0gJyNGRkVFNTgnO1xyXG5cclxuICBAT3V0cHV0KCkgcHJpdmF0ZSByZWFkb25seSBjaGFydFJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xyXG4gIEBPdXRwdXQoKSBwcml2YXRlIHJlYWRvbmx5IGNoYXJ0RXJyb3IgPSBuZXcgRXZlbnRFbWl0dGVyPENoYXJ0RXJyb3JFdmVudD4oKTtcclxuICBAT3V0cHV0KCkgcHJpdmF0ZSByZWFkb25seSBjaGFydFNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRTZWxlY3RFdmVudD4oKTtcclxuXHJcbiAgQFZpZXdDaGlsZCgnbWFwQ29udGVudCcsIHsgc3RhdGljOiBmYWxzZSwgcmVhZDogRWxlbWVudFJlZiB9KSBwcml2YXRlIHJlYWRvbmx5IG1hcENvbnRlbnQ6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xyXG5cclxuICBtYXBEYXRhOiBEcmF3YWJsZUNvdW50cmllcztcclxuICBzZWxlY3Rpb246IFNlbGVjdGlvbiB8IG51bGwgPSBudWxsO1xyXG5cclxuICBwcml2YXRlIGlubmVyTG9hZGluZyA9IHRydWU7XHJcbiAgZ2V0IGxvYWRpbmcoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5pbm5lckxvYWRpbmc7XHJcbiAgfVxyXG5cclxuICBnZXQgc2VsZWN0aW9uVmFsdWUoKTogVmFsaWRFeHRyYURhdGEge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLnNlbGVjdGlvbi5jb3VudHJ5SWRdLnZhbHVlO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNkUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcclxuICApIHsgfVxyXG5cclxuICBwcml2YXRlIGdldEV4dHJhU2VsZWN0ZWQoY291bnRyeTogc3RyaW5nKTogU2VsZWN0aW9uRXh0cmFbXSB8IG51bGwge1xyXG4gICAgY29uc3QgeyBleHRyYSB9ID0gdGhpcy5kYXRhW2NvdW50cnldO1xyXG4gICAgcmV0dXJuIGV4dHJhICYmIE9iamVjdC5rZXlzKGV4dHJhKS5tYXAoa2V5ID0+ICh7IGtleSwgdmFsOiBleHRyYVtrZXldIH0pKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc2VsZWN0Q291bnRyeShjb3VudHJ5Pzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLnNlbGVjdGlvbiA9IGNvdW50cnkgPyB7XHJcbiAgICAgIGNvdW50cnlJZDogY291bnRyeSxcclxuICAgICAgY291bnRyeU5hbWU6IGNvdW50cnlOYW1lKGNvdW50cnkpLFxyXG4gICAgICBleHRyYTogdGhpcy5nZXRFeHRyYVNlbGVjdGVkKGNvdW50cnkpXHJcbiAgICB9IDogbnVsbDtcclxuICAgIHRoaXMuY2RSZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbml0aWFsaXplTWFwKCk7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XHJcbiAgICBjb25zdCBjaGFuZ2VkTWFwVmFsdWVCdXROb3RPblN0YXJ0ID0gWydkYXRhJywgJ21pbkNvbG9yJywgJ21heENvbG9yJywgJ2JhY2tncm91bmRDb2xvcicsICdub0RhdGFDb2xvcicsICdleGNlcHRpb25Db2xvciddXHJcbiAgICAgIC5zb21lKGF0dHIgPT4gY2hhbmdlc1thdHRyXSAmJiAhY2hhbmdlc1thdHRyXS5maXJzdENoYW5nZSk7XHJcblxyXG4gICAgaWYgKGNoYW5nZWRNYXBWYWx1ZUJ1dE5vdE9uU3RhcnQpIHtcclxuICAgICAgdGhpcy5pbml0aWFsaXplTWFwKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXRpYWxpemVNYXAoKTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICAvLyBkYXRhIGlzIHByb3ZpZGVkOiBtaWdodCBiZSBhYmxlIHRvIHBhaW50IGNvdW50cmllcyBpbiBjb2xvcnNcclxuICAgICAgaWYgKHRoaXMuZGF0YSkge1xyXG4gICAgICAgIC8vIGdldCBoaWdoZXN0IHZhbHVlIGluIHJhbmdlXHJcbiAgICAgICAgY29uc3QgbWF4VmFsID0gZXhpc3RzKHRoaXMubWF4VmFsdWUpID8gdGhpcy5tYXhWYWx1ZSA6IE9iamVjdC52YWx1ZXModGhpcy5kYXRhKS5yZWR1Y2UoXHJcbiAgICAgICAgICAoYWNjLCBjdXJyKSA9PiBjb3VudHJ5TnVtKGN1cnIpID4gYWNjIHx8IGFjYyA9PT0gbnVsbD8gY291bnRyeU51bShjdXJyKSA6IGFjYywgbnVsbCBhcyBudW1iZXJcclxuICAgICAgICApO1xyXG4gICAgICAgIC8vIGdldCBsb3dlc3QgdmFsdWUgaW4gcmFuZ2VcclxuICAgICAgICBjb25zdCBtaW5WYWwgPSBleGlzdHModGhpcy5taW5WYWx1ZSkgPyB0aGlzLm1pblZhbHVlIDogT2JqZWN0LnZhbHVlcyh0aGlzLmRhdGEpLnJlZHVjZShcclxuICAgICAgICAgIChhY2MsIGN1cnIpID0+IGNvdW50cnlOdW0oY3VycikgPCBhY2MgfHwgYWNjID09PSBudWxsPyBjb3VudHJ5TnVtKGN1cnIpIDogYWNjLCBudWxsIGFzIG51bWJlclxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIC8vIG1hcCB2YWx1ZXMgaW4gcmFuZ2UgdG8gY29sb3JzXHJcbiAgICAgICAgY29uc3QgdmFsVG9Db2wgPSBzY2FsZShbdGhpcy5taW5Db2xvciwgdGhpcy5tYXhDb2xvcl0pLmNvbG9ycygobWF4VmFsID8/IDEpIC0gKG1pblZhbCA/PyAwKSArIDEpLnJlZHVjZSgoYWNjLCBjdXJyLCBpKSA9PlxyXG4gICAgICAgICAgKHsgLi4uYWNjLCBbaSArIG1pblZhbF06IGN1cnIgfSksIHt9IGFzIHsgW2tleTogbnVtYmVyXTogc3RyaW5nIH1cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICAvLyBjcmVhdGUgbG9jYWwgTWFwIHVzaW5nIHByb3ZpZGVkIGRhdGEgKyBjYWxjdWxhdGVkIGNvbG9yc1xyXG4gICAgICAgIHRoaXMubWFwRGF0YSA9IE9iamVjdC5lbnRyaWVzKHRoaXMuZGF0YSkucmVkdWNlKChhY2MsIFsgY291bnRyeUlkLCBjb3VudHJ5VmFsIF0pID0+XHJcbiAgICAgICAgICAoeyAuLi5hY2MsXHJcbiAgICAgICAgICAgIFtjb3VudHJ5SWQudG9Mb3dlckNhc2UoKV06IHtcclxuICAgICAgICAgICAgICAuLi5jb3VudHJ5VmFsLFxyXG4gICAgICAgICAgICAgIGNvbG9yOiB2YWxUb0NvbFtjb3VudHJ5TnVtKGNvdW50cnlWYWwpXSAvLyB2YWx1ZSBpbiBiZXR3ZWVuIG1pblZhbCBhbmQgbWF4VmFsXHJcbiAgICAgICAgICAgICAgICB8fCAoXHJcbiAgICAgICAgICAgICAgICAgIC8vIHZhbHVlIGJlbG93IG1pblZhbFxyXG4gICAgICAgICAgICAgICAgICBjb3VudHJ5TnVtKGNvdW50cnlWYWwpIDw9IG1pblZhbCA/IHZhbFRvQ29sW21pblZhbF0gOlxyXG4gICAgICAgICAgICAgICAgICAvLyB2YWx1ZSBhYm92ZSBtYXhWYWxcclxuICAgICAgICAgICAgICAgICAgY291bnRyeU51bShjb3VudHJ5VmFsKSA+PSBtYXhWYWwgPyB2YWxUb0NvbFttYXhWYWxdXHJcbiAgICAgICAgICAgICAgICAgIC8vIHdlaXJkOyBzaG91bGQgbmV2ZXIgZ2V0IHRvIGhlcmVcclxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuZXhjZXB0aW9uQ29sb3JcclxuICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgfSBhcyBEcmF3YWJsZUNvdW50cnkgfSksXHJcbiAgICAgICAgICB7fSBhcyBEcmF3YWJsZUNvdW50cmllc1xyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAvLyBubyBkYXRhIHByb3ZpZGVkOiB3aWxsIHBhaW50IHBsYWluIG1hcFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMubWFwRGF0YSA9IHt9O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBzdmdNYXAgPSB0aGlzLm1hcENvbnRlbnQubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXSBhcyBTVkdTVkdFbGVtZW50O1xyXG4gICAgICBzdmdNYXAuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5iYWNrZ3JvdW5kQ29sb3I7XHJcbiAgICAgIHN2Z01hcC5xdWVyeVNlbGVjdG9yQWxsPFNWR1NWR0VsZW1lbnQ+KGAuJHtjb3VudHJ5Q2xhc3N9YCkuZm9yRWFjaChpdGVtID0+IHtcclxuICAgICAgICBjb25zdCBtYXBJdGVtID0gdGhpcy5tYXBEYXRhW2l0ZW0uaWQudG9Mb3dlckNhc2UoKV07XHJcbiAgICAgICAgY29uc3QgaXNFeGNlcHRpb24gPSBtYXBJdGVtID8gIWV4aXN0cyhtYXBJdGVtLnZhbHVlKSA6IGZhbHNlO1xyXG4gICAgICAgIGl0ZW0uc3R5bGUuZmlsbCA9IG1hcEl0ZW0gPyBpc0V4Y2VwdGlvbiA/IHRoaXMuZXhjZXB0aW9uQ29sb3IgOiBtYXBJdGVtLmNvbG9yIDogdGhpcy5ub0RhdGFDb2xvcjtcclxuICAgICAgICBpdGVtLm9ubW91c2VlbnRlciA9IHRoaXMuY291bnRyeUhvdmVyLmJpbmQodGhpcywgaXRlbSwgdHJ1ZSk7XHJcbiAgICAgICAgaXRlbS5vbm1vdXNlbGVhdmUgPSB0aGlzLmNvdW50cnlIb3Zlci5iaW5kKHRoaXMsIGl0ZW0sIGZhbHNlKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLmlubmVyTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmNkUmVmLmRldGVjdENoYW5nZXMoKTtcclxuICAgICAgdGhpcy5vbkNoYXJ0UmVhZHkoKTtcclxuXHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIHRoaXMub25DaGFydGVycm9yKHsgaWQ6IENoYXJFcnJvckNvZGUubG9hZGluZywgbWVzc2FnZTogJ0NvdWxkIG5vdCBsb2FkJyB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY291bnRyeUhvdmVyKGl0ZW06IFNWR0VsZW1lbnQsIGhvdmVyZWQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIGl0ZW0uc3R5bGUuc3Ryb2tlV2lkdGggPSBnZXRTdHJva2VXaWR0aChob3ZlcmVkKTtcclxuICAgIGl0ZW0uc3R5bGUuc3Ryb2tlID0gZ2V0U3Ryb2tlQ29sb3IoaG92ZXJlZCk7XHJcbiAgICBpdGVtLnF1ZXJ5U2VsZWN0b3JBbGw8U1ZHRWxlbWVudD4oJy5sYW5keHgnKS5mb3JFYWNoKGkgPT4ge1xyXG4gICAgICBpLnN0eWxlLnN0cm9rZVdpZHRoID0gZ2V0U3Ryb2tlV2lkdGgoaG92ZXJlZCk7XHJcbiAgICAgIGkuc3R5bGUuc3Ryb2tlID0gZ2V0U3Ryb2tlQ29sb3IoaG92ZXJlZCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25DaGFydFJlYWR5KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuaW5uZXJMb2FkaW5nKSB7XHJcbiAgICAgIHRoaXMuaW5uZXJMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuY2hhcnRSZWFkeS5lbWl0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9uQ2hhcnRlcnJvcihlcnJvcjogQ2hhcnRFcnJvckV2ZW50KTogdm9pZCB7XHJcbiAgICB0aGlzLmNoYXJ0RXJyb3IuZW1pdChlcnJvcik7XHJcbiAgfVxyXG5cclxuICBvbk1hcFNlbGVjdCh7IHRhcmdldCB9OiB7IHRhcmdldD86IFNWR0VsZW1lbnQgfSk6IHZvaWQge1xyXG4gICAgY29uc3QgZXZlbnQ6IENoYXJ0U2VsZWN0RXZlbnQgPSB7XHJcbiAgICAgIHNlbGVjdGVkOiBmYWxzZSxcclxuICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgIGNvdW50cnk6IG51bGxcclxuICAgIH07XHJcblxyXG4gICAgbGV0IG5ld0l0ZW06IFNWR0VsZW1lbnQ7XHJcbiAgICBpZiAodGFyZ2V0LmlkID09PSBvY2VhbklkKSB7XHJcbiAgICAgIHRoaXMuc2VsZWN0Q291bnRyeShudWxsKTtcclxuXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXdJdGVtID0gdGFyZ2V0O1xyXG4gICAgICB3aGlsZSAoIW5ld0l0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKGNvdW50cnlDbGFzcykpIHtcclxuICAgICAgICBuZXdJdGVtID0gbmV3SXRlbS5wYXJlbnROb2RlIGFzIFNWR0VsZW1lbnQ7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb3VudHJ5ID0gdGhpcy5tYXBEYXRhW25ld0l0ZW0/LmlkXTtcclxuICAgIGlmIChjb3VudHJ5KSB7XHJcbiAgICAgIGV2ZW50LnNlbGVjdGVkID0gdHJ1ZTtcclxuICAgICAgZXZlbnQudmFsdWUgPSBjb3VudHJ5TnVtKGNvdW50cnkpO1xyXG4gICAgICBldmVudC5jb3VudHJ5ID0gbmV3SXRlbS5pZC50b1VwcGVyQ2FzZSgpO1xyXG4gICAgICB0aGlzLnNlbGVjdENvdW50cnkoZXZlbnQuY291bnRyeSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNlbGVjdENvdW50cnkobnVsbCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmNoYXJ0U2VsZWN0LmVtaXQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbn1cclxuIl19