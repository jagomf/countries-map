export interface ChartSelectEvent {
    selected: boolean;
    value: number | null;
    country: string;
}
export interface ChartErrorEvent {
    id: string;
    message: string;
    detailedMessage: string;
    options: Object;
}
export interface SelectionExtra {
    key: string;
    val: string | number;
}
export interface Selection {
    countryId: string;
    countryName: string;
    extra: SelectionExtra[] | null;
}
export interface CountryExtraData {
    [key: string]: string | number;
}
export interface CountryData {
    value: string | number;
    extra: CountryExtraData | undefined;
}
export interface CountriesData {
    [key: string]: CountryData;
}
