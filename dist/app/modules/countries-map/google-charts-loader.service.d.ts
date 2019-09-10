export declare class GoogleChartsLoaderService {
    private googleScriptLoadingNotifier;
    private googleScriptIsLoading;
    private localeId;
    constructor(localeId: string);
    load(apiKey?: string): Promise<any>;
    private loadGoogleChartsScript;
}
