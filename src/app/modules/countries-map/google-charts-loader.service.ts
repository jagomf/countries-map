declare var google: any;

import { Injectable, EventEmitter, LOCALE_ID, Inject } from '@angular/core';

@Injectable()
export class GoogleChartsLoaderService {

  private googleScriptLoadingNotifier: EventEmitter<boolean>;
  private googleScriptIsLoading: boolean;
  private localeId: string;

  public constructor(@Inject(LOCALE_ID) localeId: string) {
    this.googleScriptLoadingNotifier = new EventEmitter();
    this.googleScriptIsLoading = false;
    this.localeId = localeId;
  }

  public load(apiKey?: string): Promise<any> {
    return new Promise((resolve, reject) => {

      this.loadGoogleChartsScript().then(() => {
        const initializer: any = {
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

  private loadGoogleChartsScript(): Promise<any> {
    return new Promise((resolve, reject) => {

      if (typeof google !== 'undefined' && google.charts) {
        resolve();
      } else if (!this.googleScriptIsLoading) {

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
