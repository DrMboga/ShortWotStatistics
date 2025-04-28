import { TestBed } from '@angular/core/testing';

import { WargamingApiService } from './wargaming-api.service';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('WargamingApiService', () => {
  let service: WargamingApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(WargamingApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
