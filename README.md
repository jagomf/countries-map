# countries-map

> World countries datamaps component for Angular, based on Google GeoCharts.

[![NPM Version][npm-image]][npm-url]

## Table of contents

* [Install](#install)
* [Usage](#usage)
* [Attributes](#attributes)
* [Events](#events)
* [Advanced usage](#events)
* [FAQ](#faq)
* [License](#license)


## Install

```bash
npm install --save countries-map
```

## Usage

Import `CountriesMap` in your `app.module.ts`:
```ts
import { CountriesMap } from 'countries-map';

@NgModule({
  ...
  imports: [
    ...
    CountriesMap,
  ],
})
export class AppModule { }
```

In your templates, use the `<countries-map>` component like this:
```html
<countries-map [data]="mapData" [apiKey]="abcdef" [options]="optObj"></countries-map>
```
and in the corresponding `.ts` file:
```ts
import { CountriesData } from 'countries-map';
...
public mapData: CountriesData =  {
  'ES': { 'value': 416 },
  'GB': { 'value': 94 },
  'FR': { 'value': 255 }
};
```

### Typing

Typing the data input with `CountriesData` is not mandatory but it is highly recommendable because it will help you correctly define the object to pass to `<countries-map>`'s `[data]` attribute.

## Attributes

Element `<countries-map>` accepts the following attributes/inputs:

Attribute | Type | Default | Mandatory
--- | --- | --- | ---
data | CountriesData (object) | - | Yes
apiKey | string | - | No
options | object | - | No
countryLabel | string | `'Country'` | No
valueLabel | string | `'Value'` | No
showCaption | boolean | `true` | No
captionBelow | boolean | `true` | No
minValue | number | `0` | No
maxValue | number | - | No
minColor | string | `'white'` | No
maxColor | string | `'red'` | No
noDataColor | string | `'#CFCFCF'` | No
exceptionColor | string | `'#FFEE58'` | No

## Events

Element `<countries-map>` accepts callbacks for the following events:

### chartReady

The `chartReady` event is fired when a chart is completely loaded.

Bind the `chartReady` event in the `countries-map` component like this:
```html
<countries-map [data]="mapData" (chartReady)="ready()"></countries-map>
```

Your `ready()` function receives no parameters. You can use it like:
```ts
public ready() {
  // your logic
}
```

### chartError

The `chartError` event is fired if there are some errors with a chart.

Bind the `chartError` event in the `countries-map` component, like this:
```html
<countries-map [data]="mapData" (chartError)="error($event)"></countries-map>
```

Your `error()` function is passed an event whose interface looks like this:
```ts
interface ChartErrorEvent {
  id: string;
  message: string;
  detailedMessage: string;
  options: Object;
}
```

You can import the `ChartErrorEvent` interface in your `.ts` file:
```ts
import { ChartErrorEvent } from 'countries-map';
```

and then use it like:
```ts
public error(event: ChartErrorEvent) {
  // your logic
}
```

See more details about [returned values for error event][google-charts-error-event].

### chartSelect

The `chartSelect` event is fired when a chart is selected/clicked.

Bind the `chartSelect` event in the `countries-map` component, like this:
```html
<countries-map [data]="mapData" (chartSelect)="select($event)"></countries-map>
```

Your `select()` function is passed an event whose interface looks like this:
```ts
interface ChartSelectEvent {
  selected: boolean;
  value: number | null;
  country: string;
}
```

You can import the `ChartSelectEvent` interface in your `.ts` file:
```ts
import { ChartSelectEvent } from 'countries-map';
```

and then use it like:
```ts
public select(event: ChartSelectEvent) {
  // your logic
}
```

## Advanced usage
You can access Google Chart's underlying [ChartWrapper](https://developers.google.com/chart/interactive/docs/reference#chartwrapperobject) through the
`wrapper` property of the component object:
```html
<countries-map #cmap [data]="mapData"></countries-map>
```

```ts
import { ViewChild } from '@angular/core';

export class AppComponent {

  @ViewChild('cmap') cmap;

  myfunction() {
    let googleChartWrapper = this.cmap.wrapper;

    //force a redraw
    this.cmap.redraw();
  }

}
```

## FAQ

### Why tooltip on hover is not showing up?
Since Google GeoCharts' tooltip customization is very limited and complex, its support is currently disabled.

## License

[MIT](LICENSE.md)
