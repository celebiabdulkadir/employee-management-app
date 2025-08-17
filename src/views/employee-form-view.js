import { LitElement, html, css } from 'lit';
import { msg } from '../localization/index.js';
import '../components/buttons/back-button.js';
import '../components/employee-form.js';

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

    back-button {
      margin-bottom: 16px;
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
        <back-button
          path="/"
          text=${msg('Back to Employee List')}
        ></back-button>
        <h1 class="view-title">${title}</h1>
        <p class="view-subtitle">${subtitle}</p>
      </div>

      <employee-form
        .employeeId=${this.employeeId}
        .isEdit=${this.isEdit}
      ></employee-form>
    `;
  }
}

customElements.define('employee-form-view', EmployeeFormView);
