import { Injectable, EventEmitter, LOCALE_ID, Inject } from '@angular/core';

const chartsVersion = '45.2';
const chartsScript = 'https://www.gstatic.com/charts/loader.js';

@Injectable()
export class GoogleChartsLoaderService {

  private readonly googleScriptLoadingNotifier = new EventEmitter<boolean>();
  private googleScriptIsLoading = false;

  constructor(@Inject(LOCALE_ID) private readonly localeId: string) {
  }

  async load(apiKey?: string): Promise<void> {
    await this.loadGoogleChartsScript();
    const initializer = {
      packages: ['geochart'],
      language: this.localeId
    };
    if (apiKey) {
      return google.charts.load(chartsVersion, initializer, apiKey);
    } else {
      return google.charts.load(chartsVersion, initializer);
    }
  }

  private loadGoogleChartsScript(): Promise<void> {
    return new Promise((resolve, reject) => {

      if (typeof google !== 'undefined' && google.charts) {
        resolve();
      } else if (!this.googleScriptIsLoading) {

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

      } else {
        this.googleScriptLoadingNotifier.subscribe((loaded: boolean) => {
          if (loaded) {
            resolve();
          } else {
            reject();
          }
        });
      }

    });
  }
}
