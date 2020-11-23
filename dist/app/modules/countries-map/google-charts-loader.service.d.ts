export declare class GoogleChartsLoaderService {
    private readonly localeId;
    private readonly googleScriptLoadingNotifier;
    private googleScriptIsLoading;
    constructor(localeId: string);
    load(apiKey?: string): Promise<void>;
    private loadGoogleChartsScript;
}
