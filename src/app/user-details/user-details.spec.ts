import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetails } from './user-details';

describe('UserDetails', () => {
  let component: UserDetails;
  let fixture: ComponentFixture<UserDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a readonly textarea for the JSON content', () => {
    component.user = { id: 1, name: 'Ada', role: 'Admin', status: 'Active' };
    component.jsonContent = JSON.stringify(component.user, null, 2);

    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('textarea');
    expect(textarea).not.toBeNull();
    expect(textarea.readOnly).toBeTrue();
    expect(textarea.value).toContain('"name": "Ada"');
  });
});
