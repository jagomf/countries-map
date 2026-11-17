import { ChangeDetectionStrategy, Component } from "@angular/core";

/**
 * @private Do not use this component in your app. Use `CountriesMapComponent` instead.
 */
@Component({
  selector: 'countries-map-base',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './base-map.component.svg',
  styles: [''],
  standalone: false
})
export class CountriesMapBaseComponent {
}
