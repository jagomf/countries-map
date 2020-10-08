export declare class GoogleChartsLoaderService {
    private readonly googleScriptLoadingNotifier;
    private googleScriptIsLoading;
    private readonly localeId;
    constructor(localeId: string);
    load(apiKey?: string): Promise<void>;
    private loadGoogleChartsScript;
}
