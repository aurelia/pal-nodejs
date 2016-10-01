import { buildPal } from '../src/nodejs-pal-builder';

describe("pal-builder", () => {
  let pal;

  beforeEach(() => {
    pal = buildPal();
  });

  it('should be defined', () => {
    expect(pal.global).toBeDefined();
    expect(pal.platform).toBeDefined();
    expect(pal.dom).toBeDefined();
    expect(pal.feature).toBeDefined();
  });

  it('should ensure performance', () => {
    expect(pal.global.performance.now()).toBeGreaterThan(-1);
  });

  it('should enusre mutation observer is loaded', () => {
    expect(pal.dom.createMutationObserver).toBeDefined();
  });
});
