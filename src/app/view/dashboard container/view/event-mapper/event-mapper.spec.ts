import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventMapper } from './event-mapper';

describe('EventMapper', () => {
  let component: EventMapper;
  let fixture: ComponentFixture<EventMapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventMapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventMapper);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
