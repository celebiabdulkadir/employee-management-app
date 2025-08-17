import { LitElement, html, css } from 'lit';
import { msg, switchLocale, getCurrentLocale } from '../localization/index.js';
import './buttons/app-button.js';

export class LanguageSwitcher extends LitElement {
  static properties = {
    currentLocale: { type: String },
  };

  constructor() {
    super();
    this.currentLocale = getCurrentLocale();
  }

  connectedCallback() {
    super.connectedCallback();
    this.localeChangeHandler = () => {
      this.currentLocale = getCurrentLocale();
      this.requestUpdate();
    };
    window.addEventListener('locale-changed', this.localeChangeHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('locale-changed', this.localeChangeHandler);
  }

  static styles = css`
    :host {
      display: flex;
      gap: 4px;
      align-items: center;
    }
  `;

  handleLanguageChange(locale) {
    if (locale !== this.currentLocale) {
      switchLocale(locale);
    }
  }

  render() {
    return html`
      <app-button
        variant="ghost"
        size="small"
        ?active=${this.currentLocale === 'en'}
        @app-button-click=${() => this.handleLanguageChange('en')}
        title=${msg('Switch to English')}
      >
        EN
      </app-button>
      <app-button
        variant="ghost"
        size="small"
        ?active=${this.currentLocale === 'tr'}
        @app-button-click=${() => this.handleLanguageChange('tr')}
        title=${msg('Switch to Turkish')}
      >
        TR
      </app-button>
    `;
  }
}

customElements.define('language-switcher', LanguageSwitcher);
