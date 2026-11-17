import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { DemoComponent } from './demo/demo.component';

bootstrapApplication(DemoComponent, {
    providers: [provideZoneChangeDetection()]
})
  .catch(err => console.error(err));
