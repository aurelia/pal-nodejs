import { initialize } from '../src/index';
import { PLATFORM } from 'aurelia-pal';

initialize();

describe('NodeJs Platform', () => {
  it('addEventListener is defined', () => {
    expect(PLATFORM.addEventListener).toBeDefined();
  });
  it('removeEventListener is defined', () => {
    expect(PLATFORM.removeEventListener).toBeDefined();
  });
  it('global is defined', () => {
    expect(PLATFORM.global).toBeDefined();
  });
  it('history is defined', () => {
    expect(PLATFORM.history).toBeDefined();
  });
  it('location is defined', () => {
    expect(PLATFORM.location).toBeDefined();
  });
  it('noop is defined', () => {
    expect(PLATFORM.noop).toBeDefined();
  });
  it('performance is defined', () => {
    expect(PLATFORM.performance).toBeDefined();
  });
  it('XMLHttpRequest is defined', () => {
    expect(PLATFORM.XMLHttpRequest).toBeDefined();
  });
  it('requestAnimationFrame is defined', () => {
    expect(PLATFORM.requestAnimationFrame).toBeDefined();
  });
  it('eachModule is defined', () => {
    expect(PLATFORM.eachModule).toBeDefined();
  });
});
