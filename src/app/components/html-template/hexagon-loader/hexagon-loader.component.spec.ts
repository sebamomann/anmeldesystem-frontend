import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HexagonLoaderComponent} from './hexagon-loader.component';

describe('HexagonLoaderComponent', () => {
  let component: HexagonLoaderComponent;
  let fixture: ComponentFixture<HexagonLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HexagonLoaderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HexagonLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
