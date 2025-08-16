import { LitElement, html, css } from 'lit';
import { msg } from '../localization/index.js';
import './language-switcher.js';

export class AppHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      background-color: #1976d2;
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .app-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
      color: white;
      text-decoration: none;
    }

    .navigation {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .nav-links {
      display: flex;
      gap: 20px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      padding: 8px 12px;
      border-radius: 4px;
      transition: background-color 0.3s ease;
      font-weight: 500;
    }

    .nav-link:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-link.active {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    language-switcher {
      --language-button-bg: rgba(255, 255, 255, 0.1);
      --language-button-border: rgba(255, 255, 255, 0.3);
      --language-button-color: white;
      --language-button-active-bg: rgba(255, 255, 255, 0.9);
      --language-button-active-color: #1976d2;
    }

    @media (max-width: 768px) {
      .header-container {
        padding: 0 16px;
        height: 56px;
      }

      .app-title {
        font-size: 18px;
      }

      .nav-links {
        display: none;
      }
    }
  `;

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

  render() {
    return html`
      <header>
        <div class="header-container">
          <div class="logo-section">
            <a href="/" class="app-title">${msg('Employee Management')}</a>
          </div>

          <nav class="navigation">
            <ul class="nav-links">
              <li>
                <a href="/" class="nav-link">${msg('Employees')}</a>
              </li>
              <li>
                <a href="/add" class="nav-link">${msg('Add Employee')}</a>
              </li>
            </ul>
          </nav>

          <div class="header-actions">
            <language-switcher></language-switcher>
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define('app-header', AppHeader);
