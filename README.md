# countries-map

World countries datamaps component for Angular, based on Google GeoCharts

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

In your templates, use the `countries-map` component like this:
```html
<countries-map [data]="mapData" [apiKey]="abcdef" [options]="optObj"></countries-map>
```
and in the corresponding `.ts` file:
```ts
mapData =  {
  'ES': { 'value': 416 },
  'GB': { 'value': 94 },
  'FR': { 'value': 255 }
  },
};
options: {'title': 'Tasks'},
```

## Events

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

# Advanced usage
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

## License

[MIT](LICENSE.md)

[npm-image]: https://img.shields.io/npm/v/ng2-google-charts.svg
[npm-url]: https://npmjs.org/package/ng2-google-charts
[npm-downloads-image]: http://img.shields.io/npm/dm/ng2-google-charts.svg
[npm-downloads-url]: https://npmjs.org/package/ng2-google-charts
[example-page]: https://gmazzamuto.github.io/ng2-google-charts
[google-charts-error-event]: https://developers.google.com/chart/interactive/docs/events#the-error-event
