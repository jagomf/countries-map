import { bootstrapApplication } from '@angular/platform-browser';

import { DemoComponent } from './demo/demo.component';

bootstrapApplication(DemoComponent)
  .catch(err => console.error(err));
