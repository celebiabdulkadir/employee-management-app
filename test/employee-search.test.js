import { fixture, expect, oneEvent } from '@open-wc/testing';
import { html } from 'lit';
import '../src/components/listElements/employee-search.js';
import { setLocale } from '../src/localization/index.js';

describe('EmployeeSearch', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employee-search></employee-search>`);
    await setLocale('tr');
  });

  afterEach(() => {
    if (element.debounceTimer) {
      clearTimeout(element.debounceTimer);
    }
  });

  it('renders with default properties', () => {
    const input = element.shadowRoot.querySelector('.search-input');
    const clearButton = element.shadowRoot.querySelector('.clear-button');

    expect(input).to.exist;
    expect(input.value).to.equal('');
    expect(input.disabled).to.be.false;
    expect(clearButton.classList.contains('hidden')).to.be.true;
  });

  it('handles input changes and debounces events', async () => {
    const input = element.shadowRoot.querySelector('.search-input');
    const testValue = 'test search';

    setTimeout(() => {
      input.value = testValue;
      input.dispatchEvent(new Event('input'));
    }, 0);

    const { detail } = await oneEvent(element, 'search-input');
    expect(detail.value).to.equal(testValue);
    expect(element.value).to.equal(testValue);
  });

  it('clears search and dispatches event', async () => {
    element.value = 'test';
    await element.updateComplete;

    const clearButton = element.shadowRoot.querySelector('.clear-button');
    expect(clearButton.classList.contains('hidden')).to.be.false;

    setTimeout(() => clearButton.click(), 0);
    const { detail } = await oneEvent(element, 'search-input');
    expect(detail.value).to.equal('');
    expect(element.value).to.equal('');
    expect(clearButton.classList.contains('hidden')).to.be.true;
  });

  it('trims whitespace from input', async () => {
    const input = element.shadowRoot.querySelector('.search-input');

    setTimeout(() => {
      input.value = '  test  ';
      input.dispatchEvent(new Event('input'));
    }, 0);

    const { detail } = await oneEvent(element, 'search-input');
    expect(detail.value).to.equal('test');
  });

  it('handles disabled state', async () => {
    element.disabled = true;
    await element.updateComplete;

    const input = element.shadowRoot.querySelector('.search-input');
    const clearButton = element.shadowRoot.querySelector('.clear-button');
    expect(input.disabled).to.be.true;
    expect(clearButton.disabled).to.be.true;
  });
  it('cancels previous debounce timer on new input', async () => {
    const input = element.shadowRoot.querySelector('.search-input');

    input.value = 'first';
    input.dispatchEvent(new Event('input'));

    await new Promise(resolve => {
      setTimeout(resolve, 20);
    });

    const triggerSecondInput = () => {
      input.value = 'second';
      input.dispatchEvent(new Event('input'));
    };
    setTimeout(triggerSecondInput);

    const { detail } = await oneEvent(element, 'search-input');
    expect(detail.value).to.equal('second');
  });

  it('updates locale when locale changes', async () => {
    await setLocale('tr');
    window.dispatchEvent(new CustomEvent('locale-changed'));
    await element.updateComplete;

    const input = element.shadowRoot.querySelector('.search-input');
    expect(input.placeholder).to.exist;
  });
});
