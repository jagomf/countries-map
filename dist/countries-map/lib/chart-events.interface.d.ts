import { CountryExtraData } from './data-types.interface';
export interface ChartSelectEvent {
    selected: boolean;
    value?: number;
    country: string;
    extra?: CountryExtraData;
}
export declare enum CharErrorCode {
    loading = "loading"
}
export interface ChartErrorEvent {
    id: string | CharErrorCode;
    message: string;
    detailedMessage?: string;
}
