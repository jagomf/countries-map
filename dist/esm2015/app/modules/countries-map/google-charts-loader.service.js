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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWNoYXJ0cy1sb2FkZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiJNOi9KYWdvL0RvY3VtZW50cy9jb3VudHJpZXMtbWFwL3NyYy8iLCJzb3VyY2VzIjpbImFwcC9tb2R1bGVzL2NvdW50cmllcy1tYXAvZ29vZ2xlLWNoYXJ0cy1sb2FkZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU1RSxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUM7QUFDN0IsTUFBTSxZQUFZLEdBQUcsMENBQTBDLENBQUM7QUFHaEUsTUFBTSxPQUFPLHlCQUF5QjtJQUtwQyxZQUFnRCxRQUFnQjtRQUFoQixhQUFRLEdBQVIsUUFBUSxDQUFRO1FBSC9DLGdDQUEyQixHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUFDbkUsMEJBQXFCLEdBQUcsS0FBSyxDQUFDO0lBR3RDLENBQUM7SUFFSyxJQUFJLENBQUMsTUFBZTs7WUFDeEIsTUFBTSxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUNwQyxNQUFNLFdBQVcsR0FBRztnQkFDbEIsUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDO2dCQUN0QixRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7YUFDeEIsQ0FBQztZQUNGLElBQUksTUFBTSxFQUFFO2dCQUNWLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsQ0FBQzthQUMvRDtpQkFBTTtnQkFDTCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQzthQUN2RDtRQUNILENBQUM7S0FBQTtJQUVPLHNCQUFzQjtRQUM1QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBRXJDLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Z0JBQ2xELE9BQU8sRUFBRSxDQUFDO2FBQ1g7aUJBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtnQkFFdEMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztnQkFFbEMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDaEQsTUFBTSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUM7Z0JBQzFCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUNwQixNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDcEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7b0JBQ25CLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7b0JBQ25DLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzVDLE9BQU8sRUFBRSxDQUFDO2dCQUNaLENBQUMsQ0FBQztnQkFDRixNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtvQkFDcEIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztvQkFDbkMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDN0MsTUFBTSxFQUFFLENBQUM7Z0JBQ1gsQ0FBQyxDQUFDO2dCQUNGLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7YUFFOUQ7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQWUsRUFBRSxFQUFFO29CQUM3RCxJQUFJLE1BQU0sRUFBRTt3QkFDVixPQUFPLEVBQUUsQ0FBQztxQkFDWDt5QkFBTTt3QkFDTCxNQUFNLEVBQUUsQ0FBQztxQkFDVjtnQkFDSCxDQUFDLENBQUMsQ0FBQzthQUNKO1FBRUgsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOzs7WUEzREYsVUFBVTs7O3lDQU1JLE1BQU0sU0FBQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgRXZlbnRFbWl0dGVyLCBMT0NBTEVfSUQsIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuY29uc3QgY2hhcnRzVmVyc2lvbiA9ICc0NS4yJztcclxuY29uc3QgY2hhcnRzU2NyaXB0ID0gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2NoYXJ0cy9sb2FkZXIuanMnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgR29vZ2xlQ2hhcnRzTG9hZGVyU2VydmljZSB7XHJcblxyXG4gIHByaXZhdGUgcmVhZG9ubHkgZ29vZ2xlU2NyaXB0TG9hZGluZ05vdGlmaWVyID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xyXG4gIHByaXZhdGUgZ29vZ2xlU2NyaXB0SXNMb2FkaW5nID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTE9DQUxFX0lEKSBwcml2YXRlIHJlYWRvbmx5IGxvY2FsZUlkOiBzdHJpbmcpIHtcclxuICB9XHJcblxyXG4gIGFzeW5jIGxvYWQoYXBpS2V5Pzogc3RyaW5nKSB7XHJcbiAgICBhd2FpdCB0aGlzLmxvYWRHb29nbGVDaGFydHNTY3JpcHQoKTtcclxuICAgIGNvbnN0IGluaXRpYWxpemVyID0ge1xyXG4gICAgICBwYWNrYWdlczogWydnZW9jaGFydCddLFxyXG4gICAgICBsYW5ndWFnZTogdGhpcy5sb2NhbGVJZFxyXG4gICAgfTtcclxuICAgIGlmIChhcGlLZXkpIHtcclxuICAgICAgcmV0dXJuIGdvb2dsZS5jaGFydHMubG9hZChjaGFydHNWZXJzaW9uLCBpbml0aWFsaXplciwgYXBpS2V5KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBnb29nbGUuY2hhcnRzLmxvYWQoY2hhcnRzVmVyc2lvbiwgaW5pdGlhbGl6ZXIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsb2FkR29vZ2xlQ2hhcnRzU2NyaXB0KCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHJcbiAgICAgIGlmICh0eXBlb2YgZ29vZ2xlICE9PSAndW5kZWZpbmVkJyAmJiBnb29nbGUuY2hhcnRzKSB7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLmdvb2dsZVNjcmlwdElzTG9hZGluZykge1xyXG5cclxuICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdElzTG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICAgICAgc2NyaXB0LnNyYyA9IGNoYXJ0c1NjcmlwdDtcclxuICAgICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xyXG4gICAgICAgIHNjcmlwdC5kZWZlciA9IHRydWU7XHJcbiAgICAgICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0SXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdExvYWRpbmdOb3RpZmllci5lbWl0KHRydWUpO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgc2NyaXB0Lm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmdvb2dsZVNjcmlwdElzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy5nb29nbGVTY3JpcHRMb2FkaW5nTm90aWZpZXIuZW1pdChmYWxzZSk7XHJcbiAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5nb29nbGVTY3JpcHRMb2FkaW5nTm90aWZpZXIuc3Vic2NyaWJlKChsb2FkZWQ6IGJvb2xlYW4pID0+IHtcclxuICAgICAgICAgIGlmIChsb2FkZWQpIHtcclxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmVqZWN0KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19