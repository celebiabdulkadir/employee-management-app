import { LitElement, html, css } from 'lit';
import { initializeLocale } from './localization/index.js';
import { AppRouter } from './router/index.js';
import './components/app-header.js';

// Initialize on app startup
initializeLocale();

class EmployeeManagementApp extends LitElement {
  static properties = {
    header: { type: String },
  };

  constructor() {
    super();
    this.router = null;
    this.header = 'My app';
  }

  firstUpdated() {
    const outlet = this.shadowRoot.querySelector('#router-outlet');
    this.router = new AppRouter(outlet);
  }

  connectedCallback() {
    super.connectedCallback();
    this.localeChangeHandler = () => {
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
      display: block;
      min-height: 100vh;
      background-color: #f5f5f5;
      font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
        Cantarell, sans-serif;
      font-size: 14px;
    }

    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    #router-outlet {
      flex: 1;
      padding: 16px 12px;
      margin: 0 auto;
      width: 100%;
      box-sizing: border-box;
    }

    @media (max-width: 768px) {
      #router-outlet {
        padding: 12px 8px;
      }
    }
  `;

  render() {
    return html`
      <div class="app-container">
        <app-header></app-header>
        <div id="router-outlet"></div>
      </div>
    `;
  }
}

customElements.define('employee-management-app', EmployeeManagementApp);
