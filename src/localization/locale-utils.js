import { getLocale, setLocale } from './messages.js';

export function getHtmlLang() {
  return document.documentElement.lang || 'en';
}

export function setHtmlLang(locale) {
  document.documentElement.lang = locale;
}

export function initializeLocale() {
  const htmlLang = getHtmlLang();
  const supportedLocales = ['en', 'tr'];

  const targetLocale = supportedLocales.includes(htmlLang) ? htmlLang : 'en';

  if (getLocale() !== targetLocale) {
    setLocale(targetLocale).then(() => {
      setHtmlLang(targetLocale);
    });
  }
}

export function switchLocale(newLocale) {
  setLocale(newLocale).then(() => {
    setHtmlLang(newLocale);
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
