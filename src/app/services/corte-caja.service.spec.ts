/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CorteCajaService } from './corte-caja.service';

describe('Service: CorteCaja', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CorteCajaService]
    });
  });

  it('should ...', inject([CorteCajaService], (service: CorteCajaService) => {
    expect(service).toBeTruthy();
  }));
});
