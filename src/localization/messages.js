import { configureLocalization } from '@lit/localize';

export const { getLocale, setLocale } = configureLocalization({
  sourceLocale: 'en',
  targetLocales: ['tr'],
  loadLocale: locale => import(`./locales/${locale}.js`),
});

export { msg } from '@lit/localize';
