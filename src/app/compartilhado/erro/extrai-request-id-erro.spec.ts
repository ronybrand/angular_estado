import { HttpErrorResponse } from '@angular/common/http';
import { extraiRequestIdErro } from './extrai-request-id-erro';

describe('extraiRequestIdErro', () => {
  it('should return the backend-provided requestId when present', () => {
    const error = new HttpErrorResponse({
      error: { message: 'Sigla já cadastrada.', requestId: '11111111-1111-4111-8111-111111111111' },
      status: 400,
    });

    expect(extraiRequestIdErro(error)).toBe('11111111-1111-4111-8111-111111111111');
  });

  it('should return null when the requestId is blank', () => {
    const error = new HttpErrorResponse({ error: { message: 'x', requestId: '   ' }, status: 400 });

    expect(extraiRequestIdErro(error)).toBeNull();
  });

  it('should return null when there is no error body', () => {
    const error = new HttpErrorResponse({ status: 0 });

    expect(extraiRequestIdErro(error)).toBeNull();
  });

  it('should return null when the error body is a plain string (network-level failure)', () => {
    const error = new HttpErrorResponse({ error: 'Failed to fetch', status: 0 });

    expect(extraiRequestIdErro(error)).toBeNull();
  });

  it('should return null when the requestId field is not a string', () => {
    const error = new HttpErrorResponse({ error: { requestId: 123 }, status: 500 });

    expect(extraiRequestIdErro(error)).toBeNull();
  });

  it('should return null when the requestId is not a valid UUID', () => {
    const error = new HttpErrorResponse({
      error: { message: 'x', requestId: '<script>alert(1)</script>' },
      status: 400,
    });

    expect(extraiRequestIdErro(error)).toBeNull();
  });

  it('should accept a valid UUID regardless of case', () => {
    const error = new HttpErrorResponse({
      error: { requestId: '11111111-AAAA-4bbb-8ccc-111111111111' },
      status: 400,
    });

    expect(extraiRequestIdErro(error)).toBe('11111111-AAAA-4bbb-8ccc-111111111111');
  });
});
