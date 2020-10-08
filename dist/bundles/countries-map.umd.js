(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@jagomf/countrieslist')) :
    typeof define === 'function' && define.amd ? define('countries-map', ['exports', '@angular/core', '@angular/common', '@jagomf/countrieslist'], factory) :
    (global = global || self, factory(global['countries-map'] = {}, global.ng.core, global.ng.common, global.countrieslist));
}(this, (function (exports, core, common, countrieslist) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    var GoogleChartsLoaderService = /** @class */ (function () {
        function GoogleChartsLoaderService(localeId) {
            this.googleScriptLoadingNotifier = new core.EventEmitter();
            this.googleScriptIsLoading = false;
            this.localeId = localeId;
        }
        GoogleChartsLoaderService.prototype.load = function (apiKey) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.loadGoogleChartsScript().then(function () {
                    var initializer = {
                        packages: ['geochart'],
                        language: _this.localeId,
                        callback: resolve
                    };
                    if (apiKey) {
                        initializer.mapsApiKey = apiKey;
                    }
                    google.charts.load('45.2', initializer);
                }).catch(function (err) { return reject(); });
            });
        };
        GoogleChartsLoaderService.prototype.loadGoogleChartsScript = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                if (typeof google !== 'undefined' && google.charts) {
                    resolve();
                }
                else if (!_this.googleScriptIsLoading) {
                    _this.googleScriptIsLoading = true;
                    var script = document.createElement('script');
                    script.type = 'text/javascript';
                    script.src = 'https://www.gstatic.com/charts/loader.js';
                    script.async = true;
                    script.defer = true;
                    script.onload = function () {
                        _this.googleScriptIsLoading = false;
                        _this.googleScriptLoadingNotifier.emit(true);
                        resolve();
                    };
                    script.onerror = function () {
                        _this.googleScriptIsLoading = false;
                        _this.googleScriptLoadingNotifier.emit(false);
                        reject();
                    };
                    document.getElementsByTagName('head')[0].appendChild(script);
                }
                else {
                    _this.googleScriptLoadingNotifier.subscribe(function (loaded) {
                        if (loaded) {
                            resolve();
                        }
                        else {
                            reject();
                        }
                    });
                }
            });
        };
        GoogleChartsLoaderService.ctorParameters = function () { return [
            { type: String, decorators: [{ type: core.Inject, args: [core.LOCALE_ID,] }] }
        ]; };
        GoogleChartsLoaderService = __decorate([
            core.Injectable(),
            __param(0, core.Inject(core.LOCALE_ID))
        ], GoogleChartsLoaderService);
        return GoogleChartsLoaderService;
    }());


    (function (CharErrorCode) {
        CharErrorCode["loading"] = "loading";
    })(exports.CharErrorCode || (exports.CharErrorCode = {}));

    var valueHolder = 'value';
    var countryName = function (countryCode) {
        return countrieslist.en[countryCode];
    };
    var ɵ0 = countryName;
    var CountriesMapComponent = /** @class */ (function () {
        function CountriesMapComponent(cdRef, el, loaderService) {
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
            this.chartReady = new core.EventEmitter();
            this.chartError = new core.EventEmitter();
            this.chartSelect = new core.EventEmitter();
            this.selection = null;
            this.innerLoading = true;
            this.el = el;
            this.loaderService = loaderService;
        }
        Object.defineProperty(CountriesMapComponent.prototype, "loading", {
            get: function () {
                return this.innerLoading;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CountriesMapComponent.prototype, "selectionValue", {
            get: function () {
                return this.data[this.selection.countryId].value;
            },
            enumerable: true,
            configurable: true
        });
        CountriesMapComponent.prototype.screenSizeChanged = function () {
            if (!this.loading && this.autoResize) {
                var map = this.mapContent.nativeElement;
                map.style.setProperty('height', map.clientWidth * this.proportion + "px");
                this.redraw();
            }
        };
        CountriesMapComponent.prototype.getExtraSelected = function (country) {
            var extra = this.data[country].extra;
            return extra && Object.keys(extra).map(function (key) { return ({ key: key, val: extra[key] }); });
        };
        CountriesMapComponent.prototype.selectCountry = function (country) {
            this.selection = country ? {
                countryId: country,
                countryName: countryName(country),
                extra: this.getExtraSelected(country)
            } : null;
            this.cdRef.detectChanges();
        };
        /**
         * Convert a table (object) formatted as
         * `{ GB: { value:123, ...otherdata }, ES: { value:456, ...whatever } }`
         * to an array for Google Charts formatted as
         * `[ ['Country', 'Value'], ['GB', 123], ['ES', 456] ]`
         * and save to this.processedData
         */
        CountriesMapComponent.prototype.processInputData = function () {
            this.googleData = Object.entries(this.data).reduce(function (acc, _a) {
                var _b = __read(_a, 2), key = _b[0], val = _b[1];
                var rawValContent = val[valueHolder];
                acc.push([key, rawValContent === null ? null : rawValContent ? +rawValContent.toString() : 0]);
                return acc;
            }, [['Country', 'Value']]);
        };
        CountriesMapComponent.prototype.ngOnChanges = function (_a) {
            var _this = this;
            var data = _a.data;
            if (data) {
                if (!this.data) {
                    return;
                }
                var defaultOptions_1 = {
                    colorAxis: {
                        colors: [this.minColor, this.maxColor],
                        minValue: Number.isInteger(this.minValue) ? this.minValue : undefined,
                        maxValue: Number.isInteger(this.maxValue) ? this.maxValue : undefined
                    },
                    datalessRegionColor: this.noDataColor,
                    backgroundColor: this.backgroundColor,
                    defaultColor: this.exceptionColor,
                    legend: this.showCaption,
                    tooltip: { trigger: 'none' }
                };
                this.loaderService.load(this.apiKey).then(function () {
                    _this.processInputData();
                    _this.wrapper = new google.visualization.ChartWrapper({
                        chartType: 'GeoChart',
                        dataTable: _this.googleData,
                        options: Object.assign(defaultOptions_1, _this.options)
                    });
                    _this.registerChartWrapperEvents();
                    _this.redraw();
                    var self = _this.el.nativeElement;
                    _this.proportion = self.clientHeight / self.clientWidth;
                }, function () {
                    _this.onCharterror({ id: exports.CharErrorCode.loading, message: 'Could not load' });
                });
            }
        };
        CountriesMapComponent.prototype.redraw = function () {
            this.wrapper.draw(this.el.nativeElement.querySelector('div.cm-map-content'));
        };
        CountriesMapComponent.prototype.onChartReady = function () {
            this.innerLoading = false;
            this.chartReady.emit();
        };
        CountriesMapComponent.prototype.onCharterror = function (error) {
            this.chartError.emit(error);
        };
        CountriesMapComponent.prototype.onMapSelect = function () {
            var event = {
                selected: false,
                value: null,
                country: null
            };
            var selection = this.wrapper.visualization.getSelection();
            if (selection.length > 0) {
                var tableRow = selection[0].row;
                var dataTable = this.wrapper.getDataTable();
                event.selected = true;
                event.value = dataTable.getValue(tableRow, 1);
                event.country = dataTable.getValue(tableRow, 0);
                this.selectCountry(event.country);
            }
            else {
                this.selectCountry(null);
            }
            this.chartSelect.emit(event);
        };
        CountriesMapComponent.prototype.registerChartWrapperEvents = function () {
            var addListener = google.visualization.events.addListener;
            addListener(this.wrapper, 'ready', this.onChartReady.bind(this));
            addListener(this.wrapper, 'error', this.onCharterror.bind(this));
            addListener(this.wrapper, 'select', this.onMapSelect.bind(this));
        };
        CountriesMapComponent.prototype.ngOnDestroy = function () {
            var removeListener = google.visualization.events.removeListener;
            removeListener('ready');
            removeListener('error');
            removeListener('select');
        };
        CountriesMapComponent.ctorParameters = function () { return [
            { type: core.ChangeDetectorRef },
            { type: core.ElementRef },
            { type: GoogleChartsLoaderService }
        ]; };
        __decorate([
            core.Input()
        ], CountriesMapComponent.prototype, "data", void 0);
        __decorate([
            core.Input()
        ], CountriesMapComponent.prototype, "apiKey", void 0);
        __decorate([
            core.Input()
        ], CountriesMapComponent.prototype, "options", void 0);
        __decorate([
            core.Input()
        ], CountriesMapComponent.prototype, "countryLabel", void 0);
        __decorate([
            core.Input()
        ], CountriesMapComponent.prototype, "valueLabel", void 0);
        __decorate([
            core.Input()
        ], CountriesMapComponent.prototype, "showCaption", void 0);
        __decorate([
            core.Input()
        ], CountriesMapComponent.prototype, "captionBelow", void 0);
        __decorate([
            core.Input()
        ], CountriesMapComponent.prototype, "autoResize", void 0);
        __decorate([
            core.Input()
        ], CountriesMapComponent.prototype, "minValue", void 0);
        __decorate([
            core.Input()
        ], CountriesMapComponent.prototype, "maxValue", void 0);
        __decorate([
            core.Input()
        ], CountriesMapComponent.prototype, "minColor", void 0);
        __decorate([
            core.Input()
        ], CountriesMapComponent.prototype, "maxColor", void 0);
        __decorate([
            core.Input()
        ], CountriesMapComponent.prototype, "backgroundColor", void 0);
        __decorate([
            core.Input()
        ], CountriesMapComponent.prototype, "noDataColor", void 0);
        __decorate([
            core.Input()
        ], CountriesMapComponent.prototype, "exceptionColor", void 0);
        __decorate([
            core.Output()
        ], CountriesMapComponent.prototype, "chartReady", void 0);
        __decorate([
            core.Output()
        ], CountriesMapComponent.prototype, "chartError", void 0);
        __decorate([
            core.Output()
        ], CountriesMapComponent.prototype, "chartSelect", void 0);
        __decorate([
            core.ViewChild('mapContent', { static: false })
        ], CountriesMapComponent.prototype, "mapContent", void 0);
        __decorate([
            core.HostListener('window:deviceorientation'),
            core.HostListener('window:resize')
        ], CountriesMapComponent.prototype, "screenSizeChanged", null);
        CountriesMapComponent = __decorate([
            core.Component({
                selector: 'countries-map',
                changeDetection: core.ChangeDetectionStrategy.OnPush,
                template: "<div class=\"major-block loading\" *ngIf=\"loading\"><span class=\"text\">Loading map...</span></div>\r\n\r\n<div class=\"major-block cm-map-content\" #mapContent [ngClass]=\"{'goes-first': captionBelow}\"></div>\r\n\r\n<div class=\"major-block cm-caption-container\" [ngClass]=\"{'goes-first': !captionBelow}\"\r\n  *ngIf=\"!loading && showCaption\">\r\n  <div class=\"cm-simple-caption\">\r\n    <div class=\"cm-country-label\">\r\n      <span class=\"cm-default-label\" *ngIf=\"!selection\">{{countryLabel}}</span>\r\n      <span class=\"cm-country-name\" *ngIf=\"selection\">{{selection?.countryName}}</span>\r\n    </div>\r\n    <div class=\"cm-value-label\">\r\n      <span class=\"cm-value-text\"\r\n        [ngClass]=\"{'has-value': selection}\">{{valueLabel}}<span *ngIf=\"selection\">: </span></span>\r\n      <span class=\"cm-value-content\" *ngIf=\"selection\">{{selectionValue}}</span>\r\n    </div>\r\n  </div>\r\n  <div class=\"cm-extended-caption\" *ngIf=\"selection?.extra && selection?.extra.length > 0\">\r\n    <div *ngFor=\"let item of selection?.extra\" class=\"cm-extended-item\">\r\n      <span class=\"cm-extended-label\">{{item.key}}</span>:\r\n      <span class=\"cm-extended-value\">{{item.val}}</span>\r\n    </div>\r\n  </div>\r\n</div>\r\n",
                styles: [":host{display:flex;flex-flow:column nowrap;justify-content:space-between;align-items:stretch;align-content:stretch}.major-block.loading{flex:0 1 auto;align-self:center}.loading .text{font-style:italic;font-family:sans-serif;color:gray}.major-block.cm-map-content{flex:0 1 auto}.major-block.goes-first{order:0}.major-block:not(.goes-first){order:1}.major-block.cm-caption-container{flex:0 1 auto;display:flex;flex-flow:column nowrap;justify-content:space-between}.cm-simple-caption{display:flex;flex-flow:row nowrap;justify-content:space-between}.cm-country-label{flex:0 1 auto;align-self:flex-start}.cm-value-label{flex:0 1 auto;align-self:flex-end}.cm-country-label,.cm-value-label{flex:0 1 auto}.cm-country-label .cm-country-name{font-weight:700}.cm-country-label .cm-country-name,.cm-value-label .cm-value-text{color:#333}.cm-country-label .cm-default-label,.cm-value-label .cm-value-text:not(.has-value){font-style:italic;color:#777}.cm-extended-caption{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));grid-gap:5px}.cm-extended-item{margin:5px auto}.cm-extended-item .cm-extended-label{font-weight:700}"]
            })
        ], CountriesMapComponent);
        return CountriesMapComponent;
    }());

    var CountriesMapModule = /** @class */ (function () {
        function CountriesMapModule() {
        }
        CountriesMapModule = __decorate([
            core.NgModule({
                imports: [
                    common.CommonModule
                ],
                declarations: [CountriesMapComponent],
                entryComponents: [CountriesMapComponent],
                providers: [GoogleChartsLoaderService],
                exports: [
                    CountriesMapComponent
                ]
            })
        ], CountriesMapModule);
        return CountriesMapModule;
    }());

    exports.CountriesMapComponent = CountriesMapComponent;
    exports.CountriesMapModule = CountriesMapModule;
    exports.ɵa = GoogleChartsLoaderService;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=countries-map.umd.js.map
