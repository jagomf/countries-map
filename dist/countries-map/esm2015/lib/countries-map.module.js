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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnRyaWVzLW1hcC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9saWIvc3JjL2xpYi9jb3VudHJpZXMtbWFwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQVkzRSxNQUFNLE9BQU8sa0JBQWtCOzs7WUFWOUIsUUFBUSxTQUFDO2dCQUNSLE9BQU8sRUFBRTtvQkFDUCxZQUFZO2lCQUNiO2dCQUNELFlBQVksRUFBRSxDQUFDLHFCQUFxQixDQUFDO2dCQUNyQyxTQUFTLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztnQkFDdEMsT0FBTyxFQUFFO29CQUNQLHFCQUFxQjtpQkFDdEI7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IENvdW50cmllc01hcENvbXBvbmVudCB9IGZyb20gJy4vY291bnRyaWVzLW1hcC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBHb29nbGVDaGFydHNMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi9nb29nbGUtY2hhcnRzLWxvYWRlci5zZXJ2aWNlJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtDb3VudHJpZXNNYXBDb21wb25lbnRdLFxyXG4gIHByb3ZpZGVyczogW0dvb2dsZUNoYXJ0c0xvYWRlclNlcnZpY2VdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIENvdW50cmllc01hcENvbXBvbmVudFxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIENvdW50cmllc01hcE1vZHVsZSB7IH1cclxuIl19