export interface ChartSelectEvent {
    selected: boolean;
    value?: number;
    country: string;
}
export declare enum CharErrorCode {
    loading = "loading"
}
export interface ChartErrorEvent {
    id: string | CharErrorCode;
    message: string;
    detailedMessage?: string;
}
