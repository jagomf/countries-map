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
                styles: [":host{display:flex;flex-flow:column nowrap;justify-content:space-between;align-items:stretch;align-content:stretch}.major-block.loading{flex:0 1 auto;align-self:center}.major-block.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{flex:0 1 auto;display:flex;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{flex:0 1 auto;align-self:flex-start}.cm-value-label{flex:0 1 auto;align-self:flex-end}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:bold}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:bold}\n"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9saWIvc3JjL2xpYi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUNOLFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFlBQVksRUFJYixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFJekQsT0FBTyxFQUFFLEVBQUUsSUFBSSxXQUFXLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBRWxDLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksS0FBSyxJQUFJLENBQUM7O0FBQ3BFLE1BQU0sVUFBVSxHQUFHLENBQUMsSUFBaUIsRUFBRSxFQUFFLFdBQUMsT0FBQSxRQUFRLENBQUMsTUFBQSxJQUFJLENBQUMsS0FBSywwQ0FBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBLEVBQUEsQ0FBQzs7QUFFM0UsTUFBTSxZQUFZLEdBQUcsV0FBVyxDQUFDO0FBQ2pDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN4QixNQUFNLGNBQWMsR0FBRyxDQUFDLFNBQWtCLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7O0FBQzNFLE1BQU0sY0FBYyxHQUFHLENBQUMsU0FBa0IsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQzs7QUFFOUUsTUFBTSxXQUFXLEdBQUcs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QUFPLENBQUMsQ0FBQztZQUNsQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbkM7YUFBTTtZQUNMLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUI7UUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQixDQUFDOzs7WUFsTEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxlQUFlO2dCQUN6QixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0Msa3hDQUE2Qzs7YUFFOUM7OztZQTlCQyxpQkFBaUI7OzttQkFpQ2hCLEtBQUs7MkJBQ0wsS0FBSzt5QkFDTCxLQUFLOzBCQUNMLEtBQUs7MkJBQ0wsS0FBSzt1QkFDTCxLQUFLO3VCQUNMLEtBQUs7dUJBQ0wsS0FBSzt1QkFDTCxLQUFLOzhCQUNMLEtBQUs7MEJBQ0wsS0FBSzs2QkFDTCxLQUFLO3lCQUVMLE1BQU07eUJBQ04sTUFBTTswQkFDTixNQUFNO3lCQUVOLFNBQVMsU0FBQyxZQUFZLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEFmdGVyVmlld0luaXQsXG4gIE9uQ2hhbmdlcyxcbiAgU2ltcGxlQ2hhbmdlc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENoYXJFcnJvckNvZGUgfSBmcm9tICcuL2NoYXJ0LWV2ZW50cy5pbnRlcmZhY2UnO1xuaW1wb3J0IHR5cGUgeyBDaGFydFNlbGVjdEV2ZW50LCBDaGFydEVycm9yRXZlbnQgfSBmcm9tICcuL2NoYXJ0LWV2ZW50cy5pbnRlcmZhY2UnO1xuaW1wb3J0IHR5cGUgeyBDb3VudHJpZXNEYXRhLCBTZWxlY3Rpb25FeHRyYSwgRHJhd2FibGVDb3VudHJpZXMsIFNlbGVjdGlvbixcbiAgVmFsaWRFeHRyYURhdGEsIERyYXdhYmxlQ291bnRyeSwgQ291bnRyeURhdGEgfSBmcm9tICcuL2RhdGEtdHlwZXMuaW50ZXJmYWNlJztcbmltcG9ydCB7IGVuIGFzIGNvdW50cmllc0VOIH0gZnJvbSAnQGphZ29tZi9jb3VudHJpZXNsaXN0JztcbmltcG9ydCB7IHNjYWxlIH0gZnJvbSAnY2hyb21hLWpzJztcblxuY29uc3QgZXhpc3RzID0gaXRlbSA9PiB0eXBlb2YgaXRlbSAhPT0gJ3VuZGVmaW5lZCcgJiYgaXRlbSAhPT0gbnVsbDtcbmNvbnN0IGNvdW50cnlOdW0gPSAoaXRlbTogQ291bnRyeURhdGEpID0+IHBhcnNlSW50KGl0ZW0udmFsdWU/LnRvU3RyaW5nKCkpO1xuXG5jb25zdCBjb3VudHJ5Q2xhc3MgPSAnY291bnRyeXh4JztcbmNvbnN0IG9jZWFuSWQgPSAnb2NlYW4nO1xuY29uc3QgZ2V0U3Ryb2tlV2lkdGggPSAoaXNIb3ZlcmVkOiBib29sZWFuKSA9PiBpc0hvdmVyZWQgPyAnMC4yJScgOiAnMC4xJSc7XG5jb25zdCBnZXRTdHJva2VDb2xvciA9IChpc0hvdmVyZWQ6IGJvb2xlYW4pID0+IGlzSG92ZXJlZCA/ICcjODg4JyA6ICcjYWZhZmFmJztcblxuY29uc3QgY291bnRyeU5hbWUgPSAoY291bnRyeUNvZGU6IHN0cmluZyk6IHN0cmluZyA9PiB7XG4gIHJldHVybiBjb3VudHJpZXNFTltjb3VudHJ5Q29kZV07XG59O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjb3VudHJpZXMtbWFwJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlVXJsOiAnLi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vY291bnRyaWVzLW1hcC5jb21wb25lbnQuc2NzcyddXG59KVxuZXhwb3J0IGNsYXNzIENvdW50cmllc01hcENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uQ2hhbmdlcyB7XG5cbiAgQElucHV0KCkgZGF0YTogQ291bnRyaWVzRGF0YTtcbiAgQElucHV0KCkgY291bnRyeUxhYmVsID0gJ0NvdW50cnknO1xuICBASW5wdXQoKSB2YWx1ZUxhYmVsID0gJ1ZhbHVlJztcbiAgQElucHV0KCkgc2hvd0NhcHRpb24gPSB0cnVlO1xuICBASW5wdXQoKSBjYXB0aW9uQmVsb3cgPSB0cnVlO1xuICBASW5wdXQoKSBtaW5WYWx1ZTogbnVtYmVyO1xuICBASW5wdXQoKSBtYXhWYWx1ZTogbnVtYmVyO1xuICBASW5wdXQoKSBtaW5Db2xvciA9ICd3aGl0ZSc7XG4gIEBJbnB1dCgpIG1heENvbG9yID0gJ3JlZCc7XG4gIEBJbnB1dCgpIGJhY2tncm91bmRDb2xvciA9ICd3aGl0ZSc7XG4gIEBJbnB1dCgpIG5vRGF0YUNvbG9yID0gJyNDRkNGQ0YnO1xuICBASW5wdXQoKSBleGNlcHRpb25Db2xvciA9ICcjRkZFRTU4JztcblxuICBAT3V0cHV0KCkgcHJpdmF0ZSByZWFkb25seSBjaGFydFJlYWR5ID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICBAT3V0cHV0KCkgcHJpdmF0ZSByZWFkb25seSBjaGFydEVycm9yID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydEVycm9yRXZlbnQ+KCk7XG4gIEBPdXRwdXQoKSBwcml2YXRlIHJlYWRvbmx5IGNoYXJ0U2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydFNlbGVjdEV2ZW50PigpO1xuXG4gIEBWaWV3Q2hpbGQoJ21hcENvbnRlbnQnLCB7IHN0YXRpYzogZmFsc2UsIHJlYWQ6IEVsZW1lbnRSZWYgfSkgcHJpdmF0ZSByZWFkb25seSBtYXBDb250ZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcblxuICBtYXBEYXRhOiBEcmF3YWJsZUNvdW50cmllcztcbiAgc2VsZWN0aW9uOiBTZWxlY3Rpb24gfCBudWxsID0gbnVsbDtcblxuICBwcml2YXRlIGlubmVyTG9hZGluZyA9IHRydWU7XG4gIGdldCBsb2FkaW5nKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlubmVyTG9hZGluZztcbiAgfVxuXG4gIGdldCBzZWxlY3Rpb25WYWx1ZSgpOiBWYWxpZEV4dHJhRGF0YSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVt0aGlzLnNlbGVjdGlvbi5jb3VudHJ5SWRdLnZhbHVlO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSByZWFkb25seSBjZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICkgeyB9XG5cbiAgcHJpdmF0ZSBnZXRFeHRyYVNlbGVjdGVkKGNvdW50cnk6IHN0cmluZyk6IFNlbGVjdGlvbkV4dHJhW10gfCBudWxsIHtcbiAgICBjb25zdCB7IGV4dHJhIH0gPSB0aGlzLmRhdGFbY291bnRyeV07XG4gICAgcmV0dXJuIGV4dHJhICYmIE9iamVjdC5rZXlzKGV4dHJhKS5tYXAoa2V5ID0+ICh7IGtleSwgdmFsOiBleHRyYVtrZXldIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgc2VsZWN0Q291bnRyeShjb3VudHJ5Pzogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zZWxlY3Rpb24gPSBjb3VudHJ5ID8ge1xuICAgICAgY291bnRyeUlkOiBjb3VudHJ5LFxuICAgICAgY291bnRyeU5hbWU6IGNvdW50cnlOYW1lKGNvdW50cnkpLFxuICAgICAgZXh0cmE6IHRoaXMuZ2V0RXh0cmFTZWxlY3RlZChjb3VudHJ5KVxuICAgIH0gOiBudWxsO1xuICAgIHRoaXMuY2RSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuaW5pdGlhbGl6ZU1hcCgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGNvbnN0IGNoYW5nZWRNYXBWYWx1ZUJ1dE5vdE9uU3RhcnQgPSBbJ2RhdGEnLCAnbWluQ29sb3InLCAnbWF4Q29sb3InLCAnYmFja2dyb3VuZENvbG9yJywgJ25vRGF0YUNvbG9yJywgJ2V4Y2VwdGlvbkNvbG9yJ11cbiAgICAgIC5zb21lKGF0dHIgPT4gY2hhbmdlc1thdHRyXSAmJiAhY2hhbmdlc1thdHRyXS5maXJzdENoYW5nZSk7XG5cbiAgICBpZiAoY2hhbmdlZE1hcFZhbHVlQnV0Tm90T25TdGFydCkge1xuICAgICAgdGhpcy5pbml0aWFsaXplTWFwKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplTWFwKCk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICAvLyBkYXRhIGlzIHByb3ZpZGVkOiBtaWdodCBiZSBhYmxlIHRvIHBhaW50IGNvdW50cmllcyBpbiBjb2xvcnNcbiAgICAgIGlmICh0aGlzLmRhdGEpIHtcbiAgICAgICAgLy8gZ2V0IGhpZ2hlc3QgdmFsdWUgaW4gcmFuZ2VcbiAgICAgICAgY29uc3QgbWF4VmFsID0gZXhpc3RzKHRoaXMubWF4VmFsdWUpID8gdGhpcy5tYXhWYWx1ZSA6IE9iamVjdC52YWx1ZXModGhpcy5kYXRhKS5yZWR1Y2UoXG4gICAgICAgICAgKGFjYywgY3VycikgPT4gY291bnRyeU51bShjdXJyKSA+IGFjYyB8fCBhY2MgPT09IG51bGw/IGNvdW50cnlOdW0oY3VycikgOiBhY2MsIG51bGwgYXMgbnVtYmVyXG4gICAgICAgICk7XG4gICAgICAgIC8vIGdldCBsb3dlc3QgdmFsdWUgaW4gcmFuZ2VcbiAgICAgICAgY29uc3QgbWluVmFsID0gZXhpc3RzKHRoaXMubWluVmFsdWUpID8gdGhpcy5taW5WYWx1ZSA6IE9iamVjdC52YWx1ZXModGhpcy5kYXRhKS5yZWR1Y2UoXG4gICAgICAgICAgKGFjYywgY3VycikgPT4gY291bnRyeU51bShjdXJyKSA8IGFjYyB8fCBhY2MgPT09IG51bGw/IGNvdW50cnlOdW0oY3VycikgOiBhY2MsIG51bGwgYXMgbnVtYmVyXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gbWFwIHZhbHVlcyBpbiByYW5nZSB0byBjb2xvcnNcbiAgICAgICAgY29uc3QgdmFsVG9Db2wgPSBzY2FsZShbdGhpcy5taW5Db2xvciwgdGhpcy5tYXhDb2xvcl0pLmNvbG9ycygobWF4VmFsID8/IDEpIC0gKG1pblZhbCA/PyAwKSArIDEpLnJlZHVjZSgoYWNjLCBjdXJyLCBpKSA9PlxuICAgICAgICAgICh7IC4uLmFjYywgW2kgKyBtaW5WYWxdOiBjdXJyIH0pLCB7fSBhcyB7IFtrZXk6IG51bWJlcl06IHN0cmluZyB9XG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gY3JlYXRlIGxvY2FsIE1hcCB1c2luZyBwcm92aWRlZCBkYXRhICsgY2FsY3VsYXRlZCBjb2xvcnNcbiAgICAgICAgdGhpcy5tYXBEYXRhID0gT2JqZWN0LmVudHJpZXModGhpcy5kYXRhKS5yZWR1Y2UoKGFjYywgWyBjb3VudHJ5SWQsIGNvdW50cnlWYWwgXSkgPT5cbiAgICAgICAgICAoeyAuLi5hY2MsXG4gICAgICAgICAgICBbY291bnRyeUlkLnRvTG93ZXJDYXNlKCldOiB7XG4gICAgICAgICAgICAgIC4uLmNvdW50cnlWYWwsXG4gICAgICAgICAgICAgIGNvbG9yOiB2YWxUb0NvbFtjb3VudHJ5TnVtKGNvdW50cnlWYWwpXSAvLyB2YWx1ZSBpbiBiZXR3ZWVuIG1pblZhbCBhbmQgbWF4VmFsXG4gICAgICAgICAgICAgICAgfHwgKFxuICAgICAgICAgICAgICAgICAgLy8gdmFsdWUgYmVsb3cgbWluVmFsXG4gICAgICAgICAgICAgICAgICBjb3VudHJ5TnVtKGNvdW50cnlWYWwpIDw9IG1pblZhbCA/IHZhbFRvQ29sW21pblZhbF0gOlxuICAgICAgICAgICAgICAgICAgLy8gdmFsdWUgYWJvdmUgbWF4VmFsXG4gICAgICAgICAgICAgICAgICBjb3VudHJ5TnVtKGNvdW50cnlWYWwpID49IG1heFZhbCA/IHZhbFRvQ29sW21heFZhbF1cbiAgICAgICAgICAgICAgICAgIC8vIHdlaXJkOyBzaG91bGQgbmV2ZXIgZ2V0IHRvIGhlcmVcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLmV4Y2VwdGlvbkNvbG9yXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSBhcyBEcmF3YWJsZUNvdW50cnkgfSksXG4gICAgICAgICAge30gYXMgRHJhd2FibGVDb3VudHJpZXNcbiAgICAgICAgKTtcblxuICAgICAgLy8gbm8gZGF0YSBwcm92aWRlZDogd2lsbCBwYWludCBwbGFpbiBtYXBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubWFwRGF0YSA9IHt9O1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzdmdNYXAgPSB0aGlzLm1hcENvbnRlbnQubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXSBhcyBTVkdTVkdFbGVtZW50O1xuICAgICAgc3ZnTWFwLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuYmFja2dyb3VuZENvbG9yO1xuICAgICAgc3ZnTWFwLnF1ZXJ5U2VsZWN0b3JBbGw8U1ZHU1ZHRWxlbWVudD4oYC4ke2NvdW50cnlDbGFzc31gKS5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICBjb25zdCBtYXBJdGVtID0gdGhpcy5tYXBEYXRhW2l0ZW0uaWQudG9Mb3dlckNhc2UoKV07XG4gICAgICAgIGNvbnN0IGlzRXhjZXB0aW9uID0gbWFwSXRlbSA/ICFleGlzdHMobWFwSXRlbS52YWx1ZSkgOiBmYWxzZTtcbiAgICAgICAgaXRlbS5zdHlsZS5maWxsID0gbWFwSXRlbSA/IGlzRXhjZXB0aW9uID8gdGhpcy5leGNlcHRpb25Db2xvciA6IG1hcEl0ZW0uY29sb3IgOiB0aGlzLm5vRGF0YUNvbG9yO1xuICAgICAgICBpdGVtLm9ubW91c2VlbnRlciA9IHRoaXMuY291bnRyeUhvdmVyLmJpbmQodGhpcywgaXRlbSwgdHJ1ZSk7XG4gICAgICAgIGl0ZW0ub25tb3VzZWxlYXZlID0gdGhpcy5jb3VudHJ5SG92ZXIuYmluZCh0aGlzLCBpdGVtLCBmYWxzZSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5pbm5lckxvYWRpbmcgPSBmYWxzZTtcbiAgICAgIHRoaXMuY2RSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgdGhpcy5vbkNoYXJ0UmVhZHkoKTtcblxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRoaXMub25DaGFydGVycm9yKHsgaWQ6IENoYXJFcnJvckNvZGUubG9hZGluZywgbWVzc2FnZTogJ0NvdWxkIG5vdCBsb2FkJyB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNvdW50cnlIb3ZlcihpdGVtOiBTVkdFbGVtZW50LCBob3ZlcmVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgaXRlbS5zdHlsZS5zdHJva2VXaWR0aCA9IGdldFN0cm9rZVdpZHRoKGhvdmVyZWQpO1xuICAgIGl0ZW0uc3R5bGUuc3Ryb2tlID0gZ2V0U3Ryb2tlQ29sb3IoaG92ZXJlZCk7XG4gICAgaXRlbS5xdWVyeVNlbGVjdG9yQWxsPFNWR0VsZW1lbnQ+KCcubGFuZHh4JykuZm9yRWFjaChpID0+IHtcbiAgICAgIGkuc3R5bGUuc3Ryb2tlV2lkdGggPSBnZXRTdHJva2VXaWR0aChob3ZlcmVkKTtcbiAgICAgIGkuc3R5bGUuc3Ryb2tlID0gZ2V0U3Ryb2tlQ29sb3IoaG92ZXJlZCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG9uQ2hhcnRSZWFkeSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pbm5lckxvYWRpbmcpIHtcbiAgICAgIHRoaXMuaW5uZXJMb2FkaW5nID0gZmFsc2U7XG4gICAgICB0aGlzLmNoYXJ0UmVhZHkuZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25DaGFydGVycm9yKGVycm9yOiBDaGFydEVycm9yRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmNoYXJ0RXJyb3IuZW1pdChlcnJvcik7XG4gIH1cblxuICBvbk1hcFNlbGVjdCh7IHRhcmdldCB9OiB7IHRhcmdldD86IFNWR0VsZW1lbnQgfSk6IHZvaWQge1xuICAgIGNvbnN0IGV2ZW50OiBDaGFydFNlbGVjdEV2ZW50ID0ge1xuICAgICAgc2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgdmFsdWU6IG51bGwsXG4gICAgICBjb3VudHJ5OiBudWxsXG4gICAgfTtcblxuICAgIGxldCBuZXdJdGVtOiBTVkdFbGVtZW50O1xuICAgIGlmICh0YXJnZXQuaWQgPT09IG9jZWFuSWQpIHtcbiAgICAgIHRoaXMuc2VsZWN0Q291bnRyeShudWxsKTtcblxuICAgIH0gZWxzZSB7XG4gICAgICBuZXdJdGVtID0gdGFyZ2V0O1xuICAgICAgd2hpbGUgKCFuZXdJdGVtLmNsYXNzTGlzdC5jb250YWlucyhjb3VudHJ5Q2xhc3MpKSB7XG4gICAgICAgIG5ld0l0ZW0gPSBuZXdJdGVtLnBhcmVudE5vZGUgYXMgU1ZHRWxlbWVudDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjb3VudHJ5ID0gdGhpcy5tYXBEYXRhW25ld0l0ZW0/LmlkXTtcbiAgICBpZiAoY291bnRyeSkge1xuICAgICAgZXZlbnQuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgZXZlbnQudmFsdWUgPSBjb3VudHJ5TnVtKGNvdW50cnkpO1xuICAgICAgZXZlbnQuY291bnRyeSA9IG5ld0l0ZW0uaWQudG9VcHBlckNhc2UoKTtcbiAgICAgIHRoaXMuc2VsZWN0Q291bnRyeShldmVudC5jb3VudHJ5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RDb3VudHJ5KG51bGwpO1xuICAgIH1cbiAgICB0aGlzLmNoYXJ0U2VsZWN0LmVtaXQoZXZlbnQpO1xuICB9XG5cbn1cbiJdfQ==