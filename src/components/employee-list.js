import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { msg } from '../localization/index.js';
import { employeeStore } from '../employee-store.js';
import './app-button.js';

export class EmployeeList extends LitElement {
  static properties = {
    employees: { type: Array },
    searchQuery: { type: String },
    currentPage: { type: Number },
    pageSize: { type: Number },
    totalPages: { type: Number },
    totalItems: { type: Number },
    viewMode: { type: String },
    sortField: { type: String },
    sortDirection: { type: String },
    selectedEmployees: { type: Array },
  };

  constructor() {
    super();
    this.employees = [];
    this.searchQuery = '';
    this.currentPage = 1;
    this.pageSize = 10;
    this.totalPages = 0;
    this.totalItems = 0;
    this.viewMode = 'table';
    this.sortField = 'firstName';
    this.sortDirection = 'asc';
    this.selectedEmployees = [];
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
      color: #ff6b35;
    }

    .list-title {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
      color: #ff6b35;
    }

    .header-controls {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .search-container {
      position: relative;
    }

    .search-input {
      padding: 8px 12px 8px 36px;
      border: 1px solid #ddd;
      border-radius: 6px;
      width: 300px;
      font-size: 14px;
    }

    .search-input:focus {
      outline: none;
      border-color: #ff6b35;
      box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
      width: 16px;
      height: 16px;
    }

    .view-toggle {
      display: flex;
      gap: 4px;
    }

    .add-button {
      background: #ff6b35;
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background-color 0.2s;
    }

    .add-button:hover {
      background: #e55a2b;
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

    .employee-table th.sortable:hover {
      background: #e9ecef;
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

    .employee-table tr:hover {
      background: #f8f9fa;
    }

    .employee-table tr:hover td:last-child {
      background: #f8f9fa;
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

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 24px;
      padding: 16px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .pagination app-button {
      margin: 0;
    }

    .pagination app-button .button {
      padding: 8px 12px !important;
      border: 1px solid #ddd !important;
      background: white !important;
      color: #333 !important;
      border-radius: 4px !important;
      font-size: 14px !important;
      min-height: auto !important;
      box-shadow: none !important;
      transform: none !important;
    }

    .pagination app-button[active] .button {
      background: #ff6b35 !important;
      color: white !important;
      border-color: #ff6b35 !important;
    }

    .pagination app-button .button:disabled {
      opacity: 0.5 !important;
      cursor: not-allowed !important;
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
      .list-header {
        flex-direction: column;
        align-items: stretch;
      }

      .header-controls {
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 8px;
      }

      .search-input {
        width: 100%;
        max-width: 300px;
      }

      .table-container {
        border-radius: 8px 8px 0 0;
      }
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.addSampleDataIfEmpty();
    this.loadEmployees();
    this.unsubscribe = employeeStore.subscribe(() => {
      this.loadEmployees();
    });

    this.localeChangeHandler = () => {
      this.requestUpdate();
    };
    window.addEventListener('locale-changed', this.localeChangeHandler);
  }

  // eslint-disable-next-line class-methods-use-this
  addSampleDataIfEmpty() {
    if (employeeStore.getAll().length === 0) {
      try {
        const employees = [
          {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@company.com',
            phone: '+15551234567',
            dateOfEmployment: '2023-03-10',
            dateOfBirth: '1988-12-03',
            department: 'Analytics',
            position: 'Medior',
          },
          {
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob.johnson@company.com',
            phone: '+15552345678',
            dateOfEmployment: '2023-02-20',
            dateOfBirth: '1985-08-15',
            department: 'Tech',
            position: 'Junior',
          },
          {
            firstName: 'Alice',
            lastName: 'Brown',
            email: 'alice.brown@company.com',
            phone: '+15553456789',
            dateOfEmployment: '2023-04-05',
            dateOfBirth: '1992-03-10',
            department: 'Analytics',
            position: 'Senior',
          },
          {
            firstName: 'Charlie',
            lastName: 'Wilson',
            email: 'charlie.wilson@company.com',
            phone: '+15554567890',
            dateOfEmployment: '2023-05-12',
            dateOfBirth: '1987-11-25',
            department: 'Tech',
            position: 'Medior',
          },
          {
            firstName: 'Diana',
            lastName: 'Davis',
            email: 'diana.davis@company.com',
            phone: '+15555678901',
            dateOfEmployment: '2023-06-18',
            dateOfBirth: '1991-07-08',
            department: 'Analytics',
            position: 'Junior',
          },
          {
            firstName: 'Eva',
            lastName: 'Miller',
            email: 'eva.miller@company.com',
            phone: '+15556789012',
            dateOfEmployment: '2023-07-22',
            dateOfBirth: '1989-04-12',
            department: 'Tech',
            position: 'Senior',
          },
          {
            firstName: 'Frank',
            lastName: 'Garcia',
            email: 'frank.garcia@company.com',
            phone: '+15557890123',
            dateOfEmployment: '2023-08-14',
            dateOfBirth: '1986-09-30',
            department: 'Analytics',
            position: 'Medior',
          },
          {
            firstName: 'Grace',
            lastName: 'Martinez',
            email: 'grace.martinez@company.com',
            phone: '+15558901234',
            dateOfEmployment: '2023-09-05',
            dateOfBirth: '1993-01-18',
            department: 'Tech',
            position: 'Junior',
          },
          {
            firstName: 'Henry',
            lastName: 'Anderson',
            email: 'henry.anderson@company.com',
            phone: '+15559012345',
            dateOfEmployment: '2023-10-12',
            dateOfBirth: '1984-06-25',
            department: 'Analytics',
            position: 'Senior',
          },
          {
            firstName: 'Ivy',
            lastName: 'Taylor',
            email: 'ivy.taylor@company.com',
            phone: '+15550123456',
            dateOfEmployment: '2023-11-08',
            dateOfBirth: '1990-12-03',
            department: 'Tech',
            position: 'Medior',
          },
          {
            firstName: 'Jack',
            lastName: 'White',
            email: 'jack.white@company.com',
            phone: '+15551237890',
            dateOfEmployment: '2023-12-01',
            dateOfBirth: '1995-05-20',
            department: 'Analytics',
            position: 'Junior',
          },
          {
            firstName: 'Kate',
            lastName: 'Lee',
            email: 'kate.lee@company.com',
            phone: '+15552348901',
            dateOfEmployment: '2024-01-15',
            dateOfBirth: '1986-02-14',
            department: 'Tech',
            position: 'Senior',
          },
        ];

        employees.forEach(emp => employeeStore.add(emp));
      } catch (error) {
        console.log('Sample data not added:', error.message);
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    window.removeEventListener('locale-changed', this.localeChangeHandler);
  }

  loadEmployees() {
    const result = employeeStore.getPaginated(
      this.currentPage,
      this.pageSize,
      this.searchQuery,
    );

    this.employees = result.items;
    this.totalPages = result.totalPages;
    this.totalItems = result.totalItems;
    this.requestUpdate();
  }

  handleSearch(e) {
    this.searchQuery = e.target.value;
    this.currentPage = 1;
    this.loadEmployees();
  }

  handleSort(field) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.employees = employeeStore.sort(field, this.sortDirection);
    this.requestUpdate();
  }

  handlePageChange(page) {
    this.currentPage = page;
    this.loadEmployees();
  }

  handleViewToggle(mode) {
    this.viewMode = mode;
  }

  // eslint-disable-next-line class-methods-use-this
  handleEdit(employeeId) {
    Router.go(`/edit/${employeeId}`);
  }

  // eslint-disable-next-line class-methods-use-this
  handleDelete(employeeId) {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (confirm(msg('Are you sure you want to delete this employee?'))) {
      try {
        employeeStore.delete(employeeId);
        // Show success message
      } catch (error) {
        console.error('Error deleting employee:', error);
        // eslint-disable-next-line no-alert
        alert(msg('Error deleting employee'));
      }
    }
  }

  handleSelectEmployee(employeeId, checked) {
    if (checked) {
      this.selectedEmployees = [...this.selectedEmployees, employeeId];
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(
        id => id !== employeeId,
      );
    }
  }

  handleSelectAll(checked) {
    if (checked) {
      this.selectedEmployees = this.employees.map(emp => emp.id);
    } else {
      this.selectedEmployees = [];
    }
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
              this.employees.length}
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
      <tr>
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

  renderPagination() {
    const pages = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i += 1) {
      pages.push(i);
    }

    return html`
      <div class="pagination">
        <app-button
          variant="ghost"
          size="small"
          ?disabled=${this.currentPage === 1}
          @app-button-click=${() => this.handlePageChange(this.currentPage - 1)}
        >
          ${msg('Previous')}
        </app-button>

        ${pages.map(
          page => html`
            <app-button
              variant="ghost"
              size="small"
              ?active=${page === this.currentPage}
              @app-button-click=${() => this.handlePageChange(page)}
            >
              ${page}
            </app-button>
          `,
        )}

        <app-button
          variant="ghost"
          size="small"
          ?disabled=${this.currentPage === this.totalPages}
          @app-button-click=${() => this.handlePageChange(this.currentPage + 1)}
        >
          ${msg('Next')}
        </app-button>
      </div>
    `;
  }

  render() {
    return html`
      <div class="list-header">
        <h1 class="list-title">${msg('Employee List')}</h1>
        <div class="header-controls">
          <div class="search-container">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              class="search-input"
              placeholder=${msg('Search by name, email or phone...')}
              .value=${this.searchQuery}
              @input=${this.handleSearch}
            />
          </div>

          <div class="view-toggle">
            <app-button
              variant="ghost"
              size="small"
              icon="📋"
              ?active=${this.viewMode === 'table'}
              @app-button-click=${() => this.handleViewToggle('table')}
            >
              ${msg('Table View')}
            </app-button>
            <app-button
              variant="ghost"
              size="small"
              icon="🎯"
              ?active=${this.viewMode === 'card'}
              @app-button-click=${() => this.handleViewToggle('card')}
            >
              ${msg('Card View')}
            </app-button>
          </div>
        </div>
      </div>

      ${this.employees.length === 0
        ? html`
            <div class="empty-state">
              <div class="empty-state-icon">👥</div>
              <h3>${msg('No employees yet')}</h3>
              <p>${msg('Add your first employee to get started')}</p>
            </div>
          `
        : html`
            <div class="table-container">
              <table class="employee-table">
                ${this.renderTableHeader()}
                <tbody>
                  ${this.employees.map(employee =>
                    this.renderTableRow(employee),
                  )}
                </tbody>
              </table>
            </div>

            ${this.totalPages > 1 ? this.renderPagination() : ''}
          `}
    `;
  }
}

customElements.define('employee-list', EmployeeList);
