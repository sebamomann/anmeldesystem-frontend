import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LinkDataComponent} from './link-data.component';

describe('LinkDataComponent', () => {
  let component: LinkDataComponent;
  let fixture: ComponentFixture<LinkDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LinkDataComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
