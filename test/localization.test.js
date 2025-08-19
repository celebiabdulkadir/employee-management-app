import { expect } from '@open-wc/testing';
import { getCurrentLocale, msg } from '../src/localization/index.js';

describe('Localization', () => {
  it('getCurrentLocale returns a string', () => {
    const locale = getCurrentLocale();
    expect(locale).to.be.a('string');
    expect(['en', 'tr']).to.include(locale);
  });

  it('msg function returns a string', () => {
    const message = msg('Test message');
    expect(message).to.be.a('string');
  });

  it('msg function handles empty input', () => {
    const message = msg('');
    expect(message).to.be.a('string');
  });

  it('msg function handles basic strings', () => {
    const message = msg('Hello');
    expect(message).to.be.a('string');
    expect(message.length).to.be.greaterThan(0);
  });

  it('msg function works with common keys', () => {
    const messages = [
      msg('Add New'),
      msg('Edit'),
      msg('Delete'),
      msg('Save'),
      msg('Cancel'),
    ];

    messages.forEach(message => {
      expect(message).to.be.a('string');
      expect(message.length).to.be.greaterThan(0);
    });
  });

  it('getCurrentLocale is consistent', () => {
    const locale1 = getCurrentLocale();
    const locale2 = getCurrentLocale();
    expect(locale1).to.equal(locale2);
  });
});
