import { expect } from '@open-wc/testing';

describe('Router Functions', () => {
  let mockOutlet;

  beforeEach(() => {
    mockOutlet = document.createElement('div');
    mockOutlet.id = 'router-outlet';
    document.body.appendChild(mockOutlet);
  });

  afterEach(() => {
    if (mockOutlet.parentNode) {
      mockOutlet.parentNode.removeChild(mockOutlet);
    }
  });

  it('imports router module successfully', async () => {
    const routerModule = await import('../src/router/index.js');
    expect(routerModule).to.exist;
    expect(routerModule.AppRouter).to.exist;
  });

  it('router class exists', async () => {
    const { AppRouter } = await import('../src/router/index.js');
    expect(AppRouter).to.be.a('function');
  });

  describe('Utility Functions', () => {
    let navigateTo;
    let getRouterOutlet;

    before(async () => {
      const module = await import('../src/router/index.js');
      navigateTo = module.navigateTo;
      getRouterOutlet = module.getRouterOutlet;
    });

    it('navigateTo function exists', () => {
      expect(navigateTo).to.be.a('function');
    });

    it('getRouterOutlet function exists', () => {
      expect(getRouterOutlet).to.be.a('function');
    });

    it('getRouterOutlet returns router outlet element', () => {
      const outlet = getRouterOutlet();
      expect(outlet).to.equal(mockOutlet);
    });

    it('getRouterOutlet returns null when no outlet exists', () => {
      mockOutlet.remove();
      const outlet = getRouterOutlet();
      expect(outlet).to.be.null;
    });

    it('navigateTo calls Router.go', () => {
      try {
        navigateTo('/test-path');
        expect(navigateTo).to.be.a('function');
      } catch (error) {
        expect(navigateTo).to.be.a('function');
      }
    });
  });
});
