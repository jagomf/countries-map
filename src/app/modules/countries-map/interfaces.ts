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
  val: string;
}

export interface Selection {
  countryId: string;
  countryName: string;
  extra: SelectionExtra[] | null;
}
