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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9saWIvc3JjL2xpYi9jb3VudHJpZXMtbWFwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQVdsRSxNQUFNLE9BQU8sa0JBQWtCOzs7WUFUOUIsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRTtvQkFDUCxZQUFZO2lCQUNiO2dCQUNELFlBQVksRUFBRSxDQUFDLHlCQUF5QixFQUFFLHFCQUFxQixDQUFDO2dCQUNoRSxPQUFPLEVBQUU7b0JBQ1AscUJBQXFCO2lCQUN0QjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDb3VudHJpZXNNYXBCYXNlQ29tcG9uZW50IH0gZnJvbSAnLi9iYXNlLW1hcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ291bnRyaWVzTWFwQ29tcG9uZW50IH0gZnJvbSAnLi9jb3VudHJpZXMtbWFwLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGVcbiAgXSxcbiAgZGVjbGFyYXRpb25zOiBbQ291bnRyaWVzTWFwQmFzZUNvbXBvbmVudCwgQ291bnRyaWVzTWFwQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW1xuICAgIENvdW50cmllc01hcENvbXBvbmVudFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIENvdW50cmllc01hcE1vZHVsZSB7IH1cbiJdfQ==