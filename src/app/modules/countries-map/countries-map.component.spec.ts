import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesMapComponent } from './countries-map.component';

describe('CountriesMapComponent', () => {
  let component: CountriesMapComponent;
  let fixture: ComponentFixture<CountriesMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountriesMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountriesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
