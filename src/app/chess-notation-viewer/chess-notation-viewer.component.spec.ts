import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChessNotationViewerComponent } from './chess-notation-viewer.component';

describe('ChessNotationViewerComponent', () => {
  let component: ChessNotationViewerComponent;
  let fixture: ComponentFixture<ChessNotationViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChessNotationViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChessNotationViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
