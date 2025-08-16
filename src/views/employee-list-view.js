import { LitElement, html, css } from 'lit';
import { msg } from '../localization/index.js';

export class EmployeeListView extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 20px;
    }

    .view-header {
      margin-bottom: 24px;
    }

    .view-title {
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #333;
    }

    .view-subtitle {
      color: #666;
      margin: 0;
    }

    .placeholder {
      background: white;
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      border: 2px dashed #e0e0e0;
      color: #666;
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
      <div class="view-header">
        <h1 class="view-title">${msg('Employees')}</h1>
        <p class="view-subtitle">${msg('Manage your employee database')}</p>
      </div>

      <div class="placeholder">
        <p>${msg('Employee list component will be implemented here')}</p>
      </div>
    `;
  }
}

customElements.define('employee-list-view', EmployeeListView);
