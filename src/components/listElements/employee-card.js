import { LitElement, html, css } from 'lit';
import { msg } from '../../localization/index.js';
import '../buttons/app-button.js';

export class EmployeeCard extends LitElement {
  static properties = {
    employee: { type: Object },
    selected: { type: Boolean },
    showActions: { type: Boolean },
  };

  constructor() {
    super();
    this.employee = null;
    this.selected = false;
    this.showActions = true;
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
    }

    .employee-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      border: 2px solid transparent;
      position: relative;
    }

    .employee-card:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
    }

    .employee-card.selected {
      border-color: #ff6b35;
      background: #fff8f5;
      box-shadow: 0 4px 16px rgba(255, 107, 53, 0.2);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .employee-name {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0 0 4px 0;
    }

    .employee-title {
      font-size: 14px;
      color: #666;
      margin: 0;
    }

    .checkbox {
      width: 18px;
      height: 18px;
      cursor: pointer;
      margin: 0;
    }

    .card-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px 24px;
      margin-bottom: 20px;
    }

    .field-group {
      display: flex;
      flex-direction: column;
    }

    .field-label {
      font-size: 12px;
      font-weight: 500;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .field-value {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }

    .department-badge {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-block;
      width: fit-content;
    }

    .department-analytics {
      background: #fff3e0;
      color: #ff6b35;
    }

    .department-tech {
      background: #f3e5f5;
      color: #7b1fa2;
    }

    .position-badge {
      padding: 4px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      background: #f8f9fa;
      color: #666;
      display: inline-block;
      width: fit-content;
    }

    .card-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      padding-top: 16px;
      border-top: 1px solid #f0f0f0;
    }

    @media (max-width: 768px) {
      .employee-card {
        padding: 16px;
      }

      .card-content {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .card-header {
        margin-bottom: 12px;
      }

      .employee-name {
        font-size: 16px;
      }
    }

    @media (max-width: 480px) {
      .card-actions {
        gap: 6px;
      }
    }
  `;

  handleSelect(e) {
    this.dispatchEvent(
      new CustomEvent('employee-select', {
        detail: {
          employeeId: this.employee.id,
          checked: e.target.checked,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  handleEdit() {
    this.dispatchEvent(
      new CustomEvent('employee-edit', {
        detail: { employeeId: this.employee.id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  handleDelete() {
    this.dispatchEvent(
      new CustomEvent('employee-delete', {
        detail: { employeeId: this.employee.id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    if (!this.employee) {
      return html``;
    }

    return html`
      <div class="employee-card ${this.selected ? 'selected' : ''}">
        <div class="card-header">
          <div>
            <h3 class="employee-name">
              ${this.employee.firstName} ${this.employee.lastName}
            </h3>
            <p class="employee-title">
              ${this.employee.position} • ${this.employee.department}
            </p>
          </div>
          <input
            type="checkbox"
            class="checkbox"
            .checked=${this.selected}
            @change=${this.handleSelect}
          />
        </div>

        <div class="card-content">
          <div class="field-group">
            <span class="field-label">${msg('First Name')}</span>
            <span class="field-value">${this.employee.firstName}</span>
          </div>

          <div class="field-group">
            <span class="field-label">${msg('Last Name')}</span>
            <span class="field-value">${this.employee.lastName}</span>
          </div>

          <div class="field-group">
            <span class="field-label">${msg('Date of Employment')}</span>
            <span class="field-value">${this.employee.dateOfEmployment}</span>
          </div>

          <div class="field-group">
            <span class="field-label">${msg('Date of Birth')}</span>
            <span class="field-value">${this.employee.dateOfBirth}</span>
          </div>

          <div class="field-group">
            <span class="field-label">${msg('Phone')}</span>
            <span class="field-value">${this.employee.phone}</span>
          </div>

          <div class="field-group">
            <span class="field-label">${msg('Email')}</span>
            <span class="field-value">${this.employee.email}</span>
          </div>

          <div class="field-group">
            <span class="field-label">${msg('Department')}</span>
            <span
              class="department-badge department-${this.employee.department?.toLowerCase()}"
            >
              ${this.employee.department}
            </span>
          </div>

          <div class="field-group">
            <span class="field-label">${msg('Position')}</span>
            <span class="position-badge">${this.employee.position}</span>
          </div>
        </div>

        ${this.showActions
          ? html`
              <div class="card-actions">
                <app-button
                  variant="ghost"
                  size="small"
                  icon="✏️"
                  @app-button-click=${this.handleEdit}
                >
                  ${msg('Edit')}
                </app-button>
                <app-button
                  variant="primary"
                  size="small"
                  icon="🗑️"
                  @app-button-click=${this.handleDelete}
                >
                  ${msg('Delete')}
                </app-button>
              </div>
            `
          : ''}
      </div>
    `;
  }
}

customElements.define('employee-card', EmployeeCard);
