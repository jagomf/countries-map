import { __decorate, __param } from "tslib";
import { Injectable, EventEmitter, LOCALE_ID, Inject } from '@angular/core';
let GoogleChartsLoaderService = class GoogleChartsLoaderService {
    constructor(localeId) {
        this.googleScriptLoadingNotifier = new EventEmitter();
        this.googleScriptIsLoading = false;
        this.localeId = localeId;
    }
    load(apiKey) {
        return new Promise((resolve, reject) => {
            this.loadGoogleChartsScript().then(() => {
                const initializer = {
                    packages: ['geochart'],
                    language: this.localeId,
                    callback: resolve
                };
                if (apiKey) {
                    initializer.mapsApiKey = apiKey;
                }
                google.charts.load('45.2', initializer);
            }).catch(err => reject());
        });
    }
    loadGoogleChartsScript() {
        return new Promise((resolve, reject) => {
            if (typeof google !== 'undefined' && google.charts) {
                resolve();
            }
            else if (!this.googleScriptIsLoading) {
                this.googleScriptIsLoading = true;
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://www.gstatic.com/charts/loader.js';
                script.async = true;
                script.defer = true;
                script.onload = () => {
                    this.googleScriptIsLoading = false;
                    this.googleScriptLoadingNotifier.emit(true);
                    resolve();
                };
                script.onerror = () => {
                    this.googleScriptIsLoading = false;
                    this.googleScriptLoadingNotifier.emit(false);
                    reject();
                };
                document.getElementsByTagName('head')[0].appendChild(script);
            }
            else {
                this.googleScriptLoadingNotifier.subscribe((loaded) => {
                    if (loaded) {
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
            }
        });
    }
};
GoogleChartsLoaderService.ctorParameters = () => [
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] }
];
GoogleChartsLoaderService = __decorate([
    Injectable(),
    __param(0, Inject(LOCALE_ID))
], GoogleChartsLoaderService);
export { GoogleChartsLoaderService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWNoYXJ0cy1sb2FkZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2NvdW50cmllcy1tYXAvIiwic291cmNlcyI6WyJhcHAvbW9kdWxlcy9jb3VudHJpZXMtbWFwL2dvb2dsZS1jaGFydHMtbG9hZGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHNUUsSUFBYSx5QkFBeUIsR0FBdEMsTUFBYSx5QkFBeUI7SUFNcEMsWUFBc0MsUUFBZ0I7UUFDcEQsSUFBSSxDQUFDLDJCQUEyQixHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDdEQsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztRQUNuQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBRU0sSUFBSSxDQUFDLE1BQWU7UUFDekIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUVyQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUN0QyxNQUFNLFdBQVcsR0FBUTtvQkFDckIsUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDO29CQUN0QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7b0JBQ3ZCLFFBQVEsRUFBRSxPQUFPO2lCQUNwQixDQUFDO2dCQUNGLElBQUksTUFBTSxFQUFFO29CQUNWLFdBQVcsQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO2lCQUNqQztnQkFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDMUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTyxzQkFBc0I7UUFDNUIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUVyQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUNsRCxPQUFPLEVBQUUsQ0FBQzthQUNYO2lCQUFNLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUU7Z0JBRXRDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7Z0JBRWxDLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsMENBQTBDLENBQUM7Z0JBQ3hELE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUNwQixNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDcEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7b0JBQ25CLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7b0JBQ25DLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzVDLE9BQU8sRUFBRSxDQUFDO2dCQUNaLENBQUMsQ0FBQztnQkFDRixNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtvQkFDcEIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztvQkFDbkMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDN0MsTUFBTSxFQUFFLENBQUM7Z0JBQ1gsQ0FBQyxDQUFDO2dCQUNGLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7YUFFOUQ7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQWUsRUFBRSxFQUFFO29CQUM3RCxJQUFJLE1BQU0sRUFBRTt3QkFDVixPQUFPLEVBQUUsQ0FBQztxQkFDWDt5QkFBTTt3QkFDTCxNQUFNLEVBQUUsQ0FBQztxQkFDVjtnQkFDSCxDQUFDLENBQUMsQ0FBQzthQUNKO1FBRUgsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YsQ0FBQTs7eUNBN0RxQixNQUFNLFNBQUMsU0FBUzs7QUFOekIseUJBQXlCO0lBRHJDLFVBQVUsRUFBRTtJQU9TLFdBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0dBTjFCLHlCQUF5QixDQW1FckM7U0FuRVkseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiZGVjbGFyZSB2YXIgZ29vZ2xlOiBhbnk7XHJcblxyXG5pbXBvcnQgeyBJbmplY3RhYmxlLCBFdmVudEVtaXR0ZXIsIExPQ0FMRV9JRCwgSW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBHb29nbGVDaGFydHNMb2FkZXJTZXJ2aWNlIHtcclxuXHJcbiAgcHJpdmF0ZSBnb29nbGVTY3JpcHRMb2FkaW5nTm90aWZpZXI6IEV2ZW50RW1pdHRlcjxib29sZWFuPjtcclxuICBwcml2YXRlIGdvb2dsZVNjcmlwdElzTG9hZGluZzogYm9vbGVhbjtcclxuICBwcml2YXRlIGxvY2FsZUlkOiBzdHJpbmc7XHJcblxyXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihASW5qZWN0KExPQ0FMRV9JRCkgbG9jYWxlSWQ6IHN0cmluZykge1xyXG4gICAgdGhpcy5nb29nbGVTY3JpcHRMb2FkaW5nTm90aWZpZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgICB0aGlzLmdvb2dsZVNjcmlwdElzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgdGhpcy5sb2NhbGVJZCA9IGxvY2FsZUlkO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGxvYWQoYXBpS2V5Pzogc3RyaW5nKTogUHJvbWlzZTxhbnk+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgICB0aGlzLmxvYWRHb29nbGVDaGFydHNTY3JpcHQoKS50aGVuKCgpID0+IHtcclxuICAgICAgICBjb25zdCBpbml0aWFsaXplcjogYW55ID0ge1xyXG4gICAgICAgICAgICBwYWNrYWdlczogWydnZW9jaGFydCddLFxyXG4gICAgICAgICAgICBsYW5ndWFnZTogdGhpcy5sb2NhbGVJZCxcclxuICAgICAgICAgICAgY2FsbGJhY2s6IHJlc29sdmVcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChhcGlLZXkpIHtcclxuICAgICAgICAgIGluaXRpYWxpemVyLm1hcHNBcGlLZXkgPSBhcGlLZXk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdvb2dsZS5jaGFydHMubG9hZCgnNDUuMicsIGluaXRpYWxpemVyKTtcclxuICAgICAgfSkuY2F0Y2goZXJyID0+IHJlamVjdCgpKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsb2FkR29vZ2xlQ2hhcnRzU2NyaXB0KCk6IFByb21pc2U8YW55PiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgaWYgKHR5cGVvZiBnb29nbGUgIT09ICd1bmRlZmluZWQnICYmIGdvb2dsZS5jaGFydHMpIHtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZ29vZ2xlU2NyaXB0SXNMb2FkaW5nKSB7XHJcblxyXG4gICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0SXNMb2FkaW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcclxuICAgICAgICBzY3JpcHQuc3JjID0gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2NoYXJ0cy9sb2FkZXIuanMnO1xyXG4gICAgICAgIHNjcmlwdC5hc3luYyA9IHRydWU7XHJcbiAgICAgICAgc2NyaXB0LmRlZmVyID0gdHJ1ZTtcclxuICAgICAgICBzY3JpcHQub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5nb29nbGVTY3JpcHRJc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0TG9hZGluZ05vdGlmaWVyLmVtaXQodHJ1ZSk7XHJcbiAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBzY3JpcHQub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0SXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdExvYWRpbmdOb3RpZmllci5lbWl0KGZhbHNlKTtcclxuICAgICAgICAgIHJlamVjdCgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG5cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdExvYWRpbmdOb3RpZmllci5zdWJzY3JpYmUoKGxvYWRlZDogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgICAgaWYgKGxvYWRlZCkge1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=