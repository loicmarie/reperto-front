import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantManagerComponent } from './variant-manager.component';

describe('VariantManagerComponent', () => {
  let component: VariantManagerComponent;
  let fixture: ComponentFixture<VariantManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariantManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
