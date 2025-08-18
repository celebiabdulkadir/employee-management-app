import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../src/components/listElements/pagination.js';

describe('Pagination', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(
      html`<pagination-component></pagination-component>`,
    );
  });

  it('renders with default properties', () => {
    expect(element.currentPage).to.equal(1);
    expect(element.totalPages).to.equal(1);
    expect(element.disabled).to.be.false;
    expect(element.visiblePages).to.equal(5);
  });

  it('renders pagination container', async () => {
    element.currentPage = 2;
    element.totalPages = 5;
    await element.updateComplete;

    const pagination = element.shadowRoot.querySelector('.pagination');
    expect(pagination).to.exist;
  });

  it('renders navigation buttons', async () => {
    element.totalPages = 5;
    await element.updateComplete;

    const buttons = element.shadowRoot.querySelectorAll('app-button');
    expect(buttons.length).to.be.greaterThan(0);
  });

  it('disables previous button on first page', async () => {
    element.currentPage = 1;
    element.totalPages = 5;
    await element.updateComplete;

    const buttons = element.shadowRoot.querySelectorAll('app-button');
    const prevButton = Array.from(buttons).find(btn =>
      btn.textContent.trim().includes('Previous'),
    );
    expect(prevButton.disabled).to.be.true;
  });

  it('disables next button on last page', async () => {
    element.currentPage = 5;
    element.totalPages = 5;
    await element.updateComplete;

    const buttons = element.shadowRoot.querySelectorAll('app-button');
    const nextButton = Array.from(buttons).find(btn =>
      btn.textContent.trim().includes('Next'),
    );
    expect(nextButton.disabled).to.be.true;
  });

  it('dispatches page-change event', async () => {
    element.totalPages = 5;
    await element.updateComplete;

    let eventFired = false;
    let eventDetail = null;

    element.addEventListener('page-change', e => {
      eventFired = true;
      eventDetail = e.detail;
    });

    const buttons = element.shadowRoot.querySelectorAll('app-button');
    const nextButton = Array.from(buttons).find(btn =>
      btn.textContent.trim().includes('Next'),
    );
    nextButton.dispatchEvent(
      new CustomEvent('app-button-click', { bubbles: true }),
    );

    expect(eventFired).to.be.true;
    expect(eventDetail.page).to.equal(2);
  });

  it('handles disabled state', async () => {
    element.disabled = true;
    await element.updateComplete;

    expect(element.disabled).to.be.true;
  });

  it('renders page buttons for multiple pages', async () => {
    element.currentPage = 3;
    element.totalPages = 10;
    await element.updateComplete;

    const buttons = element.shadowRoot.querySelectorAll('app-button');
    expect(buttons.length).to.be.greaterThan(2);
  });

  it('updates visible pages', async () => {
    element.visiblePages = 7;
    await element.updateComplete;

    expect(element.visiblePages).to.equal(7);
  });

  it('handles single page correctly', async () => {
    element.currentPage = 1;
    element.totalPages = 1;
    await element.updateComplete;

    const pagination = element.shadowRoot.querySelector('.pagination');
    expect(pagination).to.exist;
  });

  it('calculates page range for large page count', async () => {
    element.currentPage = 50;
    element.totalPages = 100;
    element.visiblePages = 5;
    await element.updateComplete;

    const buttons = element.shadowRoot.querySelectorAll('app-button');
    expect(buttons.length).to.be.greaterThan(2);
  });

  it('handles page navigation correctly', async () => {
    element.currentPage = 3;
    element.totalPages = 10;
    await element.updateComplete;

    let eventFired = false;
    element.addEventListener('page-change', () => {
      eventFired = true;
    });

    element.handlePageChange(5);
    expect(eventFired).to.be.true;
  });

  it('updates on locale change', async () => {
    window.dispatchEvent(new CustomEvent('locale-changed'));
    await element.updateComplete;

    const pagination = element.shadowRoot.querySelector('.pagination');
    expect(pagination).to.exist;
  });
});
