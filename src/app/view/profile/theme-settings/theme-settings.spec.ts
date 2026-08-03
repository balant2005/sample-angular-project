import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeSettings } from './theme-settings';

describe('ThemeSettings', () => {
  let component: ThemeSettings;
  let fixture: ComponentFixture<ThemeSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
