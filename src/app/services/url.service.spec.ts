import {TestBed} from '@angular/core/testing';

import {UrlService} from './url.service';
import {WINDOW_PROVIDERS} from '../provider/window.provider';

describe('UrlService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    providers: [WINDOW_PROVIDERS]
  }));

  it('should be created', () => {
    const service: UrlService = TestBed.get(UrlService);
    expect(service).toBeTruthy();
  });
});
