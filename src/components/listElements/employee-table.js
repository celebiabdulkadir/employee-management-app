import { LitElement, html, css } from 'lit';
import { msg } from '../../localization/index.js';
import '../buttons/app-button.js';

export class EmployeeTable extends LitElement {
  static properties = {
    employees: { type: Array },
    selectedEmployees: { type: Array },
    sortField: { type: String },
    sortDirection: { type: String },
    loading: { type: Boolean },
  };

  constructor() {
    super();
    this.employees = [];
    this.selectedEmployees = [];
    this.sortField = 'firstName';
    this.sortDirection = 'asc';
    this.loading = false;
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

    .table-container {
      background: white;
      border-radius: 8px;
      overflow-x: auto;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      position: relative;
    }

    .employee-table {
      width: 100%;
      min-width: 1000px;
      border-collapse: collapse;
    }

    .employee-table th {
      background: #f8f9fa;
      padding: 12px 8px;
      text-align: left;
      font-weight: 600;
      color: #ff6b35;
      font-size: 14px;
      border-bottom: 1px solid #e9ecef;
      white-space: nowrap;
    }

    .employee-table th:first-child {
      width: 40px;
      text-align: center;
      padding: 12px 4px;
    }

    .employee-table th:last-child {
      width: 100px;
      text-align: center;
      position: sticky;
      right: 0;
      background: #f8f9fa;
      border-left: 1px solid #e9ecef;
      z-index: 10;
    }

    .employee-table th.sortable {
      cursor: pointer;
      user-select: none;
      position: relative;
    }

    @media (hover: hover) {
      .employee-table th.sortable:hover {
        background: #e9ecef;
      }
    }

    .sort-indicator {
      margin-left: 4px;
      font-size: 12px;
      color: #666;
    }

    .employee-table td {
      padding: 12px 8px;
      border-bottom: 1px solid #f1f3f4;
      vertical-align: middle;
      font-size: 14px;
      color: #333;
    }

    .employee-table td:first-child {
      text-align: center;
      padding: 12px 4px;
    }

    .employee-table td:last-child {
      text-align: center;
      padding: 8px;
      position: sticky;
      right: 0;
      background: white;
      border-left: 1px solid #f1f3f4;
      z-index: 5;
    }

    .employee-table tr.selected {
      background: #fff3e0 !important;
    }

    .employee-table tr.selected td:last-child {
      background: #fff3e0 !important;
    }

    @media (hover: hover) {
      .employee-table tr:hover:not(.selected) {
        background: #f8f9fa;
      }

      .employee-table tr:hover:not(.selected) td:last-child {
        background: #f8f9fa;
      }

      .employee-table tr.selected:hover {
        background: #ffe0b3 !important;
      }

      .employee-table tr.selected:hover td:last-child {
        background: #ffe0b3 !important;
      }
    }

    .checkbox {
      width: 16px;
      height: 16px;
      cursor: pointer;
    }

    .employee-name {
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }

    .employee-email {
      color: #666;
      font-size: 14px;
    }

    .department-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      text-transform: uppercase;
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
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      background: #f5f5f5;
      color: #666;
    }

    .actions {
      display: flex;
      gap: 4px;
      justify-content: center;
      align-items: center;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-state-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    @media (max-width: 768px) {
      .table-container {
        border-radius: 8px 8px 0 0;
      }
    }
  `;

  handleSort(field) {
    this.dispatchEvent(
      new CustomEvent('sort-change', {
        detail: { field },
        bubbles: true,
        composed: true,
      }),
    );
  }

  handleSelectEmployee(employeeId, checked) {
    this.dispatchEvent(
      new CustomEvent('employee-select', {
        detail: { employeeId, checked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  handleSelectAll(checked) {
    this.dispatchEvent(
      new CustomEvent('select-all', {
        detail: { checked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  handleEdit(employeeId) {
    this.dispatchEvent(
      new CustomEvent('employee-edit', {
        detail: { employeeId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  handleDelete(employeeId) {
    this.dispatchEvent(
      new CustomEvent('employee-delete', {
        detail: { employeeId },
        bubbles: true,
        composed: true,
      }),
    );
  }

  renderTableHeader() {
    return html`
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              class="checkbox"
              .checked=${this.selectedEmployees.length ===
                this.employees.length && this.employees.length > 0}
              @change=${e => this.handleSelectAll(e.target.checked)}
            />
          </th>
          <th class="sortable" @click=${() => this.handleSort('firstName')}>
            ${msg('First Name')}
            ${this.sortField === 'firstName'
              ? html`<span class="sort-indicator"
                  >${this.sortDirection === 'asc' ? '↑' : '↓'}</span
                >`
              : ''}
          </th>
          <th class="sortable" @click=${() => this.handleSort('lastName')}>
            ${msg('Last Name')}
            ${this.sortField === 'lastName'
              ? html`<span class="sort-indicator"
                  >${this.sortDirection === 'asc' ? '↑' : '↓'}</span
                >`
              : ''}
          </th>
          <th
            class="sortable"
            @click=${() => this.handleSort('dateOfEmployment')}
          >
            ${msg('Date of Employment')}
            ${this.sortField === 'dateOfEmployment'
              ? html`<span class="sort-indicator"
                  >${this.sortDirection === 'asc' ? '↑' : '↓'}</span
                >`
              : ''}
          </th>
          <th class="sortable" @click=${() => this.handleSort('dateOfBirth')}>
            ${msg('Date of Birth')}
            ${this.sortField === 'dateOfBirth'
              ? html`<span class="sort-indicator"
                  >${this.sortDirection === 'asc' ? '↑' : '↓'}</span
                >`
              : ''}
          </th>
          <th>${msg('Phone')}</th>
          <th>${msg('Email')}</th>
          <th>${msg('Department')}</th>
          <th>${msg('Position')}</th>
          <th>${msg('Actions')}</th>
        </tr>
      </thead>
    `;
  }

  renderTableRow(employee) {
    const isSelected = this.selectedEmployees.includes(employee.id);

    return html`
      <tr class=${isSelected ? 'selected' : ''}>
        <td>
          <input
            type="checkbox"
            class="checkbox"
            .checked=${isSelected}
            @change=${e =>
              this.handleSelectEmployee(employee.id, e.target.checked)}
          />
        </td>
        <td class="employee-name">${employee.firstName}</td>
        <td class="employee-name">${employee.lastName}</td>
        <td>${employee.dateOfEmployment}</td>
        <td>${employee.dateOfBirth}</td>
        <td>${employee.phone}</td>
        <td class="employee-email">${employee.email}</td>
        <td>
          <span
            class="department-badge department-${employee.department?.toLowerCase()}"
          >
            ${employee.department}
          </span>
        </td>
        <td>
          <span class="position-badge">${employee.position}</span>
        </td>
        <td>
          <div class="actions">
            <app-button
              variant="ghost"
              size="small"
              icon="✏️"
              iconOnly
              @app-button-click=${() => this.handleEdit(employee.id)}
              title=${msg('Edit Employee')}
            ></app-button>
            <app-button
              variant="primary"
              size="small"
              icon="🗑️"
              iconOnly
              @app-button-click=${() => this.handleDelete(employee.id)}
              title=${msg('Delete Employee')}
            ></app-button>
          </div>
        </td>
      </tr>
    `;
  }

  render() {
    if (this.employees.length === 0) {
      return html`
        <div class="table-container">
          <div class="empty-state">
            <div class="empty-state-icon">👥</div>
            <h3>${msg('No employees found')}</h3>
            <p>${msg('Try adjusting your search criteria')}</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class="table-container">
        <table class="employee-table">
          ${this.renderTableHeader()}
          <tbody>
            ${this.employees.map(employee => this.renderTableRow(employee))}
          </tbody>
        </table>
      </div>
    `;
  }
}

customElements.define('employee-table', EmployeeTable);
