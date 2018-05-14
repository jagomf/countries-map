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
