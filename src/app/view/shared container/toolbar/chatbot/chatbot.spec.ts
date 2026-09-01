import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chatbot } from './chatbot';

describe('Chatbot', () => {
  let component: Chatbot;
  let fixture: ComponentFixture<Chatbot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chatbot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Chatbot);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the response immediately', () => {
    component.message = 'hello';

    component.sendMessage();
    expect(component.messages.length).toBe(2);
    expect(component.isTyping).toBeFalse();
    expect(component.messages.length).toBe(3);
  });
});
