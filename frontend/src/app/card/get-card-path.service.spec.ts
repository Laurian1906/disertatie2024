import { TestBed } from '@angular/core/testing';

import { GetCardPathService } from './get-card-path.service';

describe('GetCardPathService', () => {
  let service: GetCardPathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCardPathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
