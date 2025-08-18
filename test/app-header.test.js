import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../src/components/app-header.js';

describe('AppHeader', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<app-header></app-header>`);
  });

  it('renders header element', () => {
    const header = element.shadowRoot.querySelector('header');
    expect(header).to.exist;
  });

  it('renders header actions', () => {
    const headerActions = element.shadowRoot.querySelector('.header-actions');
    expect(headerActions).to.exist;
  });

  it('renders language switcher', () => {
    const languageSwitcher =
      element.shadowRoot.querySelector('language-switcher');
    expect(languageSwitcher).to.exist;
  });

  it('renders add employee button', () => {
    const addButton = element.shadowRoot.querySelector('app-button[icon="➕"]');
    expect(addButton).to.exist;
  });

  it('updates on locale change', async () => {
    window.dispatchEvent(new CustomEvent('locale-changed'));
    await element.updateComplete;

    const header = element.shadowRoot.querySelector('header');
    expect(header).to.exist;
  });
});
