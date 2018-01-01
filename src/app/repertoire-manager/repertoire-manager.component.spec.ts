import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepertoireManagerComponent } from './repertoire-manager.component';

describe('RepertoireManagerComponent', () => {
  let component: RepertoireManagerComponent;
  let fixture: ComponentFixture<RepertoireManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepertoireManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepertoireManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
