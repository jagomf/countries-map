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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWNoYXJ0cy1sb2FkZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2NvdW50cmllcy1tYXAvIiwic291cmNlcyI6WyJhcHAvbW9kdWxlcy9jb3VudHJpZXMtbWFwL2dvb2dsZS1jaGFydHMtbG9hZGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHNUU7SUFNRSxtQ0FBK0IsUUFBZ0I7UUFKOUIsZ0NBQTJCLEdBQUcsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUNuRSwwQkFBcUIsR0FBRyxLQUFLLENBQUM7UUFJcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVELHdDQUFJLEdBQUosVUFBSyxNQUFlO1FBQXBCLGlCQWVDO1FBZEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBRWpDLEtBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLElBQUksQ0FBQztnQkFDakMsSUFBTSxXQUFXLEdBQVE7b0JBQ3JCLFFBQVEsRUFBRSxDQUFDLFVBQVUsQ0FBQztvQkFDdEIsUUFBUSxFQUFFLEtBQUksQ0FBQyxRQUFRO29CQUN2QixRQUFRLEVBQUUsT0FBTztpQkFDcEIsQ0FBQztnQkFDRixJQUFJLE1BQU0sRUFBRTtvQkFDVixXQUFXLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztpQkFDakM7Z0JBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQzFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLE1BQU0sRUFBRSxFQUFSLENBQVEsQ0FBQyxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLDBEQUFzQixHQUE5QjtRQUFBLGlCQXFDQztRQXBDQyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFFakMsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFDbEQsT0FBTyxFQUFFLENBQUM7YUFDWDtpQkFBTSxJQUFJLENBQUMsS0FBSSxDQUFDLHFCQUFxQixFQUFFO2dCQUV0QyxLQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO2dCQUVsQyxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRCxNQUFNLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDO2dCQUNoQyxNQUFNLENBQUMsR0FBRyxHQUFHLDBDQUEwQyxDQUFDO2dCQUN4RCxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDcEIsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQyxNQUFNLEdBQUc7b0JBQ2QsS0FBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztvQkFDbkMsS0FBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDNUMsT0FBTyxFQUFFLENBQUM7Z0JBQ1osQ0FBQyxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxPQUFPLEdBQUc7b0JBQ2YsS0FBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztvQkFDbkMsS0FBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDN0MsTUFBTSxFQUFFLENBQUM7Z0JBQ1gsQ0FBQyxDQUFDO2dCQUNGLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7YUFFOUQ7aUJBQU07Z0JBQ0wsS0FBSSxDQUFDLDJCQUEyQixDQUFDLFNBQVMsQ0FBQyxVQUFDLE1BQWU7b0JBQ3pELElBQUksTUFBTSxFQUFFO3dCQUNWLE9BQU8sRUFBRSxDQUFDO3FCQUNYO3lCQUFNO3dCQUNMLE1BQU0sRUFBRSxDQUFDO3FCQUNWO2dCQUNILENBQUMsQ0FBQyxDQUFDO2FBQ0o7UUFFSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7OzZDQTFEWSxNQUFNLFNBQUMsU0FBUzs7SUFObEIseUJBQXlCO1FBRHJDLFVBQVUsRUFBRTtRQU9FLFdBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO09BTm5CLHlCQUF5QixDQWlFckM7SUFBRCxnQ0FBQztDQUFBLEFBakVELElBaUVDO1NBakVZLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImRlY2xhcmUgdmFyIGdvb2dsZTogeyBjaGFydHM6IHsgbG9hZDogKHZlcnNpb246IHN0cmluZywgaW5pdGlhbGl6ZXI6IGFueSkgPT4gdm9pZCB9IH07XHJcblxyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBFdmVudEVtaXR0ZXIsIExPQ0FMRV9JRCwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBHb29nbGVDaGFydHNMb2FkZXJTZXJ2aWNlIHtcclxuXHJcbiAgcHJpdmF0ZSByZWFkb25seSBnb29nbGVTY3JpcHRMb2FkaW5nTm90aWZpZXIgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XHJcbiAgcHJpdmF0ZSBnb29nbGVTY3JpcHRJc0xvYWRpbmcgPSBmYWxzZTtcclxuICBwcml2YXRlIHJlYWRvbmx5IGxvY2FsZUlkOiBzdHJpbmc7XHJcblxyXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTE9DQUxFX0lEKSBsb2NhbGVJZDogc3RyaW5nKSB7XHJcbiAgICB0aGlzLmxvY2FsZUlkID0gbG9jYWxlSWQ7XHJcbiAgfVxyXG5cclxuICBsb2FkKGFwaUtleT86IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgIHRoaXMubG9hZEdvb2dsZUNoYXJ0c1NjcmlwdCgpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGluaXRpYWxpemVyOiBhbnkgPSB7XHJcbiAgICAgICAgICAgIHBhY2thZ2VzOiBbJ2dlb2NoYXJ0J10sXHJcbiAgICAgICAgICAgIGxhbmd1YWdlOiB0aGlzLmxvY2FsZUlkLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogcmVzb2x2ZVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGFwaUtleSkge1xyXG4gICAgICAgICAgaW5pdGlhbGl6ZXIubWFwc0FwaUtleSA9IGFwaUtleTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ29vZ2xlLmNoYXJ0cy5sb2FkKCc0NS4yJywgaW5pdGlhbGl6ZXIpO1xyXG4gICAgICB9KS5jYXRjaChlcnIgPT4gcmVqZWN0KCkpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGxvYWRHb29nbGVDaGFydHNTY3JpcHQoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBnb29nbGUgIT09ICd1bmRlZmluZWQnICYmIGdvb2dsZS5jaGFydHMpIHtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZ29vZ2xlU2NyaXB0SXNMb2FkaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0SXNMb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcclxuICAgICAgICBzY3JpcHQuc3JjID0gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2NoYXJ0cy9sb2FkZXIuanMnO1xyXG4gICAgICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XHJcbiAgICAgICAgc2NyaXB0LmRlZmVyID0gdHJ1ZTtcclxuICAgICAgICBzY3JpcHQub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5nb29nbGVTY3JpcHRJc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0TG9hZGluZ05vdGlmaWVyLmVtaXQodHJ1ZSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBzY3JpcHQub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0SXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdExvYWRpbmdOb3RpZmllci5lbWl0KGZhbHNlKTtcclxuICAgICAgICAgIHJlamVjdCgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdExvYWRpbmdOb3RpZmllci5zdWJzY3JpYmUoKGxvYWRlZDogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgICAgaWYgKGxvYWRlZCkge1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=