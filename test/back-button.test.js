import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../src/components/buttons/back-button.js';

describe('BackButton', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<back-button></back-button>`);
  });

  it('renders back button', () => {
    const button = element.shadowRoot.querySelector('app-button');
    expect(button).to.exist;
  });

  it('has correct icon', () => {
    const button = element.shadowRoot.querySelector('app-button');
    expect(button.icon).to.equal('←');
  });

  it('has ghost variant', () => {
    const button = element.shadowRoot.querySelector('app-button');
    expect(button.variant).to.equal('ghost');
  });

  it('has small size', () => {
    const button = element.shadowRoot.querySelector('app-button');
    expect(button.size).to.equal('small');
  });

  it('has correct text property', async () => {
    element.text = 'Custom Back';
    await element.updateComplete;

    expect(element.text).to.equal('Custom Back');
  });

  it('has correct path property', async () => {
    element.path = '/custom';
    await element.updateComplete;

    expect(element.path).to.equal('/custom');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
