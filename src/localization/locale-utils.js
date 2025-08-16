import { getLocale, setLocale } from './messages.js';

const LOCALE_STORAGE_KEY = 'preferred-locale';

export function getHtmlLang() {
  return document.documentElement.lang || 'en';
}

export function setHtmlLang(locale) {
  document.documentElement.lang = locale;
}

export function getStoredLocale() {
  return localStorage.getItem(LOCALE_STORAGE_KEY);
}

export function setStoredLocale(locale) {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}

export function initializeLocale() {
  // Priority: stored locale > HTML lang > default 'en'
  const storedLocale = getStoredLocale();
  const htmlLang = getHtmlLang();
  const supportedLocales = ['en', 'tr'];

  let targetLocale = 'en';

  if (storedLocale && supportedLocales.includes(storedLocale)) {
    targetLocale = storedLocale;
  } else if (supportedLocales.includes(htmlLang)) {
    targetLocale = htmlLang;
  }

  if (getLocale() !== targetLocale) {
    setLocale(targetLocale).then(() => {
      setHtmlLang(targetLocale);
      setStoredLocale(targetLocale);
    });
  }
}

export function switchLocale(newLocale) {
  setLocale(newLocale).then(() => {
    setHtmlLang(newLocale);
    setStoredLocale(newLocale); // Store the selected locale
    window.dispatchEvent(
      new CustomEvent('locale-changed', {
        detail: { locale: newLocale },
      }),
    );
  });
}

export function getCurrentLocale() {
  return getLocale();
}
