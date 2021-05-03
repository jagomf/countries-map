import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountriesMapBaseComponent } from './base-map.component';
import { CountriesMapComponent } from './countries-map.component';
export class CountriesMapModule {
}
CountriesMapModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [CountriesMapBaseComponent, CountriesMapComponent],
                exports: [
                    CountriesMapComponent
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9saWIvc3JjL2xpYi9jb3VudHJpZXMtbWFwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQVdsRSxNQUFNLE9BQU8sa0JBQWtCOzs7WUFUOUIsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRTtvQkFDUCxZQUFZO2lCQUNiO2dCQUNELFlBQVksRUFBRSxDQUFDLHlCQUF5QixFQUFFLHFCQUFxQixDQUFDO2dCQUNoRSxPQUFPLEVBQUU7b0JBQ1AscUJBQXFCO2lCQUN0QjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgQ291bnRyaWVzTWFwQmFzZUNvbXBvbmVudCB9IGZyb20gJy4vYmFzZS1tYXAuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ291bnRyaWVzTWFwQ29tcG9uZW50IH0gZnJvbSAnLi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudCc7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIENvbW1vbk1vZHVsZVxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbQ291bnRyaWVzTWFwQmFzZUNvbXBvbmVudCwgQ291bnRyaWVzTWFwQ29tcG9uZW50XSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBDb3VudHJpZXNNYXBDb21wb25lbnRcclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDb3VudHJpZXNNYXBNb2R1bGUgeyB9XHJcbiJdfQ==