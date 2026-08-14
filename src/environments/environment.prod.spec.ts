import { environment } from './environment.prod';

describe('environment.prod', () => {
  it('should not point apiUrl at a local development host', () => {
    expect(environment.apiUrl).not.toMatch(/localhost|127\.0\.0\.1/);
  });

  it('should use a relative apiUrl so it works behind any production host/reverse proxy', () => {
    expect(environment.apiUrl).toBe('/api');
  });
});
