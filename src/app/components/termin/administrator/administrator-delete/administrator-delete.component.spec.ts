import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AdministratorDeleteComponent} from './administrator-delete.component';

describe('AdministratorDeleteComponent', () => {
  let component: AdministratorDeleteComponent;
  let fixture: ComponentFixture<AdministratorDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdministratorDeleteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministratorDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
