import {TestBed} from '@angular/core/testing';

import {CommentService} from './comment.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('CommentService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: CommentService = TestBed.get(CommentService);
    expect(service).toBeTruthy();
  });
});
