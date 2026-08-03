import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRedirect } from './home-redirect';

describe('HomeRedirect', () => {
  let component: HomeRedirect;
  let fixture: ComponentFixture<HomeRedirect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeRedirect],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeRedirect);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
