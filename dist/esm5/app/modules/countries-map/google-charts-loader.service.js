import { __decorate, __param } from "tslib";
import { Injectable, EventEmitter, LOCALE_ID, Inject } from '@angular/core';
var GoogleChartsLoaderService = /** @class */ (function () {
    function GoogleChartsLoaderService(localeId) {
        this.googleScriptLoadingNotifier = new EventEmitter();
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
        { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] }
    ]; };
    GoogleChartsLoaderService = __decorate([
        Injectable(),
        __param(0, Inject(LOCALE_ID))
    ], GoogleChartsLoaderService);
    return GoogleChartsLoaderService;
}());
export { GoogleChartsLoaderService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWNoYXJ0cy1sb2FkZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2NvdW50cmllcy1tYXAvIiwic291cmNlcyI6WyJhcHAvbW9kdWxlcy9jb3VudHJpZXMtbWFwL2dvb2dsZS1jaGFydHMtbG9hZGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHNUU7SUFNRSxtQ0FBc0MsUUFBZ0I7UUFDcEQsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdEQsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztRQUNuQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBRU0sd0NBQUksR0FBWCxVQUFZLE1BQWU7UUFBM0IsaUJBZUM7UUFkQyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFFakMsS0FBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsSUFBSSxDQUFDO2dCQUNqQyxJQUFNLFdBQVcsR0FBUTtvQkFDckIsUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDO29CQUN0QixRQUFRLEVBQUUsS0FBSSxDQUFDLFFBQVE7b0JBQ3ZCLFFBQVEsRUFBRSxPQUFPO2lCQUNwQixDQUFDO2dCQUNGLElBQUksTUFBTSxFQUFFO29CQUNWLFdBQVcsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO2lCQUNqQztnQkFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDMUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsTUFBTSxFQUFFLEVBQVIsQ0FBUSxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sMERBQXNCLEdBQTlCO1FBQUEsaUJBcUNDO1FBcENDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUVqQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUNsRCxPQUFPLEVBQUUsQ0FBQzthQUNYO2lCQUFNLElBQUksQ0FBQyxLQUFJLENBQUMscUJBQXFCLEVBQUU7Z0JBRXRDLEtBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7Z0JBRWxDLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsMENBQTBDLENBQUM7Z0JBQ3hELE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUNwQixNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDcEIsTUFBTSxDQUFDLE1BQU0sR0FBRztvQkFDZCxLQUFJLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO29CQUNuQyxLQUFJLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM1QyxPQUFPLEVBQUUsQ0FBQztnQkFDWixDQUFDLENBQUM7Z0JBQ0YsTUFBTSxDQUFDLE9BQU8sR0FBRztvQkFDZixLQUFJLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO29CQUNuQyxLQUFJLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM3QyxNQUFNLEVBQUUsQ0FBQztnQkFDWCxDQUFDLENBQUM7Z0JBQ0YsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUU5RDtpQkFBTTtnQkFDTCxLQUFJLENBQUMsMkJBQTJCLENBQUMsU0FBUyxDQUFDLFVBQUMsTUFBZTtvQkFDekQsSUFBSSxNQUFNLEVBQUU7d0JBQ1YsT0FBTyxFQUFFLENBQUM7cUJBQ1g7eUJBQU07d0JBQ0wsTUFBTSxFQUFFLENBQUM7cUJBQ1Y7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7YUFDSjtRQUVILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7NkNBNURtQixNQUFNLFNBQUMsU0FBUzs7SUFOekIseUJBQXlCO1FBRHJDLFVBQVUsRUFBRTtRQU9TLFdBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO09BTjFCLHlCQUF5QixDQW1FckM7SUFBRCxnQ0FBQztDQUFBLEFBbkVELElBbUVDO1NBbkVZLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImRlY2xhcmUgdmFyIGdvb2dsZTogYW55O1xyXG5cclxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgRXZlbnRFbWl0dGVyLCBMT0NBTEVfSUQsIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgR29vZ2xlQ2hhcnRzTG9hZGVyU2VydmljZSB7XHJcblxyXG4gIHByaXZhdGUgZ29vZ2xlU2NyaXB0TG9hZGluZ05vdGlmaWVyOiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj47XHJcbiAgcHJpdmF0ZSBnb29nbGVTY3JpcHRJc0xvYWRpbmc6IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSBsb2NhbGVJZDogc3RyaW5nO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IoQEluamVjdChMT0NBTEVfSUQpIGxvY2FsZUlkOiBzdHJpbmcpIHtcclxuICAgIHRoaXMuZ29vZ2xlU2NyaXB0TG9hZGluZ05vdGlmaWVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgdGhpcy5nb29nbGVTY3JpcHRJc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMubG9jYWxlSWQgPSBsb2NhbGVJZDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBsb2FkKGFwaUtleT86IHN0cmluZyk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgdGhpcy5sb2FkR29vZ2xlQ2hhcnRzU2NyaXB0KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaW5pdGlhbGl6ZXI6IGFueSA9IHtcclxuICAgICAgICAgICAgcGFja2FnZXM6IFsnZ2VvY2hhcnQnXSxcclxuICAgICAgICAgICAgbGFuZ3VhZ2U6IHRoaXMubG9jYWxlSWQsXHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiByZXNvbHZlXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoYXBpS2V5KSB7XHJcbiAgICAgICAgICBpbml0aWFsaXplci5tYXBzQXBpS2V5ID0gYXBpS2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBnb29nbGUuY2hhcnRzLmxvYWQoJzQ1LjInLCBpbml0aWFsaXplcik7XHJcbiAgICAgIH0pLmNhdGNoKGVyciA9PiByZWplY3QoKSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbG9hZEdvb2dsZUNoYXJ0c1NjcmlwdCgpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgZ29vZ2xlICE9PSAndW5kZWZpbmVkJyAmJiBnb29nbGUuY2hhcnRzKSB7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLmdvb2dsZVNjcmlwdElzTG9hZGluZykge1xyXG5cclxuICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdElzTG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICAgICAgc2NyaXB0LnNyYyA9ICdodHRwczovL3d3dy5nc3RhdGljLmNvbS9jaGFydHMvbG9hZGVyLmpzJztcclxuICAgICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgIHNjcmlwdC5kZWZlciA9IHRydWU7XHJcbiAgICAgICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0SXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdExvYWRpbmdOb3RpZmllci5lbWl0KHRydWUpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgc2NyaXB0Lm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdElzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy5nb29nbGVTY3JpcHRMb2FkaW5nTm90aWZpZXIuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5nb29nbGVTY3JpcHRMb2FkaW5nTm90aWZpZXIuc3Vic2NyaWJlKChsb2FkZWQ6IGJvb2xlYW4pID0+IHtcclxuICAgICAgICAgIGlmIChsb2FkZWQpIHtcclxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVqZWN0KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19