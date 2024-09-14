import { TestBed } from '@angular/core/testing';

import { MakeHttpRequestService } from './make-http-request.service';

describe('MakeHttpRequestService', () => {
  let service: MakeHttpRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MakeHttpRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
