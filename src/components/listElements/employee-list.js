import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';
import { msg } from '../../localization/index.js';
import { employeeStore } from '../../employee-store.js';
import '../buttons/app-button.js';
import './employee-search.js';
import './view-toggle.js';
import './pagination.js';
import './employee-table.js';

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
        // eslint-disable-next-line no-console
        console.error('Error adding sample data:', error);
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

    if (
      result.items.length === 0 &&
      result.totalPages > 0 &&
      this.currentPage > result.totalPages
    ) {
      this.currentPage = Math.max(1, result.totalPages);
      this.loadEmployees();
      return;
    }

    this.employees = result.items;
    this.totalPages = result.totalPages;
    this.totalItems = result.totalItems;
    this.requestUpdate();
  }

  handleSearch(e) {
    this.searchQuery = e.detail.value;
    this.currentPage = 1;
    this.loadEmployees();
  }

  handleSort(e) {
    const { field } = e.detail;
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.employees = employeeStore.sort(field, this.sortDirection);
    this.requestUpdate();
  }

  handlePageChange(e) {
    this.currentPage = e.detail.page;
    this.loadEmployees();
  }

  handleViewToggle(e) {
    this.viewMode = e.detail.view;
  }

  // eslint-disable-next-line class-methods-use-this
  handleEdit(e) {
    Router.go(`/edit/${e.detail.employeeId}`);
  }

  // eslint-disable-next-line class-methods-use-this
  handleDelete(e) {
    // eslint-disable-next-line no-alert, no-restricted-globals
    if (confirm(msg('Are you sure you want to delete this employee?'))) {
      try {
        employeeStore.delete(e.detail.employeeId);
      } catch (error) {
        // eslint-disable-next-line no-alert
        alert(msg('Error deleting employee'));
      }
    }
  }

  handleSelectEmployee(e) {
    const { employeeId, checked } = e.detail;
    if (checked) {
      this.selectedEmployees = [...this.selectedEmployees, employeeId];
    } else {
      this.selectedEmployees = this.selectedEmployees.filter(
        id => id !== employeeId,
      );
    }
  }

  handleSelectAll(e) {
    const { checked } = e.detail;
    if (checked) {
      this.selectedEmployees = this.employees.map(emp => emp.id);
    } else {
      this.selectedEmployees = [];
    }
  }

  render() {
    return html`
      <div class="list-header">
        <h1 class="list-title">${msg('Employee List')}</h1>
        <div class="header-controls">
          <employee-search
            .value=${this.searchQuery}
            @search-input=${this.handleSearch}
          ></employee-search>

          <view-toggle
            .currentView=${this.viewMode}
            @view-change=${this.handleViewToggle}
          ></view-toggle>
        </div>
      </div>

      ${this.employees.length === 0 && !this.searchQuery
        ? html`
            <div class="empty-state">
              <div class="empty-state-icon">👥</div>
              <h3>${msg('No employees yet')}</h3>
              <p>${msg('Add your first employee to get started')}</p>
            </div>
          `
        : html`
            <employee-table
              .employees=${this.employees}
              .selectedEmployees=${this.selectedEmployees}
              .sortField=${this.sortField}
              .sortDirection=${this.sortDirection}
              @sort-change=${this.handleSort}
              @employee-select=${this.handleSelectEmployee}
              @select-all=${this.handleSelectAll}
              @employee-edit=${this.handleEdit}
              @employee-delete=${this.handleDelete}
            ></employee-table>

            <pagination-component
              .currentPage=${this.currentPage}
              .totalPages=${this.totalPages}
              @page-change=${this.handlePageChange}
            ></pagination-component>
          `}
    `;
  }
}

customElements.define('employee-list', EmployeeList);
