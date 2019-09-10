import * as tslib_1 from "tslib";
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
    GoogleChartsLoaderService = tslib_1.__decorate([
        Injectable(),
        tslib_1.__param(0, Inject(LOCALE_ID)),
        tslib_1.__metadata("design:paramtypes", [String])
    ], GoogleChartsLoaderService);
    return GoogleChartsLoaderService;
}());
export { GoogleChartsLoaderService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWNoYXJ0cy1sb2FkZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2NvdW50cmllcy1tYXAvIiwic291cmNlcyI6WyJhcHAvbW9kdWxlcy9jb3VudHJpZXMtbWFwL2dvb2dsZS1jaGFydHMtbG9hZGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHNUU7SUFNRSxtQ0FBc0MsUUFBZ0I7UUFDcEQsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdEQsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztRQUNuQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBRU0sd0NBQUksR0FBWCxVQUFZLE1BQWU7UUFBM0IsaUJBZUM7UUFkQyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFFakMsS0FBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsSUFBSSxDQUFDO2dCQUNqQyxJQUFNLFdBQVcsR0FBUTtvQkFDckIsUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDO29CQUN0QixRQUFRLEVBQUUsS0FBSSxDQUFDLFFBQVE7b0JBQ3ZCLFFBQVEsRUFBRSxPQUFPO2lCQUNwQixDQUFDO2dCQUNGLElBQUksTUFBTSxFQUFFO29CQUNWLFdBQVcsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO2lCQUNqQztnQkFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDMUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsTUFBTSxFQUFFLEVBQVIsQ0FBUSxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sMERBQXNCLEdBQTlCO1FBQUEsaUJBcUNDO1FBcENDLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUVqQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUNsRCxPQUFPLEVBQUUsQ0FBQzthQUNYO2lCQUFNLElBQUksQ0FBQyxLQUFJLENBQUMscUJBQXFCLEVBQUU7Z0JBRXRDLEtBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7Z0JBRWxDLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsMENBQTBDLENBQUM7Z0JBQ3hELE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUNwQixNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDcEIsTUFBTSxDQUFDLE1BQU0sR0FBRztvQkFDZCxLQUFJLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO29CQUNuQyxLQUFJLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM1QyxPQUFPLEVBQUUsQ0FBQztnQkFDWixDQUFDLENBQUM7Z0JBQ0YsTUFBTSxDQUFDLE9BQU8sR0FBRztvQkFDZixLQUFJLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO29CQUNuQyxLQUFJLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM3QyxNQUFNLEVBQUUsQ0FBQztnQkFDWCxDQUFDLENBQUM7Z0JBQ0YsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUU5RDtpQkFBTTtnQkFDTCxLQUFJLENBQUMsMkJBQTJCLENBQUMsU0FBUyxDQUFDLFVBQUMsTUFBZTtvQkFDekQsSUFBSSxNQUFNLEVBQUU7d0JBQ1YsT0FBTyxFQUFFLENBQUM7cUJBQ1g7eUJBQU07d0JBQ0wsTUFBTSxFQUFFLENBQUM7cUJBQ1Y7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7YUFDSjtRQUVILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQWxFVSx5QkFBeUI7UUFEckMsVUFBVSxFQUFFO1FBT1MsbUJBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBOztPQU4xQix5QkFBeUIsQ0FtRXJDO0lBQUQsZ0NBQUM7Q0FBQSxBQW5FRCxJQW1FQztTQW5FWSx5QkFBeUIiLCJzb3VyY2VzQ29udGVudCI6WyJkZWNsYXJlIHZhciBnb29nbGU6IGFueTtcblxuaW1wb3J0IHsgSW5qZWN0YWJsZSwgRXZlbnRFbWl0dGVyLCBMT0NBTEVfSUQsIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgR29vZ2xlQ2hhcnRzTG9hZGVyU2VydmljZSB7XG5cbiAgcHJpdmF0ZSBnb29nbGVTY3JpcHRMb2FkaW5nTm90aWZpZXI6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcbiAgcHJpdmF0ZSBnb29nbGVTY3JpcHRJc0xvYWRpbmc6IGJvb2xlYW47XG4gIHByaXZhdGUgbG9jYWxlSWQ6IHN0cmluZztcblxuICBwdWJsaWMgY29uc3RydWN0b3IoQEluamVjdChMT0NBTEVfSUQpIGxvY2FsZUlkOiBzdHJpbmcpIHtcbiAgICB0aGlzLmdvb2dsZVNjcmlwdExvYWRpbmdOb3RpZmllciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICB0aGlzLmdvb2dsZVNjcmlwdElzTG9hZGluZyA9IGZhbHNlO1xuICAgIHRoaXMubG9jYWxlSWQgPSBsb2NhbGVJZDtcbiAgfVxuXG4gIHB1YmxpYyBsb2FkKGFwaUtleT86IHN0cmluZyk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgdGhpcy5sb2FkR29vZ2xlQ2hhcnRzU2NyaXB0KCkudGhlbigoKSA9PiB7XG4gICAgICAgIGNvbnN0IGluaXRpYWxpemVyOiBhbnkgPSB7XG4gICAgICAgICAgICBwYWNrYWdlczogWydnZW9jaGFydCddLFxuICAgICAgICAgICAgbGFuZ3VhZ2U6IHRoaXMubG9jYWxlSWQsXG4gICAgICAgICAgICBjYWxsYmFjazogcmVzb2x2ZVxuICAgICAgICB9O1xuICAgICAgICBpZiAoYXBpS2V5KSB7XG4gICAgICAgICAgaW5pdGlhbGl6ZXIubWFwc0FwaUtleSA9IGFwaUtleTtcbiAgICAgICAgfVxuICAgICAgICBnb29nbGUuY2hhcnRzLmxvYWQoJzQ1LjInLCBpbml0aWFsaXplcik7XG4gICAgICB9KS5jYXRjaChlcnIgPT4gcmVqZWN0KCkpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2FkR29vZ2xlQ2hhcnRzU2NyaXB0KCk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgaWYgKHR5cGVvZiBnb29nbGUgIT09ICd1bmRlZmluZWQnICYmIGdvb2dsZS5jaGFydHMpIHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSBlbHNlIGlmICghdGhpcy5nb29nbGVTY3JpcHRJc0xvYWRpbmcpIHtcblxuICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdElzTG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgICAgIHNjcmlwdC5zcmMgPSAnaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20vY2hhcnRzL2xvYWRlci5qcyc7XG4gICAgICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XG4gICAgICAgIHNjcmlwdC5kZWZlciA9IHRydWU7XG4gICAgICAgIHNjcmlwdC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5nb29nbGVTY3JpcHRJc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdExvYWRpbmdOb3RpZmllci5lbWl0KHRydWUpO1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgc2NyaXB0Lm9uZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5nb29nbGVTY3JpcHRJc0xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdExvYWRpbmdOb3RpZmllci5lbWl0KGZhbHNlKTtcbiAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgfTtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdExvYWRpbmdOb3RpZmllci5zdWJzY3JpYmUoKGxvYWRlZDogYm9vbGVhbikgPT4ge1xuICAgICAgICAgIGlmIChsb2FkZWQpIHtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgIH0pO1xuICB9XG59XG4iXX0=