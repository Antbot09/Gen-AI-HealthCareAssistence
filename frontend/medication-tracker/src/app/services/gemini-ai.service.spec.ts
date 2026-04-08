import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GeminiAIService } from './gemini-ai.service';

describe('GeminiAIService', () => {
  let service: GeminiAIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GeminiAIService]
    });
    service = TestBed.inject(GeminiAIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});