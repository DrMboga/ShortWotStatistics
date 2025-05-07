import { TestBed } from '@angular/core/testing';

import { PlayerHistoryService } from './player-history.service';

describe('PlayerHistoryService', () => {
  let service: PlayerHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
