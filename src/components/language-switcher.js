import { LitElement, html, css } from 'lit';
import { msg, switchLocale, getCurrentLocale } from '../localization/index.js';

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
      gap: 8px;
      align-items: center;
    }

    .language-button {
      background: none;
      border: 2px solid #e0e0e0;
      border-radius: 4px;
      padding: 6px 12px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s ease;
      color: #666;
      font-weight: 500;
    }

    .language-button:hover {
      border-color: #1976d2;
      color: #1976d2;
      background-color: #f5f5f5;
    }

    .language-button.active {
      background-color: #1976d2;
      border-color: #1976d2;
      color: white;
    }

    .language-button.active:hover {
      background-color: #1565c0;
      border-color: #1565c0;
    }

    .separator {
      color: #ccc;
      margin: 0 4px;
    }
  `;

  handleLanguageChange(locale) {
    if (locale !== this.currentLocale) {
      switchLocale(locale);
    }
  }

  render() {
    return html`
      <button
        class="language-button ${this.currentLocale === 'en' ? 'active' : ''}"
        @click=${() => this.handleLanguageChange('en')}
        title=${msg('Switch to English')}
      >
        EN
      </button>
      <span class="separator">|</span>
      <button
        class="language-button ${this.currentLocale === 'tr' ? 'active' : ''}"
        @click=${() => this.handleLanguageChange('tr')}
        title=${msg('Switch to Turkish')}
      >
        TR
      </button>
    `;
  }
}

customElements.define('language-switcher', LanguageSwitcher);
