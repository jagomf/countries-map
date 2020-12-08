export declare type ValidExtraData = string | number;
export interface SelectionExtra {
    key: string;
    val: ValidExtraData;
}
export interface Selection {
    countryId: string;
    countryName: string;
    extra?: SelectionExtra[];
}
export interface CountryExtraData {
    [key: string]: ValidExtraData;
}
export interface CountryData {
    value: number;
    extra?: CountryExtraData;
}
export interface DrawableCountry extends CountryData {
    color: string;
}
export interface CountriesData {
    [countryCode: string]: CountryData;
}
export interface DrawableCountries {
    [countryCode: string]: DrawableCountry;
}
