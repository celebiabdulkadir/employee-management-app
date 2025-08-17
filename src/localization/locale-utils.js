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

export async function initializeLocale() {
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
    try {
      await setLocale(targetLocale);
      setHtmlLang(targetLocale);
      setStoredLocale(targetLocale);
      window.dispatchEvent(
        new CustomEvent('locale-changed', {
          detail: { locale: targetLocale },
        }),
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error initializing locale:', error);
    }
  } else {
    setStoredLocale(targetLocale);
    window.dispatchEvent(
      new CustomEvent('locale-changed', {
        detail: { locale: targetLocale },
      }),
    );
  }
}

export async function switchLocale(newLocale) {
  try {
    await setLocale(newLocale);
    setHtmlLang(newLocale);
    setStoredLocale(newLocale);
    window.dispatchEvent(
      new CustomEvent('locale-changed', {
        detail: { locale: newLocale },
      }),
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error switching locale:', error);
  }
}

export function getCurrentLocale() {
  return getLocale();
}
