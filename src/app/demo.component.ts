import { Component } from '@angular/core';

@Component({
  selector: 'demo-content',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent {
  public mapData = {
    'US' : { value:  1 },
    'CA' : { value:  2 },
    'ES' : { value:  3 },
    'FR' : { value:  4 },
    'GB' : { value:  5 },
    'PT' : { value:  6 },
    'GR' : { value:  7 },
    'AU' : { value:  8 },
    'NZ' : { value:  9 },
    'JP' : { value:  1 },
    'MY' : { value:  2 },
    'CN' : { value:  3 },
    'SM' : { value:  4 },
    'UY' : { value:  5 },
  };
}
