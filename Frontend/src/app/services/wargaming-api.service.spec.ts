import { TestBed } from '@angular/core/testing';

import { WargamingApiService } from './wargaming-api.service';

describe('WargamingApiService', () => {
  let service: WargamingApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WargamingApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
