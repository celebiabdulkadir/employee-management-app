import { expect } from '@open-wc/testing';
import {
  getHtmlLang,
  setHtmlLang,
  getStoredLocale,
  setStoredLocale,
  getCurrentLocale,
} from '../src/localization/locale-utils.js';

describe('LocaleUtils', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'en';
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.lang = 'en';
  });

  it('getHtmlLang returns document language', () => {
    document.documentElement.lang = 'tr';
    expect(getHtmlLang()).to.equal('tr');
  });

  it('getHtmlLang returns default en when no lang set', () => {
    document.documentElement.lang = '';
    expect(getHtmlLang()).to.equal('en');
  });

  it('setHtmlLang updates document language', () => {
    setHtmlLang('tr');
    expect(document.documentElement.lang).to.equal('tr');
  });

  it('getStoredLocale returns null when no locale stored', () => {
    expect(getStoredLocale()).to.be.null;
  });

  it('setStoredLocale saves locale to localStorage', () => {
    setStoredLocale('tr');
    expect(localStorage.getItem('preferred-locale')).to.equal('tr');
  });

  it('getStoredLocale returns stored locale', () => {
    setStoredLocale('tr');
    expect(getStoredLocale()).to.equal('tr');
  });

  it('getCurrentLocale returns current locale', () => {
    const locale = getCurrentLocale();
    expect(locale).to.be.a('string');
    expect(['en', 'tr']).to.include(locale);
  });
});
