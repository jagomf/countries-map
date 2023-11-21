import { bootstrapApplication } from '@angular/platform-browser';

import { DemoComponent } from './demo/demo.component';

bootstrapApplication(DemoComponent, {
    providers: []
})
  .catch(err => console.error(err));
