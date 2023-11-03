import { __awaiter } from "tslib";
import { Injectable, EventEmitter, LOCALE_ID, Inject } from '@angular/core';
const chartsVersion = '45.2';
const chartsScript = 'https://www.gstatic.com/charts/loader.js';
export class GoogleChartsLoaderService {
    constructor(localeId) {
        this.localeId = localeId;
        this.googleScriptLoadingNotifier = new EventEmitter();
        this.googleScriptIsLoading = false;
    }
    load(apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadGoogleChartsScript();
            const initializer = {
                packages: ['geochart'],
                language: this.localeId
            };
            if (apiKey) {
                return google.charts.load(chartsVersion, initializer, apiKey);
            }
            else {
                return google.charts.load(chartsVersion, initializer);
            }
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
                script.src = chartsScript;
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
}
GoogleChartsLoaderService.decorators = [
    { type: Injectable }
];
GoogleChartsLoaderService.ctorParameters = () => [
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWNoYXJ0cy1sb2FkZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvbGliL2dvb2dsZS1jaGFydHMtbG9hZGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFNUUsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDO0FBQzdCLE1BQU0sWUFBWSxHQUFHLDBDQUEwQyxDQUFDO0FBR2hFLE1BQU0sT0FBTyx5QkFBeUI7SUFLcEMsWUFBZ0QsUUFBZ0I7UUFBaEIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUgvQyxnQ0FBMkIsR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO1FBQ25FLDBCQUFxQixHQUFHLEtBQUssQ0FBQztJQUd0QyxDQUFDO0lBRUssSUFBSSxDQUFDLE1BQWU7O1lBQ3hCLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7WUFDcEMsTUFBTSxXQUFXLEdBQUc7Z0JBQ2xCLFFBQVEsRUFBRSxDQUFDLFVBQVUsQ0FBQztnQkFDdEIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO2FBQ3hCLENBQUM7WUFDRixJQUFJLE1BQU0sRUFBRTtnQkFDVixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDL0Q7aUJBQU07Z0JBQ0wsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsV0FBVyxDQUFDLENBQUM7YUFDdkQ7UUFDSCxDQUFDO0tBQUE7SUFFTyxzQkFBc0I7UUFDNUIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUVyQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO2dCQUNsRCxPQUFPLEVBQUUsQ0FBQzthQUNYO2lCQUFNLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUU7Z0JBRXRDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7Z0JBRWxDLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sQ0FBQyxJQUFJLEdBQUcsaUJBQWlCLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDO2dCQUMxQixNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDcEIsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO29CQUNuQixJQUFJLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO29CQUNuQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM1QyxPQUFPLEVBQUUsQ0FBQztnQkFDWixDQUFDLENBQUM7Z0JBQ0YsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7b0JBQ25DLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzdDLE1BQU0sRUFBRSxDQUFDO2dCQUNYLENBQUMsQ0FBQztnQkFDRixRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBRTlEO2lCQUFNO2dCQUNMLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFlLEVBQUUsRUFBRTtvQkFDN0QsSUFBSSxNQUFNLEVBQUU7d0JBQ1YsT0FBTyxFQUFFLENBQUM7cUJBQ1g7eUJBQU07d0JBQ0wsTUFBTSxFQUFFLENBQUM7cUJBQ1Y7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7YUFDSjtRQUVILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7O1lBM0RGLFVBQVU7Ozt5Q0FNSSxNQUFNLFNBQUMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEV2ZW50RW1pdHRlciwgTE9DQUxFX0lELCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuY29uc3QgY2hhcnRzVmVyc2lvbiA9ICc0NS4yJztcbmNvbnN0IGNoYXJ0c1NjcmlwdCA9ICdodHRwczovL3d3dy5nc3RhdGljLmNvbS9jaGFydHMvbG9hZGVyLmpzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEdvb2dsZUNoYXJ0c0xvYWRlclNlcnZpY2Uge1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZ29vZ2xlU2NyaXB0TG9hZGluZ05vdGlmaWVyID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICBwcml2YXRlIGdvb2dsZVNjcmlwdElzTG9hZGluZyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTE9DQUxFX0lEKSBwcml2YXRlIHJlYWRvbmx5IGxvY2FsZUlkOiBzdHJpbmcpIHtcbiAgfVxuXG4gIGFzeW5jIGxvYWQoYXBpS2V5Pzogc3RyaW5nKSB7XG4gICAgYXdhaXQgdGhpcy5sb2FkR29vZ2xlQ2hhcnRzU2NyaXB0KCk7XG4gICAgY29uc3QgaW5pdGlhbGl6ZXIgPSB7XG4gICAgICBwYWNrYWdlczogWydnZW9jaGFydCddLFxuICAgICAgbGFuZ3VhZ2U6IHRoaXMubG9jYWxlSWRcbiAgICB9O1xuICAgIGlmIChhcGlLZXkpIHtcbiAgICAgIHJldHVybiBnb29nbGUuY2hhcnRzLmxvYWQoY2hhcnRzVmVyc2lvbiwgaW5pdGlhbGl6ZXIsIGFwaUtleSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBnb29nbGUuY2hhcnRzLmxvYWQoY2hhcnRzVmVyc2lvbiwgaW5pdGlhbGl6ZXIpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbG9hZEdvb2dsZUNoYXJ0c1NjcmlwdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICBpZiAodHlwZW9mIGdvb2dsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZ29vZ2xlLmNoYXJ0cykge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLmdvb2dsZVNjcmlwdElzTG9hZGluZykge1xuXG4gICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0SXNMb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICAgICAgc2NyaXB0LnNyYyA9IGNoYXJ0c1NjcmlwdDtcbiAgICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgICAgICAgc2NyaXB0LmRlZmVyID0gdHJ1ZTtcbiAgICAgICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdElzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0TG9hZGluZ05vdGlmaWVyLmVtaXQodHJ1ZSk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9O1xuICAgICAgICBzY3JpcHQub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdElzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0TG9hZGluZ05vdGlmaWVyLmVtaXQoZmFsc2UpO1xuICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICB9O1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0TG9hZGluZ05vdGlmaWVyLnN1YnNjcmliZSgobG9hZGVkOiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgaWYgKGxvYWRlZCkge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==