import { TestBed } from '@angular/core/testing';

import { IndexedDBService } from './indexed-db.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';

describe('IndexedDBService', () => {
  let service: IndexedDBService;

  let indexedDbServiceMock: jest.Mocked<Partial<NgxIndexedDBService>> = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: NgxIndexedDBService, useValue: indexedDbServiceMock }],
    });
    service = TestBed.inject(IndexedDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
