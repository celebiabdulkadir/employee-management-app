import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../src/components/buttons/app-button.js';

describe('AppButton', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<app-button>Test Button</app-button>`);
  });

  it('has default properties', () => {
    expect(element.variant).to.equal('primary');
    expect(element.size).to.equal('medium');
    expect(element.disabled).to.be.false;
    expect(element.loading).to.be.false;
    expect(element.active).to.be.false;
    expect(element.iconOnly).to.be.false;
  });

  it('renders button', () => {
    const button = element.shadowRoot.querySelector('button');
    expect(button).to.exist;
  });

  it('shows text content', () => {
    const buttonText = element.shadowRoot.querySelector('.button-text');
    expect(buttonText).to.exist;
  });

  it('changes variant', async () => {
    element.variant = 'secondary';
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('button');
    expect(button.classList.contains('button--secondary')).to.be.true;
  });

  it('changes size', async () => {
    element.size = 'large';
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('button');
    expect(button.classList.contains('button--large')).to.be.true;
  });

  it('disables correctly', async () => {
    element.disabled = true;
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('button');
    expect(button.disabled).to.be.true;
  });

  it('shows loading state', async () => {
    element.loading = true;
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('button');
    const spinner = element.shadowRoot.querySelector('.spinner');
    expect(button.classList.contains('button--loading')).to.be.true;
    expect(spinner).to.exist;
  });

  it('becomes active', async () => {
    element.active = true;
    await element.updateComplete;
    const button = element.shadowRoot.querySelector('button');
    expect(button.classList.contains('active')).to.be.true;
  });

  it('shows icon', async () => {
    element.icon = '✓';
    await element.updateComplete;
    const icon = element.shadowRoot.querySelector('.button-icon');
    expect(icon).to.exist;
    expect(icon.textContent).to.equal('✓');
  });

  it('positions icon right', async () => {
    element.icon = '✓';
    element.iconPosition = 'right';
    await element.updateComplete;
    const icon = element.shadowRoot.querySelector('.button-icon--right');
    expect(icon).to.exist;
  });

  it('hides text when icon only', async () => {
    element.iconOnly = true;
    await element.updateComplete;
    const buttonText = element.shadowRoot.querySelector('.button-text');
    expect(buttonText).to.not.exist;
  });

  it('fires click event', async () => {
    let eventFired = false;
    element.addEventListener('app-button-click', () => {
      eventFired = true;
    });

    const button = element.shadowRoot.querySelector('button');
    button.click();
    expect(eventFired).to.be.true;
  });

  it('blocks clicks when disabled', async () => {
    element.disabled = true;
    await element.updateComplete;

    let eventFired = false;
    element.addEventListener('app-button-click', () => {
      eventFired = true;
    });

    const button = element.shadowRoot.querySelector('button');
    button.click();
    expect(eventFired).to.be.false;
  });

  it('blocks clicks when loading', async () => {
    element.loading = true;
    await element.updateComplete;

    let eventFired = false;
    element.addEventListener('app-button-click', () => {
      eventFired = true;
    });

    const button = element.shadowRoot.querySelector('button');
    button.click();
    expect(eventFired).to.be.false;
  });

  it('goes full width', async () => {
    element.fullWidth = true;
    await element.updateComplete;
    expect(element.fullWidth).to.be.true;
  });

  it('passes a11y', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it('works with danger variant', async () => {
    element.variant = 'danger';
    await element.updateComplete;

    const button = element.shadowRoot.querySelector('button');
    expect(button.classList.contains('button--danger')).to.be.true;
  });

  it('works with success variant', async () => {
    element.variant = 'success';
    await element.updateComplete;

    const button = element.shadowRoot.querySelector('button');
    expect(button.classList.contains('button--success')).to.be.true;
  });

  it('works with link variant', async () => {
    element.variant = 'link';
    await element.updateComplete;

    const button = element.shadowRoot.querySelector('button');
    expect(button.classList.contains('button--link')).to.be.true;
  });
});
