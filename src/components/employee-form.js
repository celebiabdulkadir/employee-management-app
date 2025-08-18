import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { msg } from '../localization/index.js';
import { employeeStore } from '../employee-store.js';
import './buttons/app-button.js';

export class EmployeeForm extends LitElement {
  static properties = {
    employeeId: { type: String },
    isEdit: { type: Boolean },
    formData: { type: Object },
    errors: { type: Object },
    isSubmitting: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
      max-width: 800px;
      margin: 0 auto;
    }

    .form-container {
      background: white;
      border-radius: 8px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-label {
      font-weight: 500;
      margin-bottom: 8px;
      color: #333;
      font-size: 14px;
    }

    .form-label.required::after {
      content: ' *';
      color: #c63f19;
    }

    .form-input,
    .form-select {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: #c63f19;
      box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
    }

    .form-input.error,
    .form-select.error {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e9ecef;
    }

    .success-message {
      background: #d4edda;
      color: #155724;
      padding: 12px 16px;
      border-radius: 6px;
      margin-bottom: 24px;
      border: 1px solid #c3e6cb;
    }

    @media (max-width: 768px) {
      .form-container {
        padding: 24px 16px;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 16px;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `;

  constructor() {
    super();
    this.employeeId = null;
    this.isEdit = false;
    this.formData = this.getEmptyFormData();
    this.errors = {};
    this.isSubmitting = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.localeChangeHandler = () => {
      this.requestUpdate();
    };
    window.addEventListener('locale-changed', this.localeChangeHandler);

    if (this.employeeId) {
      this.loadEmployee();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('locale-changed', this.localeChangeHandler);
  }

  // eslint-disable-next-line class-methods-use-this
  getEmptyFormData() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfEmployment: '',
      dateOfBirth: '',
      department: '',
      position: '',
    };
  }

  loadEmployee() {
    const employee = employeeStore.getById(this.employeeId);
    if (employee) {
      this.formData = { ...employee };
      this.isEdit = true;
    } else {
      Router.go('/');
    }
    this.requestUpdate();
  }

  handleInputChange(field, value) {
    this.formData = {
      ...this.formData,
      [field]: value,
    };

    if (this.errors[field]) {
      this.errors = {
        ...this.errors,
        [field]: null,
      };
      this.requestUpdate();
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.isSubmitting = true;
    this.errors = {};

    try {
      if (this.isEdit) {
        employeeStore.update(this.employeeId, this.formData);
      } else {
        employeeStore.add(this.formData);
      }

      this.showSuccessAndRedirect();
    } catch (error) {
      this.isSubmitting = false;
      const errorData = JSON.parse(error.message);
      this.errors = errorData;
      this.requestUpdate();
    }
  }

  showSuccessAndRedirect() {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = this.isEdit
      ? msg('Employee updated successfully!')
      : msg('Employee added successfully!');

    this.shadowRoot.querySelector('.form-container').prepend(successDiv);

    setTimeout(() => {
      Router.go('/');
    }, 1500);
  }

  // eslint-disable-next-line class-methods-use-this
  handleCancel() {
    Router.go('/');
  }

  render() {
    return html`
      <div class="form-container">
        <form @submit=${this.handleSubmit}>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label required">${msg('First Name')}</label>
              <input
                type="text"
                class="form-input ${this.errors.firstName ? 'error' : ''}"
                .value=${this.formData.firstName}
                @input=${e =>
                  this.handleInputChange('firstName', e.target.value)}
                placeholder=${msg('Enter first name')}
                ?disabled=${this.isSubmitting}
              />
              ${this.errors.firstName
                ? html`
                    <span class="error-message">${this.errors.firstName}</span>
                  `
                : ''}
            </div>

            <div class="form-group">
              <label class="form-label required">${msg('Last Name')}</label>
              <input
                type="text"
                class="form-input ${this.errors.lastName ? 'error' : ''}"
                .value=${this.formData.lastName}
                @input=${e =>
                  this.handleInputChange('lastName', e.target.value)}
                placeholder=${msg('Enter last name')}
                ?disabled=${this.isSubmitting}
              />
              ${this.errors.lastName
                ? html`
                    <span class="error-message">${this.errors.lastName}</span>
                  `
                : ''}
            </div>

            <div class="form-group">
              <label class="form-label required">${msg('Email')}</label>
              <input
                type="email"
                class="form-input ${this.errors.email ? 'error' : ''}"
                .value=${this.formData.email}
                @input=${e => this.handleInputChange('email', e.target.value)}
                placeholder=${msg('Enter email address')}
                ?disabled=${this.isSubmitting}
              />
              ${this.errors.email
                ? html`
                    <span class="error-message">${this.errors.email}</span>
                  `
                : ''}
            </div>

            <div class="form-group">
              <label class="form-label required">${msg('Phone')}</label>
              <input
                type="tel"
                class="form-input ${this.errors.phone ? 'error' : ''}"
                .value=${this.formData.phone}
                @input=${e => this.handleInputChange('phone', e.target.value)}
                placeholder="+1234567890"
                ?disabled=${this.isSubmitting}
              />
              ${this.errors.phone
                ? html`
                    <span class="error-message">${this.errors.phone}</span>
                  `
                : ''}
            </div>

            <div class="form-group">
              <label class="form-label required"
                >${msg('Date of Employment')}</label
              >
              <input
                type="date"
                class="form-input ${this.errors.dateOfEmployment
                  ? 'error'
                  : ''}"
                .value=${this.formData.dateOfEmployment}
                @input=${e =>
                  this.handleInputChange('dateOfEmployment', e.target.value)}
                ?disabled=${this.isSubmitting}
              />
              ${this.errors.dateOfEmployment
                ? html`
                    <span class="error-message"
                      >${this.errors.dateOfEmployment}</span
                    >
                  `
                : ''}
            </div>

            <div class="form-group">
              <label class="form-label required">${msg('Date of Birth')}</label>
              <input
                type="date"
                class="form-input ${this.errors.dateOfBirth ? 'error' : ''}"
                .value=${this.formData.dateOfBirth}
                @input=${e =>
                  this.handleInputChange('dateOfBirth', e.target.value)}
                ?disabled=${this.isSubmitting}
              />
              ${this.errors.dateOfBirth
                ? html`
                    <span class="error-message"
                      >${this.errors.dateOfBirth}</span
                    >
                  `
                : ''}
            </div>

            <div class="form-group">
              <label class="form-label required">${msg('Department')}</label>
              <select
                class="form-select ${this.errors.department ? 'error' : ''}"
                .value=${this.formData.department}
                @change=${e =>
                  this.handleInputChange('department', e.target.value)}
                ?disabled=${this.isSubmitting}
              >
                <option value="">${msg('Select department')}</option>
                <option value="Analytics">Analytics</option>
                <option value="Tech">Tech</option>
              </select>
              ${this.errors.department
                ? html`
                    <span class="error-message">${this.errors.department}</span>
                  `
                : ''}
            </div>

            <div class="form-group">
              <label class="form-label required">${msg('Position')}</label>
              <select
                class="form-select ${this.errors.position ? 'error' : ''}"
                .value=${this.formData.position}
                @change=${e =>
                  this.handleInputChange('position', e.target.value)}
                ?disabled=${this.isSubmitting}
              >
                <option value="">${msg('Select position')}</option>
                <option value="Junior">Junior</option>
                <option value="Medior">Medior</option>
                <option value="Senior">Senior</option>
              </select>
              ${this.errors.position
                ? html`
                    <span class="error-message">${this.errors.position}</span>
                  `
                : ''}
            </div>
          </div>

          <div class="form-actions">
            <app-button
              variant="ghost"
              @app-button-click=${this.handleCancel}
              ?disabled=${this.isSubmitting}
            >
              ${msg('Cancel')}
            </app-button>
            <app-button
              variant="primary"
              @app-button-click=${this.handleSubmit}
              ?loading=${this.isSubmitting}
              ?disabled=${this.isSubmitting}
            >
              ${this.isEdit ? msg('Update') : msg('Add')}
            </app-button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);
