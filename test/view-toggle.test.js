import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../src/components/listElements/view-toggle.js';

describe('ViewToggle', () => {
  let element;

  beforeEach(async () => {
    localStorage.clear();
    element = await fixture(html`<view-toggle></view-toggle>`);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('has defaults', () => {
    expect(element.currentView).to.equal('table');
    expect(element.disabled).to.be.false;
    expect(element.views).to.have.length(2);
  });

  it('renders buttons', () => {
    const buttons = element.shadowRoot.querySelectorAll('app-button');
    expect(buttons).to.have.length(2);
  });

  it('shows labels', () => {
    const buttons = element.shadowRoot.querySelectorAll('app-button');
    expect(buttons[0].textContent.trim()).to.include('Table');
    expect(buttons[1].textContent.trim()).to.include('Card');
  });

  it('marks active view', () => {
    const buttons = element.shadowRoot.querySelectorAll('app-button');
    expect(buttons[0].active).to.be.true;
    expect(buttons[1].active).to.be.false;
  });

  it('fires view change', async () => {
    let eventDetail = null;
    element.addEventListener('view-change', e => {
      eventDetail = e.detail;
    });

    const cardButton = element.shadowRoot.querySelectorAll('app-button')[1];
    const buttonElement = cardButton.shadowRoot.querySelector('button');
    buttonElement.click();

    expect(eventDetail).to.exist;
    expect(eventDetail.view).to.equal('card');
  });

  it('does not fire event when clicking same view', async () => {
    let eventFired = false;
    element.addEventListener('view-change', () => {
      eventFired = true;
    });

    // Test the handleViewChange method directly
    element.handleViewChange('table'); // Same as current view

    expect(eventFired).to.be.false;
    expect(element.currentView).to.equal('table'); // Should remain unchanged
  });

  it('handles disabled state', async () => {
    element.disabled = true;
    await element.updateComplete;

    const buttons = element.shadowRoot.querySelectorAll('app-button');
    buttons.forEach(button => {
      expect(button.disabled).to.be.true;
    });
  });

  it('shows icons', () => {
    const buttons = element.shadowRoot.querySelectorAll('app-button');
    expect(buttons[0].icon).to.equal('📋');
    expect(buttons[1].icon).to.equal('🎯');
  });

  it('cleans up listeners', () => {
    element.disconnectedCallback();
    expect(element.localeChangeHandler).to.exist;
  });
});
