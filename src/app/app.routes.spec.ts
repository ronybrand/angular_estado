import { routes } from './app.routes';

describe('app.routes', () => {
  it('redirects /ask-ai to /perguntar-ia with the English language param', () => {
    const askAiRoute = routes.find((route) => route.path === 'ask-ai');

    expect(askAiRoute).toBeTruthy();
    expect(typeof askAiRoute?.redirectTo).toBe('function');
    const redirectFn = askAiRoute?.redirectTo as () => string;
    expect(redirectFn()).toBe('/perguntar-ia?lang=en');
  });
});
