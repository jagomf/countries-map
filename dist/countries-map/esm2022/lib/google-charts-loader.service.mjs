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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: GoogleChartsLoaderService, deps: [{ token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: GoogleChartsLoaderService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: GoogleChartsLoaderService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWNoYXJ0cy1sb2FkZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvbGliL2dvb2dsZS1jaGFydHMtbG9hZGVyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFFNUUsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDO0FBQzdCLE1BQU0sWUFBWSxHQUFHLDBDQUEwQyxDQUFDO0FBR2hFLE1BQU0sT0FBTyx5QkFBeUI7SUFLcEMsWUFBZ0QsUUFBZ0I7UUFBaEIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUgvQyxnQ0FBMkIsR0FBRyxJQUFJLFlBQVksRUFBVyxDQUFDO1FBQ25FLDBCQUFxQixHQUFHLEtBQUssQ0FBQztJQUd0QyxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFlO1FBQ3hCLE1BQU0sSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDcEMsTUFBTSxXQUFXLEdBQUc7WUFDbEIsUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ3RCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtTQUN4QixDQUFDO1FBQ0YsSUFBSSxNQUFNLEVBQUU7WUFDVixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDL0Q7YUFBTTtZQUNMLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQ3ZEO0lBQ0gsQ0FBQztJQUVPLHNCQUFzQjtRQUM1QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBRXJDLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Z0JBQ2xELE9BQU8sRUFBRSxDQUFDO2FBQ1g7aUJBQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtnQkFFdEMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztnQkFFbEMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDaEQsTUFBTSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUM7Z0JBQzFCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUNwQixNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDcEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7b0JBQ25CLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUM7b0JBQ25DLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzVDLE9BQU8sRUFBRSxDQUFDO2dCQUNaLENBQUMsQ0FBQztnQkFDRixNQUFNLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRTtvQkFDcEIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztvQkFDbkMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDN0MsTUFBTSxFQUFFLENBQUM7Z0JBQ1gsQ0FBQyxDQUFDO2dCQUNGLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7YUFFOUQ7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQWUsRUFBRSxFQUFFO29CQUM3RCxJQUFJLE1BQU0sRUFBRTt3QkFDVixPQUFPLEVBQUUsQ0FBQztxQkFDWDt5QkFBTTt3QkFDTCxNQUFNLEVBQUUsQ0FBQztxQkFDVjtnQkFDSCxDQUFDLENBQUMsQ0FBQzthQUNKO1FBRUgsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOytHQTFEVSx5QkFBeUIsa0JBS2hCLFNBQVM7bUhBTGxCLHlCQUF5Qjs7NEZBQXpCLHlCQUF5QjtrQkFEckMsVUFBVTs7MEJBTUksTUFBTTsyQkFBQyxTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgRXZlbnRFbWl0dGVyLCBMT0NBTEVfSUQsIEluamVjdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5jb25zdCBjaGFydHNWZXJzaW9uID0gJzQ1LjInO1xuY29uc3QgY2hhcnRzU2NyaXB0ID0gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2NoYXJ0cy9sb2FkZXIuanMnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgR29vZ2xlQ2hhcnRzTG9hZGVyU2VydmljZSB7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBnb29nbGVTY3JpcHRMb2FkaW5nTm90aWZpZXIgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gIHByaXZhdGUgZ29vZ2xlU2NyaXB0SXNMb2FkaW5nID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChMT0NBTEVfSUQpIHByaXZhdGUgcmVhZG9ubHkgbG9jYWxlSWQ6IHN0cmluZykge1xuICB9XG5cbiAgYXN5bmMgbG9hZChhcGlLZXk/OiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLmxvYWRHb29nbGVDaGFydHNTY3JpcHQoKTtcbiAgICBjb25zdCBpbml0aWFsaXplciA9IHtcbiAgICAgIHBhY2thZ2VzOiBbJ2dlb2NoYXJ0J10sXG4gICAgICBsYW5ndWFnZTogdGhpcy5sb2NhbGVJZFxuICAgIH07XG4gICAgaWYgKGFwaUtleSkge1xuICAgICAgcmV0dXJuIGdvb2dsZS5jaGFydHMubG9hZChjaGFydHNWZXJzaW9uLCBpbml0aWFsaXplciwgYXBpS2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGdvb2dsZS5jaGFydHMubG9hZChjaGFydHNWZXJzaW9uLCBpbml0aWFsaXplcik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBsb2FkR29vZ2xlQ2hhcnRzU2NyaXB0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIGlmICh0eXBlb2YgZ29vZ2xlICE9PSAndW5kZWZpbmVkJyAmJiBnb29nbGUuY2hhcnRzKSB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0gZWxzZSBpZiAoIXRoaXMuZ29vZ2xlU2NyaXB0SXNMb2FkaW5nKSB7XG5cbiAgICAgICAgdGhpcy5nb29nbGVTY3JpcHRJc0xvYWRpbmcgPSB0cnVlO1xuXG4gICAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xuICAgICAgICBzY3JpcHQuc3JjID0gY2hhcnRzU2NyaXB0O1xuICAgICAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xuICAgICAgICBzY3JpcHQuZGVmZXIgPSB0cnVlO1xuICAgICAgICBzY3JpcHQub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0SXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5nb29nbGVTY3JpcHRMb2FkaW5nTm90aWZpZXIuZW1pdCh0cnVlKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH07XG4gICAgICAgIHNjcmlwdC5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZ29vZ2xlU2NyaXB0SXNMb2FkaW5nID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5nb29nbGVTY3JpcHRMb2FkaW5nTm90aWZpZXIuZW1pdChmYWxzZSk7XG4gICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgIH07XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nb29nbGVTY3JpcHRMb2FkaW5nTm90aWZpZXIuc3Vic2NyaWJlKChsb2FkZWQ6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICBpZiAobG9hZGVkKSB7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlamVjdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICB9KTtcbiAgfVxufVxuIl19