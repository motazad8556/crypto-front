import { TestBed } from '@angular/core/testing';

import { OrderbookService } from './orderbook.service';

describe('OrderbookService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderbookService = TestBed.get(OrderbookService);
    expect(service).toBeTruthy();
  });
});
