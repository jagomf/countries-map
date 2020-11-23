import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesMapComponent } from './countries-map.component';
import { GoogleChartsLoaderService } from './google-charts-loader.service';
export class CountriesMapModule {
}
CountriesMapModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [CountriesMapComponent],
                providers: [GoogleChartsLoaderService],
                exports: [
                    CountriesMapComponent
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiTTovSmFnby9Eb2N1bWVudHMvY291bnRyaWVzLW1hcC9zcmMvIiwic291cmNlcyI6WyJhcHAvbW9kdWxlcy9jb3VudHJpZXMtbWFwL2NvdW50cmllcy1tYXAubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBWTNFLE1BQU0sT0FBTyxrQkFBa0I7OztZQVY5QixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLFlBQVk7aUJBQ2I7Z0JBQ0QsWUFBWSxFQUFFLENBQUMscUJBQXFCLENBQUM7Z0JBQ3JDLFNBQVMsRUFBRSxDQUFDLHlCQUF5QixDQUFDO2dCQUN0QyxPQUFPLEVBQUU7b0JBQ1AscUJBQXFCO2lCQUN0QjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDb3VudHJpZXNNYXBDb21wb25lbnQgfSBmcm9tICcuL2NvdW50cmllcy1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7IEdvb2dsZUNoYXJ0c0xvYWRlclNlcnZpY2UgfSBmcm9tICcuL2dvb2dsZS1jaGFydHMtbG9hZGVyLnNlcnZpY2UnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW0NvdW50cmllc01hcENvbXBvbmVudF0sXG4gIHByb3ZpZGVyczogW0dvb2dsZUNoYXJ0c0xvYWRlclNlcnZpY2VdLFxuICBleHBvcnRzOiBbXG4gICAgQ291bnRyaWVzTWFwQ29tcG9uZW50XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgQ291bnRyaWVzTWFwTW9kdWxlIHsgfVxuIl19