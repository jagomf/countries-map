import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesMapComponent } from './countries-map.component';
import { GoogleChartsLoaderService } from './google-charts-loader.service';
import * as i0 from "@angular/core";
export class CountriesMapModule {
}
CountriesMapModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: CountriesMapModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
CountriesMapModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: CountriesMapModule, declarations: [CountriesMapComponent], imports: [CommonModule], exports: [CountriesMapComponent] });
CountriesMapModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: CountriesMapModule, providers: [GoogleChartsLoaderService], imports: [[
            CommonModule
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: CountriesMapModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule
                    ],
                    declarations: [CountriesMapComponent],
                    providers: [GoogleChartsLoaderService],
                    exports: [
                        CountriesMapComponent
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9saWIvc3JjL2xpYi9jb3VudHJpZXMtbWFwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQzs7QUFZM0UsTUFBTSxPQUFPLGtCQUFrQjs7K0dBQWxCLGtCQUFrQjtnSEFBbEIsa0JBQWtCLGlCQU5kLHFCQUFxQixhQUZsQyxZQUFZLGFBS1oscUJBQXFCO2dIQUdaLGtCQUFrQixhQUxsQixDQUFDLHlCQUF5QixDQUFDLFlBSjdCO1lBQ1AsWUFBWTtTQUNiOzJGQU9VLGtCQUFrQjtrQkFWOUIsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUU7d0JBQ1AsWUFBWTtxQkFDYjtvQkFDRCxZQUFZLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztvQkFDckMsU0FBUyxFQUFFLENBQUMseUJBQXlCLENBQUM7b0JBQ3RDLE9BQU8sRUFBRTt3QkFDUCxxQkFBcUI7cUJBQ3RCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDb3VudHJpZXNNYXBDb21wb25lbnQgfSBmcm9tICcuL2NvdW50cmllcy1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7IEdvb2dsZUNoYXJ0c0xvYWRlclNlcnZpY2UgfSBmcm9tICcuL2dvb2dsZS1jaGFydHMtbG9hZGVyLnNlcnZpY2UnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW0NvdW50cmllc01hcENvbXBvbmVudF0sXG4gIHByb3ZpZGVyczogW0dvb2dsZUNoYXJ0c0xvYWRlclNlcnZpY2VdLFxuICBleHBvcnRzOiBbXG4gICAgQ291bnRyaWVzTWFwQ29tcG9uZW50XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgQ291bnRyaWVzTWFwTW9kdWxlIHsgfVxuIl19