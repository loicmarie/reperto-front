import { TestBed, inject } from '@angular/core/testing';

import { TrainingSessionService } from './training-session.service';

describe('TrainingSessionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrainingSessionService]
    });
  });

  it('should be created', inject([TrainingSessionService], (service: TrainingSessionService) => {
    expect(service).toBeTruthy();
  }));
});
