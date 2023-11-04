import * as i0 from "@angular/core";
export declare class GoogleChartsLoaderService {
    private readonly localeId;
    private readonly googleScriptLoadingNotifier;
    private googleScriptIsLoading;
    constructor(localeId: string);
    load(apiKey?: string): Promise<void>;
    private loadGoogleChartsScript;
    static ɵfac: i0.ɵɵFactoryDeclaration<GoogleChartsLoaderService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<GoogleChartsLoaderService>;
}
