import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { msg } from '../localization/index.js';
import './language-switcher.js';
import './buttons/app-button.js';

export class AppHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      background: #f5f5f5;
      color: #333;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .header-container {
      margin: 0 auto;
      padding: 0 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
      min-width: 0;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
      min-width: 0;
    }

    .logo-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
      color: white;
    }

    .app-title {
      font-size: 18px;
      font-weight: 700;
      margin: 0;
      color: #ff6200;
      text-decoration: none;
      letter-spacing: -0.5px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .navigation {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-links {
      display: flex;
      gap: 8px;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-button {
      --app-button-bg: #ff6200;
      --app-button-border: #ff6200;
      --app-button-color: white;
      --app-button-hover-bg: #e55a00;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    language-switcher {
      --language-button-bg: transparent;
      --language-button-border: #ff6200;
      --language-button-color: #ff6200;
      --language-button-active-bg: #ff6200;
      --language-button-active-color: white;
    }

    @media (max-width: 768px) {
      .header-container {
        padding: 0 8px;
        height: 60px;
      }

      .logo-section {
        gap: 6px;
      }

      .logo-icon {
        width: 28px;
        height: 28px;
        font-size: 14px;
      }

      .app-title {
        font-size: 16px;
        max-width: 120px;
      }

      .header-actions {
        gap: 6px;
      }
    }

    @media (max-width: 480px) {
      .header-container {
        padding: 0 6px;
        height: 56px;
      }

      .logo-section {
        gap: 4px;
        max-width: 50%;
      }

      .logo-icon {
        width: 24px;
        height: 24px;
        font-size: 12px;
      }

      .app-title {
        font-size: 14px;
        max-width: 100px;
      }

      .header-actions {
        gap: 4px;
      }

      .nav-button {
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

  // eslint-disable-next-line class-methods-use-this
  handleAddNew() {
    Router.go('/add');
  }

  render() {
    return html`
      <header>
        <div class="header-container">
          <div class="logo-section">
            <div class="logo-icon">📊</div>
          </div>

          <div class="header-actions">
            <app-button
              variant="secondary"
              size="small"
              class="nav-button"
              icon="👤"
              @app-button-click=${() => {
                window.location.href = '/';
              }}
            >
              ${msg('Employees')}
            </app-button>

            <app-button
              variant="secondary"
              size="small"
              icon="➕"
              @app-button-click=${this.handleAddNew}
            >
              ${msg('Add New')}
            </app-button>
            <language-switcher></language-switcher>
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define('app-header', AppHeader);
