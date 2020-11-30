export declare type ValidCountryData = string | number;
export interface SelectionExtra {
    key: string;
    val: ValidCountryData;
}
export interface Selection {
    countryId: string;
    countryName: string;
    extra: SelectionExtra[] | null;
}
export interface CountryExtraData {
    [key: string]: ValidCountryData;
}
export interface CountryData {
    value: ValidCountryData;
    extra?: CountryExtraData;
}
export interface CountriesData {
    [key: string]: CountryData;
}
