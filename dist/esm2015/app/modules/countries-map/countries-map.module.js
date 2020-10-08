import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesMapComponent } from './countries-map.component';
import { GoogleChartsLoaderService } from './google-charts-loader.service';
let CountriesMapModule = class CountriesMapModule {
};
CountriesMapModule = __decorate([
    NgModule({
        imports: [
            CommonModule
        ],
        declarations: [CountriesMapComponent],
        entryComponents: [CountriesMapComponent],
        providers: [GoogleChartsLoaderService],
        exports: [
            CountriesMapComponent
        ]
    })
], CountriesMapModule);
export { CountriesMapModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9jb3VudHJpZXMtbWFwLyIsInNvdXJjZXMiOlsiYXBwL21vZHVsZXMvY291bnRyaWVzLW1hcC9jb3VudHJpZXMtbWFwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFhM0UsSUFBYSxrQkFBa0IsR0FBL0IsTUFBYSxrQkFBa0I7Q0FBSSxDQUFBO0FBQXRCLGtCQUFrQjtJQVg5QixRQUFRLENBQUM7UUFDUixPQUFPLEVBQUU7WUFDUCxZQUFZO1NBQ2I7UUFDRCxZQUFZLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztRQUNyQyxlQUFlLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztRQUN4QyxTQUFTLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztRQUN0QyxPQUFPLEVBQUU7WUFDUCxxQkFBcUI7U0FDdEI7S0FDRixDQUFDO0dBQ1csa0JBQWtCLENBQUk7U0FBdEIsa0JBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDb3VudHJpZXNNYXBDb21wb25lbnQgfSBmcm9tICcuL2NvdW50cmllcy1tYXAuY29tcG9uZW50JztcbmltcG9ydCB7IEdvb2dsZUNoYXJ0c0xvYWRlclNlcnZpY2UgfSBmcm9tICcuL2dvb2dsZS1jaGFydHMtbG9hZGVyLnNlcnZpY2UnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlXG4gIF0sXG4gIGRlY2xhcmF0aW9uczogW0NvdW50cmllc01hcENvbXBvbmVudF0sXG4gIGVudHJ5Q29tcG9uZW50czogW0NvdW50cmllc01hcENvbXBvbmVudF0sXG4gIHByb3ZpZGVyczogW0dvb2dsZUNoYXJ0c0xvYWRlclNlcnZpY2VdLFxuICBleHBvcnRzOiBbXG4gICAgQ291bnRyaWVzTWFwQ29tcG9uZW50XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgQ291bnRyaWVzTWFwTW9kdWxlIHsgfVxuIl19