import { LitElement, html, css } from 'lit';
import { msg } from '../localization/index.js';

export class EmployeeFormView extends LitElement {
  static properties = {
    employeeId: { type: String },
    isEdit: { type: Boolean },
  };

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

  constructor() {
    super();
    this.employeeId = null;
    this.isEdit = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.localeChangeHandler = () => {
      this.requestUpdate();
    };
    window.addEventListener('locale-changed', this.localeChangeHandler);

    // Check if we're in edit mode based on the route
    const path = window.location.pathname;
    if (path.startsWith('/edit/')) {
      const [, , employeeId] = path.split('/');
      this.employeeId = employeeId;
      this.isEdit = true;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('locale-changed', this.localeChangeHandler);
  }

  render() {
    const title = this.isEdit ? msg('Edit Employee') : msg('Add Employee');
    const subtitle = this.isEdit
      ? msg('Update employee information')
      : msg('Enter new employee details');

    return html`
      <div class="view-header">
        <h1 class="view-title">${title}</h1>
        <p class="view-subtitle">${subtitle}</p>
      </div>

      <div class="placeholder">
        <p>${msg('Employee form component will be implemented here')}</p>
        ${this.isEdit ? html`<p>Employee ID: ${this.employeeId}</p>` : ''}
      </div>
    `;
  }
}

customElements.define('employee-form-view', EmployeeFormView);
