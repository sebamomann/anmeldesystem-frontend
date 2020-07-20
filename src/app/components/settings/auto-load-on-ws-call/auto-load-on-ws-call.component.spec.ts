import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AutoLoadOnWsCallComponent} from './auto-load-on-ws-call.component';

describe('AutoLoadOnWsCallComponent', () => {
  let component: AutoLoadOnWsCallComponent;
  let fixture: ComponentFixture<AutoLoadOnWsCallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AutoLoadOnWsCallComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoLoadOnWsCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
