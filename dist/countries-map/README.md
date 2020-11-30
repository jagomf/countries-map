# countries-map

> World countries datamaps component for Angular, based on Google GeoCharts.

[![npm version](https://badge.fury.io/js/countries-map.svg)](https://badge.fury.io/js/countries-map)


![screenshot](https://raw.githubusercontent.com/jagomf/countries-map/master/screenshot.png)

## Table of contents

* [Install](#install)
* [Usage](#usage)
* [Attributes](#attributes)
* [Events](#events)
* [Styles](#styles)
* [Advanced usage](#advanced-usage)
* [FAQ](#faq)
* [License](#license)


## Install

```bash
npm install --save countries-map
```

## Usage

Import `CountriesMapModule` in your `app.module.ts`:
```ts
import { CountriesMapModule } from 'countries-map';

@NgModule({
  ...
  imports: [
    ...
    CountriesMapModule,
  ],
})
export class AppModule { }
```

In your templates, use the `<countries-map>` component like this:
```html
<countries-map [data]="mapData" [apiKey]="abcdef"></countries-map>
```
and in the corresponding `.ts` file:
```ts
import { CountriesData } from 'countries-map';
...
public mapData: CountriesData = {
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
autoResize | boolean | `false` | No
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
backgroundColor | string | `'white'` | No

<br>

If you set `autoResize` attribute to `true`, map will adapt to screen size changes, like in a device orientation switch.

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

Your `error()` function is passed an event which interface looks like this:
```ts
interface ChartErrorEvent {
  id: string | CharErrorCode;
  message: string;
  detailedMessage: string;
  options: Object;
}
```

You can import the `ChartErrorEvent` interface and `CharErrorCode` enum in your `.ts` file:
```ts
import { ChartErrorEvent, CharErrorCode } from 'countries-map';
```

and then use it like:
```ts
public error(event: ChartErrorEvent) {
  if (event.id === CharErrorCode.loading) {
    // error was produced during loading
  }
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

## Styles

You can apply styles to most of the countries-map caption area (if you decide to show it) and map container so that you can integrate your countries-map in your site's look&feel.

These are the classes you can apply styles to, hierarchically displayed, and associated to their wrappers:

* `cm-map-content`: world map
* `cm-caption-container`: full caption area
  * `cm-simple-caption`: main caption section (`countryLabel`/`valueLabel` area)
    * `cm-country-label`: `countryLabel` keyword or country name (whichever is shown)
      * `cm-defaut-label`: `countryLabel` keyword
      * `cm-country-name`: country name
    * `cm-value-label`: `valueLabel` keyword or value label, plus actual value
      * `cm-value-text`: `valueLabel` keyword or value label (whichever is shown)
      * `cm-value-content`: actual value for the current country
  * `cm-extended-caption`: area for the extra items
    * `cm-extended-item`: each of the single extra items (made of key and value)
      * `cm-extended-label`: key of the single extra item
      * `cm-extended-value`: value of the single extra item

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
