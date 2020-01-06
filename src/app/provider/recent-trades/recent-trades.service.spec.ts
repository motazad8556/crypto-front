import { TestBed } from '@angular/core/testing';

import { RecentTradesService } from './recent-trades.service';

describe('RecentTradesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecentTradesService = TestBed.get(RecentTradesService);
    expect(service).toBeTruthy();
  });
});
