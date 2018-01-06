import { TestBed, inject } from '@angular/core/testing';

import { RepertoireService } from './repertoire.service';

describe('RepertoireService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepertoireService]
    });
  });

  it('should be created', inject([RepertoireService], (service: RepertoireService) => {
    expect(service).toBeTruthy();
  }));
});
