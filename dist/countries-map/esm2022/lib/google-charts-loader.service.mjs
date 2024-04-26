import { Injectable, EventEmitter, LOCALE_ID, Inject } from '@angular/core';
import * as i0 from "@angular/core";
const chartsVersion = '45.2';
const chartsScript = 'https://www.gstatic.com/charts/loader.js';
export class GoogleChartsLoaderService {
    constructor(localeId) {
        this.localeId = localeId;
        this.googleScriptLoadingNotifier = new EventEmitter();
        this.googleScriptIsLoading = false;
    }
    async load(apiKey) {
        await this.loadGoogleChartsScript();
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.6", ngImport: i0, type: GoogleChartsLoaderService, deps: [{ token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.6", ngImport: i0, type: GoogleChartsLoaderService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.6", ngImport: i0, type: GoogleChartsLoaderService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWNoYXJ0cy1sb2FkZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvbGliL2dvb2dsZS1jaGFydHMtbG9hZGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFFNUUsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDO0FBQzdCLE1BQU0sWUFBWSxHQUFHLDBDQUEwQyxDQUFDO0FBR2hFLE1BQU0sT0FBTyx5QkFBeUI7SUFLcEMsWUFBZ0QsUUFBZ0I7UUFBaEIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUgvQyxnQ0FBMkIsR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO1FBQ25FLDBCQUFxQixHQUFHLEtBQUssQ0FBQztJQUd0QyxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFlO1FBQ3hCLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDcEMsTUFBTSxXQUFXLEdBQUc7WUFDbEIsUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtTQUN4QixDQUFDO1FBQ0YsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNYLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoRSxDQUFDO2FBQU0sQ0FBQztZQUNOLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3hELENBQUM7SUFDSCxDQUFDO0lBRU8sc0JBQXNCO1FBQzVCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFFckMsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUNuRCxPQUFPLEVBQUUsQ0FBQztZQUNaLENBQUM7aUJBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO2dCQUV2QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO2dCQUVsQyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRCxNQUFNLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDO2dCQUNoQyxNQUFNLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQztnQkFDMUIsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUNwQixNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtvQkFDbkIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztvQkFDbkMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDNUMsT0FBTyxFQUFFLENBQUM7Z0JBQ1osQ0FBQyxDQUFDO2dCQUNGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsR0FBRyxFQUFFO29CQUNwQixJQUFJLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO29CQUNuQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM3QyxNQUFNLEVBQUUsQ0FBQztnQkFDWCxDQUFDLENBQUM7Z0JBQ0YsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUUvRCxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sSUFBSSxDQUFDLDJCQUEyQixDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQWUsRUFBRSxFQUFFO29CQUM3RCxJQUFJLE1BQU0sRUFBRSxDQUFDO3dCQUNYLE9BQU8sRUFBRSxDQUFDO29CQUNaLENBQUM7eUJBQU0sQ0FBQzt3QkFDTixNQUFNLEVBQUUsQ0FBQztvQkFDWCxDQUFDO2dCQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztRQUVILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs4R0ExRFUseUJBQXlCLGtCQUtoQixTQUFTO2tIQUxsQix5QkFBeUI7OzJGQUF6Qix5QkFBeUI7a0JBRHJDLFVBQVU7OzBCQU1JLE1BQU07MkJBQUMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUsIEV2ZW50RW1pdHRlciwgTE9DQUxFX0lELCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuY29uc3QgY2hhcnRzVmVyc2lvbiA9ICc0NS4yJztcbmNvbnN0IGNoYXJ0c1NjcmlwdCA9ICdodHRwczovL3d3dy5nc3RhdGljLmNvbS9jaGFydHMvbG9hZGVyLmpzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEdvb2dsZUNoYXJ0c0xvYWRlclNlcnZpY2Uge1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgZ29vZ2xlU2NyaXB0TG9hZGluZ05vdGlmaWVyID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICBwcml2YXRlIGdvb2dsZVNjcmlwdElzTG9hZGluZyA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTE9DQUxFX0lEKSBwcml2YXRlIHJlYWRvbmx5IGxvY2FsZUlkOiBzdHJpbmcpIHtcbiAgfVxuXG4gIGFzeW5jIGxvYWQoYXBpS2V5Pzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5sb2FkR29vZ2xlQ2hhcnRzU2NyaXB0KCk7XG4gICAgY29uc3QgaW5pdGlhbGl6ZXIgPSB7XG4gICAgICBwYWNrYWdlczogWydnZW9jaGFydCddLFxuICAgICAgbGFuZ3VhZ2U6IHRoaXMubG9jYWxlSWRcbiAgICB9O1xuICAgIGlmIChhcGlLZXkpIHtcbiAgICAgIHJldHVybiBnb29nbGUuY2hhcnRzLmxvYWQoY2hhcnRzVmVyc2lvbiwgaW5pdGlhbGl6ZXIsIGFwaUtleSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBnb29nbGUuY2hhcnRzLmxvYWQoY2hhcnRzVmVyc2lvbiwgaW5pdGlhbGl6ZXIpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbG9hZEdvb2dsZUNoYXJ0c1NjcmlwdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICBpZiAodHlwZW9mIGdvb2dsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZ29vZ2xlLmNoYXJ0cykge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLmdvb2dsZVNjcmlwdElzTG9hZGluZykge1xuXG4gICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0SXNMb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgc2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcbiAgICAgICAgc2NyaXB0LnNyYyA9IGNoYXJ0c1NjcmlwdDtcbiAgICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcbiAgICAgICAgc2NyaXB0LmRlZmVyID0gdHJ1ZTtcbiAgICAgICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdElzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0TG9hZGluZ05vdGlmaWVyLmVtaXQodHJ1ZSk7XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9O1xuICAgICAgICBzY3JpcHQub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdElzTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0TG9hZGluZ05vdGlmaWVyLmVtaXQoZmFsc2UpO1xuICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICB9O1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7XG5cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0TG9hZGluZ05vdGlmaWVyLnN1YnNjcmliZSgobG9hZGVkOiBib29sZWFuKSA9PiB7XG4gICAgICAgICAgaWYgKGxvYWRlZCkge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWplY3QoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==