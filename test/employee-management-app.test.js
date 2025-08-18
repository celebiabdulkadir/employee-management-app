import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../src/employee-management-app.js';

describe('EmployeeManagementApp', () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<employee-management-app></employee-management-app>`,
    );
  });

  it('renders the app container', async () => {
    await new Promise(resolve => {
      setTimeout(() => resolve(), 100);
    });
    await element.updateComplete;
    const container = element.shadowRoot.querySelector('.app-container');
    expect(container).to.exist;
  });

  it('renders app header component', async () => {
    await new Promise(resolve => {
      setTimeout(() => resolve(), 100);
    });
    await element.updateComplete;
    const header = element.shadowRoot.querySelector('app-header');
    expect(header).to.exist;
  });

  it('renders router outlet', async () => {
    await new Promise(resolve => {
      setTimeout(() => resolve(), 100);
    });
    await element.updateComplete;
    const outlet = element.shadowRoot.querySelector('#router-outlet');
    expect(outlet).to.exist;
  });

  it.skip('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
