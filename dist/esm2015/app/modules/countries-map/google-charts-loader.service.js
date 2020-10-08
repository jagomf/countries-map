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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWNoYXJ0cy1sb2FkZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2NvdW50cmllcy1tYXAvIiwic291cmNlcyI6WyJhcHAvbW9kdWxlcy9jb3VudHJpZXMtbWFwL2dvb2dsZS1jaGFydHMtbG9hZGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHNUUsSUFBYSx5QkFBeUIsR0FBdEMsTUFBYSx5QkFBeUI7SUFNcEMsWUFBK0IsUUFBZ0I7UUFKOUIsZ0NBQTJCLEdBQUcsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUNuRSwwQkFBcUIsR0FBRyxLQUFLLENBQUM7UUFJcEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksQ0FBQyxNQUFlO1FBQ2xCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFFckMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDdEMsTUFBTSxXQUFXLEdBQVE7b0JBQ3JCLFFBQVEsRUFBRSxDQUFDLFVBQVUsQ0FBQztvQkFDdEIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO29CQUN2QixRQUFRLEVBQUUsT0FBTztpQkFDcEIsQ0FBQztnQkFDRixJQUFJLE1BQU0sRUFBRTtvQkFDVixXQUFXLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztpQkFDakM7Z0JBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQzFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sc0JBQXNCO1FBQzVCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFFckMsSUFBSSxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtnQkFDbEQsT0FBTyxFQUFFLENBQUM7YUFDWDtpQkFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFO2dCQUV0QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO2dCQUVsQyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUNoRCxNQUFNLENBQUMsSUFBSSxHQUFHLGlCQUFpQixDQUFDO2dCQUNoQyxNQUFNLENBQUMsR0FBRyxHQUFHLDBDQUEwQyxDQUFDO2dCQUN4RCxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDcEIsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO29CQUNuQixJQUFJLENBQUMscUJBQXFCLEdBQUcsS0FBSyxDQUFDO29CQUNuQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM1QyxPQUFPLEVBQUUsQ0FBQztnQkFDWixDQUFDLENBQUM7Z0JBQ0YsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUU7b0JBQ3BCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7b0JBQ25DLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzdDLE1BQU0sRUFBRSxDQUFDO2dCQUNYLENBQUMsQ0FBQztnQkFDRixRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBRTlEO2lCQUFNO2dCQUNMLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxNQUFlLEVBQUUsRUFBRTtvQkFDN0QsSUFBSSxNQUFNLEVBQUU7d0JBQ1YsT0FBTyxFQUFFLENBQUM7cUJBQ1g7eUJBQU07d0JBQ0wsTUFBTSxFQUFFLENBQUM7cUJBQ1Y7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7YUFDSjtRQUVILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGLENBQUE7O3lDQTNEYyxNQUFNLFNBQUMsU0FBUzs7QUFObEIseUJBQXlCO0lBRHJDLFVBQVUsRUFBRTtJQU9FLFdBQUEsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFBO0dBTm5CLHlCQUF5QixDQWlFckM7U0FqRVkseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiZGVjbGFyZSB2YXIgZ29vZ2xlOiB7IGNoYXJ0czogeyBsb2FkOiAodmVyc2lvbjogc3RyaW5nLCBpbml0aWFsaXplcjogYW55KSA9PiB2b2lkIH0gfTtcclxuXHJcbmltcG9ydCB7IEluamVjdGFibGUsIEV2ZW50RW1pdHRlciwgTE9DQUxFX0lELCBJbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEdvb2dsZUNoYXJ0c0xvYWRlclNlcnZpY2Uge1xyXG5cclxuICBwcml2YXRlIHJlYWRvbmx5IGdvb2dsZVNjcmlwdExvYWRpbmdOb3RpZmllciA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcclxuICBwcml2YXRlIGdvb2dsZVNjcmlwdElzTG9hZGluZyA9IGZhbHNlO1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgbG9jYWxlSWQ6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoQEluamVjdChMT0NBTEVfSUQpIGxvY2FsZUlkOiBzdHJpbmcpIHtcclxuICAgIHRoaXMubG9jYWxlSWQgPSBsb2NhbGVJZDtcclxuICB9XHJcblxyXG4gIGxvYWQoYXBpS2V5Pzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cclxuICAgICAgdGhpcy5sb2FkR29vZ2xlQ2hhcnRzU2NyaXB0KCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaW5pdGlhbGl6ZXI6IGFueSA9IHtcclxuICAgICAgICAgICAgcGFja2FnZXM6IFsnZ2VvY2hhcnQnXSxcclxuICAgICAgICAgICAgbGFuZ3VhZ2U6IHRoaXMubG9jYWxlSWQsXHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiByZXNvbHZlXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoYXBpS2V5KSB7XHJcbiAgICAgICAgICBpbml0aWFsaXplci5tYXBzQXBpS2V5ID0gYXBpS2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBnb29nbGUuY2hhcnRzLmxvYWQoJzQ1LjInLCBpbml0aWFsaXplcik7XHJcbiAgICAgIH0pLmNhdGNoKGVyciA9PiByZWplY3QoKSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbG9hZEdvb2dsZUNoYXJ0c1NjcmlwdCgpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblxyXG4gICAgICBpZiAodHlwZW9mIGdvb2dsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgZ29vZ2xlLmNoYXJ0cykge1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSBlbHNlIGlmICghdGhpcy5nb29nbGVTY3JpcHRJc0xvYWRpbmcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5nb29nbGVTY3JpcHRJc0xvYWRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgICAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xyXG4gICAgICAgIHNjcmlwdC5zcmMgPSAnaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20vY2hhcnRzL2xvYWRlci5qcyc7XHJcbiAgICAgICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcclxuICAgICAgICBzY3JpcHQuZGVmZXIgPSB0cnVlO1xyXG4gICAgICAgIHNjcmlwdC5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdElzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy5nb29nbGVTY3JpcHRMb2FkaW5nTm90aWZpZXIuZW1pdCh0cnVlKTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHNjcmlwdC5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5nb29nbGVTY3JpcHRJc0xvYWRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0TG9hZGluZ05vdGlmaWVyLmVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgcmVqZWN0KCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7XHJcblxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0TG9hZGluZ05vdGlmaWVyLnN1YnNjcmliZSgobG9hZGVkOiBib29sZWFuKSA9PiB7XHJcbiAgICAgICAgICBpZiAobG9hZGVkKSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlamVjdCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==