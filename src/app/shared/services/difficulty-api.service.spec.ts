import { TestBed } from '@angular/core/testing';

import { DifficultyApiService } from './difficulty-api.service';

describe('DifficultyApiService', () => {
  let service: DifficultyApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DifficultyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
